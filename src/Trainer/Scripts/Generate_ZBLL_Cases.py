# generate_zbll.py

import pycuber as pc
import kociemba

from utils import (
    load_json, save_json, invert_alg, apply_z2_to_moves,  # apply_z2_to_moves is needed to unmap z2
    cube_to_kociemba_string, generate_case, get_auf_moves
)

# -------------------------
# AUF helpers (same as before)
# -------------------------

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
    16 variations with prefix/suffix U-moves; merges adjacent U's.
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
    """
    Keep up to max_solutions by distinct first move.
    """
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

# -------------------------
# Kociemba helper (solve after z2-normalization)
# -------------------------

def solve_then_invert_to_scramble(seq: str) -> str:
    """
    Apply seq to a fresh cube, z2-normalize, solve with kociemba,
    map solution back from z2, THEN invert to get a valid scramble
    (so: scramble + originalAlg = solved).  # CHANGE: explicit inversion.
    """
    cube = pc.Cube()
    if seq.strip():
        cube(seq)
    cube("z2")
    state = cube_to_kociemba_string(cube)
    solution = kociemba.solve(state)
    solution_unz2 = apply_z2_to_moves(solution)  # back to original orientation
    return invert_alg(solution_unz2)             # store as scramble

# -------------------------
# Pull 7 OLL-cross bases (one per ZBLL set)
# -------------------------

def build_bases_from_oll_cross(oll_data: list[dict]) -> list[dict]:
    """
    We only need 7 OLL 'cross' entries (skip 'skip'), one per ZBLL set:
    H, Pi, U, T, L, Antisune, Sune. Each will be cloned into 6 parents.
    """
    cross_olls = [o for o in oll_data if o.get('set') == 'cross' and o.get('label', '').lower() != 'skip']
    if len(cross_olls) < 7:
        raise ValueError(f"Expected 7 OLL 'cross' entries, found {len(cross_olls)}.")

    set_order = ["H", "Pi", "U", "T", "L", "Antisune", "Sune"]
    # stable pick: sort by label so order is deterministic
    cross_sorted = sorted(cross_olls, key=lambda x: x.get('label', ''))

    bases = []
    for i, set_name in enumerate(set_order):
        item = cross_sorted[i]
        bases.append({
            "set": set_name,
            "alg": item["scramble"],  # base (edges oriented)
        })
    return bases

# -------------------------
# Subset indexing (exactly per your description)
# -------------------------

# Fixed order of 12 "adj" PLLs used in cases 3..6 (must match labels in pll.json)
ADJ_PLL_ORDER = ["Aa", "Ab", "F", "Ga", "Gb", "Gc", "Gd", "Ja", "Jb", "Ra", "Rb", "T"]

# Mapping AUF order we will use whenever 4 AUFs are needed
AUF_ORDER_FOUR = ["", "U", "U2", "U'"]  # CHANGE: explicit, no y/y2 ever.

def subset_index_case1(label: str, auf: str) -> int:
    """
    Case 1 (edges): 12 subsets in this order:
      1: skip
      2: H
      3..4: Z with AUFs: "", "U"
      5..8: Ua with AUFs: "", "U", "U2", "U'"
      9..12: Ub with AUFs: "", "U", "U2", "U'"
    """
    if label == "skip": return 1
    if label == "H":    return 2
    if label == "Z":    return 3 if auf == "" else 4
    if label == "Ua":   return 5 + AUF_ORDER_FOUR.index(auf)
    if label == "Ub":   return 9 + AUF_ORDER_FOUR.index(auf)
    raise ValueError(f"Case1 unexpected PLL '{label}'/AUF '{auf}'")

def subset_index_case2(label: str, auf: str) -> int:
    """
    Case 2 (diag): 12 subsets in this order:
      1: Na
      2: Nb
      3..4: E with AUFs: "", "U"
      5..8: V with AUFs: "", "U", "U2", "U'"
      9..12: Y with AUFs: "", "U", "U2", "U'"
    """
    if label == "Na": return 1
    if label == "Nb": return 2
    if label == "E":  return 3 if auf == "" else 4
    if label == "V":  return 5 + AUF_ORDER_FOUR.index(auf)
    if label == "Y":  return 9 + AUF_ORDER_FOUR.index(auf)
    raise ValueError(f"Case2 unexpected PLL '{label}'/AUF '{auf}'")

def fixed_auf_for_parent_idx(parent_idx: int) -> str:
    """
    Cases 3..6 use 12 adj PLLs with a single fixed AUF per case:
      case 3: ""
      case 4: "U2"
      case 5: "U"
      case 6: "U'"
    """
    if parent_idx == 3: return ""
    if parent_idx == 4: return "U2"
    if parent_idx == 5: return "U"
    if parent_idx == 6: return "U'"
    raise ValueError(f"Unexpected parent_idx '{parent_idx}' for fixed AUF")

