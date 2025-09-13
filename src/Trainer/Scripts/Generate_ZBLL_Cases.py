# generate_zbll.py

import pycuber as pc
import kociemba
from collections import defaultdict

from utils import (
    load_json, save_json, invert_alg, apply_z2_to_moves,
    cube_to_kociemba_string, generate_case
)

# --- AUF helpers (same style as your PLL script) -----------------------------

def move_to_int(move):
    if move == 'U':
        return 1
    elif move == 'U2':
        return 2
    elif move == "U'":
        return 3
    else:
        return None

def int_to_move(i):
    if i == 1:
        return 'U'
    elif i == 2:
        return 'U2'
    elif i == 3:
        return "U'"
    else:
        return ''

def merge_adjacent_u_moves(moves_list):
    result = []
    i = 0
    while i < len(moves_list):
        move = moves_list[i]
        if move[0] == 'U':
            total = move_to_int(move)
            i += 1
            while i < len(moves_list) and moves_list[i][0] == 'U':
                val = move_to_int(moves_list[i])
                if val is not None:
                    total = (total + val) % 4
                i += 1
            if total != 0:
                result.append(int_to_move(total))
        else:
            result.append(move)
            i += 1
    return result

def generate_auf_variations(sequence_str: str) -> list[str]:
    """
    4x4 = 16 variations with prefix/suffix U-moves; merges adjacent U's.
    """
    auf_moves = ['', 'U', "U'", 'U2']
    variations = []
    for prefix in auf_moves:
        for suffix in auf_moves:
            parts = []
            if prefix:
                parts.append(prefix)
            parts.append(sequence_str)
            if suffix:
                parts.append(suffix)
            combined = ' '.join(parts)
            moves = combined.split()
            merged = merge_adjacent_u_moves(moves)
            variations.append(' '.join(merged))
    return variations

def choose_unique_solutions(solutions, max_solutions=4):
    chosen = []
    used_first_moves = set()
    for sol in solutions:
        moves = sol.split()
        if not moves:
            continue
        first = moves[0]
        if first not in used_first_moves:
            chosen.append(sol)
            used_first_moves.add(first)
        if len(chosen) == max_solutions:
            break
    if len(chosen) < max_solutions:
        for sol in solutions:
            if sol not in chosen:
                chosen.append(sol)
            if len(chosen) == max_solutions:
                break
    return chosen

# --- ZBLL-specific helpers ---------------------------------------------------

def solve_to_scramble(var_seq: str) -> str:
    """
    Apply var_seq to a fresh cube, normalize with z2, solve with kociemba,
    then map back from z2 (mirrors your other generators).
    """
    cube = pc.Cube()
    if var_seq.strip():
        cube(var_seq)
    cube("z2")
    state = cube_to_kociemba_string(cube)
    solution = kociemba.solve(state)
    return apply_z2_to_moves(solution)

def generate_scrambles_for_subset(base_combo: str, keep=4) -> list[str]:
    """
    Around the base (EPLL + AUF + inv(OCLL)), produce 16 AUF variations,
    solve each, and keep the 4 most unique (by first move).
    """
    sols = []
    for var in generate_auf_variations(base_combo):
        sols.append(solve_to_scramble(var))
    return choose_unique_solutions(sols, max_solutions=keep)

def make_epll_catalog(pll_data: list[dict]) -> dict:
    """
    Build a dict with scrambles for the needed EPLL bases.
    We expect labels 'Ua', 'Ub', 'H', 'Z', and optionally 'skip'.
    """
    by_label = {p['label']: p for p in pll_data}
    cat = {}
    required = ['Ua', 'Ub', 'H', 'Z']
    for lab in required:
        if lab not in by_label:
            raise ValueError(f"PLL data missing required label '{lab}' for EPLL.")
        cat[lab] = by_label[lab]['scramble']
    cat['skip'] = by_label.get('skip', {'scramble': ''}).get('scramble', '')
    return cat