# -------------------------
# Main processor
# -------------------------

def process_zbll(oll_data: list[dict], pll_data: list[dict]):
    """
    7 sets × 6 parents × 12 subsets × 4 scrambles = 2016 total scrambles.
    For each parent, we build combos "PLL + AUF + inv(base)" and then:
      - generate 16 U-prefix/suffix variations
      - Kociemba solve each
      - invert the solution to store a real scramble (sets up the state)
      - keep up to 4 by unique first move
    """
    # Index PLLs by label for quick access
    by_label = {p['label']: p for p in pll_data}

    # Validate presence of required PLL labels (skip may be missing; treat as no-move)
    required = {"H", "Z", "Ua", "Ub", "Na", "Nb", "E", "V", "Y"} | set(ADJ_PLL_ORDER)
    missing = [lab for lab in required if lab not in by_label]
    if missing:
        raise ValueError(f"Missing PLL(s) in pll.json: {missing}")

    bases = build_bases_from_oll_cross(oll_data)  # 7 items (H, Pi, U, T, L, Antisune, Sune)

    cases = []
    for base in bases:
        set_name = base['set']
        base_alg = base['alg']
        base_inv = invert_alg(base_alg)

        # 6 parents per set
        for parent_idx in range(1, 7):
            base_code = f"{set_name}{parent_idx:02d}"

            # Buckets for 12 subsets
            buckets = {i: [] for i in range(1, 13)}

            if parent_idx == 1:
                # Case 1: edges-only families
                plan = [
                    ("skip", [""]),     # may be absent in pll.json; treat as no-move
                    ("H",    [""]),
                    ("Z",    ["", "U"]),
                    ("Ua",   AUF_ORDER_FOUR),
                    ("Ub",   AUF_ORDER_FOUR),
                ]
                for lab, aufs in plan:
                    pll = by_label.get(lab, {"label": "skip", "scramble": ""}) if lab == "skip" else by_label[lab]
                    for auf in aufs:
                        subset = subset_index_case1(lab, auf)
                        core = ' '.join(x for x in [pll["scramble"], auf, base_inv] if x)
                        for var in generate_auf_variations(core):
                            scramble = solve_then_invert_to_scramble(var)  # CHANGE: store inverse(solution)
                            buckets[subset].append(scramble)

            elif parent_idx == 2:
                # Case 2: diagonal families
                plan = [
                    ("Na", [""]),
                    ("Nb", [""]),
                    ("E",  ["", "U"]),
                    ("V",  AUF_ORDER_FOUR),
                    ("Y",  AUF_ORDER_FOUR),
                ]
                for lab, aufs in plan:
                    pll = by_label[lab]
                    for auf in aufs:
                        subset = subset_index_case2(lab, auf)
                        core = ' '.join(x for x in [pll["scramble"], auf, base_inv] if x)
                        for var in generate_auf_variations(core):
                            scramble = solve_then_invert_to_scramble(var)  # CHANGE: store inverse(solution)
                            buckets[subset].append(scramble)

            else:
                # Cases 3..6: 12 adj PLLs with a single fixed AUF per parent
                fixed_auf = fixed_auf_for_parent_idx(parent_idx)
                for i, lab in enumerate(ADJ_PLL_ORDER):
                    subset = i + 1  # 1..12 in the given order
                    pll = by_label[lab]
                    core = ' '.join(x for x in [pll["scramble"], fixed_auf, base_inv] if x)
                    for var in generate_auf_variations(core):
                        scramble = solve_then_invert_to_scramble(var)      # CHANGE: store inverse(solution)
                        buckets[subset].append(scramble)

            # Emit 12 children (pick up to 4 unique each)
            for subset in range(1, 13):
                scrambles = choose_unique_solutions(buckets[subset], max_solutions=4)

                case_id = f"ZBLL{base_code}_{subset:02d}"
                label   = f"{base_code}_{subset:02d}_{set_name}"

                case = generate_case(
                    case_id=case_id,
                    label=label,
                    scrambles=scrambles,
                    original_alg=base_alg,  # used by parent tile preview
                    img_stage="ll",         # children show exact LL state (alg=<first scramble>)
                    set_name=set_name
                )
                case["subset"] = subset
                cases.append(case)

            print(f"{set_name} {base_code}: 12 subsets × ≤4 scrambles")

    return cases

def main():
    pll_data = load_json("pll.json")
    oll_data = load_json("oll.json")  # we will use only 'cross' items

    all_cases = process_zbll(oll_data, pll_data)
    save_json(all_cases, "zbll_cases.json")
    print(f"Total cases: {len(all_cases)}")  # should be 7*6*12 = 504

if __name__ == "__main__":
    main()