def epll_subclasses(epll_cat: dict) -> list[tuple[int, str, str, str]]:
    """
    Define the 12 edge subclasses as (subset_index, human_tag, base_scramble, fixed_auf).
    - Ua/Ub each with 4 AUF offsets to enumerate distinct relative positions
    - Z with 2 distinct orientations (Z-a/Z-b)
    - H single orientation
    - skip (solved edges)
    """
    ua = epll_cat['Ua']
    ub = epll_cat['Ub']
    h  = epll_cat['H']
    z  = epll_cat['Z']
    sk = epll_cat['skip']

    # 1..12 ordered mapping (stable indices)
    mapping = [
        (1,  "skip",  sk, ''   ),
        (2,  "H",     h,  ''   ),
        (3,  "Z-a",   z,  ''   ),
        (4,  "Z-b",   z,  'U'  ),
        (5,  "Ua-0",  ua, ''   ),
        (6,  "Ua-1",  ua, 'U'  ),
        (7,  "Ua-2",  ua, 'U2' ),
        (8,  "Ua-3",  ua, "U'" ),
        (9,  "Ub-0",  ub, ''   ),
        (10, "Ub-1",  ub, 'U'  ),
        (11, "Ub-2",  ub, 'U2' ),
        (12, "Ub-3",  ub, "U'" ),
    ]
    return mapping

def build_bases_from_oll_cross(oll_data: list[dict]) -> list[dict]:
    """
    Take only OLL cross cases (edges oriented) and map the first 7 to ZBLL sets.
    We only need their scramble strings; they serve as the OCLL/CLL starting algs.
    """
    cross_olls = [o for o in oll_data if o.get('set') == 'cross' and o.get('label') != 'skip']
    if len(cross_olls) < 7:
        raise ValueError(f"Expected at least 7 OLL 'cross' entries, found {len(cross_olls)}.")

    # Assign sets in canonical ZBLL order. Reorder cross_olls if you want a different mapping.
    set_order = ["H", "Pi", "U", "T", "L", "Antisune", "Sune"]
    bases = []
    for i, set_name in enumerate(set_order):
        item = cross_olls[i]
        bases.append({
            "set": set_name,
            "label": f"{set_name} base",
            "alg": item["scramble"],   # treat as base OCLL/CLL alg
        })
    return bases

# --- Main processor ----------------------------------------------------------

def process_zbll(oll_data: list[dict], pll_data: list[dict]):
    """
    oll_data: full OLL catalog; we will filter to OLL 'cross' items (skip 'skip').
    pll_data: your existing PLL catalog (we only need Ua, Ub, H, Z, skip).
    Output: 504 ZBLL cases (7 sets × 6 cases per set × 12 subsets), each with 4 scrambles.
    """
    cases = []

    # Build 7 bases from OLL (cross) and prepare EPLL subclasses
    bases = build_bases_from_oll_cross(oll_data)  # 7 items
    ecat = make_epll_catalog(pll_data)
    subclasses = epll_subclasses(ecat)

    for base in bases:
        set_name = base['set']            # e.g., 'T'
        base_alg = base['alg']            # OCLL/CLL-like algorithm (edges oriented)
        base_inv = invert_alg(base_alg)

        # 6 "cases" per set (01..06). These are groupings per your UI; generation uses EPLL subclasses.
        for case_idx in range(1, 7):
            base_code = f"{set_name}{str(case_idx).zfill(2)}"  # e.g., T01 .. T06

            for subset_idx, subset_tag, epll_scramble, fixed_auf in subclasses:
                # Compose the combo that sets up this exact ZBLL state
                parts = []
                if epll_scramble:
                    parts.append(epll_scramble)
                if fixed_auf:
                    parts.append(fixed_auf)
                parts.append(base_inv)  # inverse of the OLL-cross base
                base_combo = ' '.join(parts)

                # Generate 16 AUF variants and keep 4 unique scrambles
                scrambles = generate_scrambles_for_subset(base_combo, keep=4)

                # Build id/label consistent with your subset modal code (ZBLL_<Base>_<Subset>)
                case_id = f"ZBLL{base_code}_{str(subset_idx).zfill(2)}"
                label = f"{base_code}_{str(subset_idx).zfill(2)}_{set_name}"

                case = generate_case(
                    case_id=case_id,
                    label=label,
                    scrambles=scrambles,
                    original_alg=base_alg,   # provenance
                    img_stage="ll",          # show exact LL state via alg=<first scramble>
                    set_name=set_name
                )
                case["subset"] = subset_idx
                cases.append(case)

            print(f"{set_name} case {case_idx:02d}: generated 12 subsets × 4 = 48 scrambles")

    return cases

def main():
    # Inputs you provide
    pll_data = load_json("pll.json")
    oll_data = load_json("oll.json")  # we will use only 'cross' items

    all_cases = process_zbll(oll_data, pll_data)
    save_json(all_cases, "zbll_cases.json")
    print(f"Total cases: {len(all_cases)}")  # should be 504

if __name__ == "__main__":
    main()
