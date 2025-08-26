import pycuber as pc
import kociemba

from utils import load_json, save_json, invert_alg, apply_z2_to_moves, cube_to_kociemba_string, generate_case

def move_to_int(move):
    if move == 'U':
        return 1
    elif move == "U2":
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

def generate_auf_variations(scramble):
    auf_moves = ['', 'U', "U'", 'U2']
    variations = []
    for prefix in auf_moves:
        for suffix in auf_moves:
            parts = []
            if prefix != '':
                parts.append(prefix)
            parts.append(scramble)
            if suffix != '':
                parts.append(suffix)
            combined = ' '.join(parts)
            moves = combined.split()
            merged_moves = merge_adjacent_u_moves(moves)
            variations.append(' '.join(merged_moves))
    return variations

def choose_unique_solutions(solutions, max_solutions=4):
    chosen = []
    used_first_moves = set()

    for sol in solutions:
        moves = sol.split()
        if not moves:
            continue
        first_move = moves[0]
        if first_move not in used_first_moves:
            chosen.append(sol)
            used_first_moves.add(first_move)
        if len(chosen) == max_solutions:
            break

    if len(chosen) < max_solutions:
        for sol in solutions:
            if sol not in chosen:
                chosen.append(sol)
            if len(chosen) == max_solutions:
                break

    return chosen

def generate_scrambles(base_scramble: str) -> list[str]:
    solutions = []
    for var in generate_auf_variations(base_scramble):
        cube = pc.Cube()
        cube(var)
        cube("z2")
        state = cube_to_kociemba_string(cube)
        solution = kociemba.solve(state)
        corrected = apply_z2_to_moves(solution)
        solutions.append(corrected)
    return choose_unique_solutions(solutions, 4)

def process_pll(pll_data):
    cases = []
    counter = 1
    for pll in pll_data:
        if pll["label"].lower() == "skip":
            continue
        
        scrambles = generate_scrambles(pll["scramble"])
        case_id = f"PLL{str(counter).zfill(2)}"
        cases.append(generate_case(
            case_id,
            pll["label"],
            scrambles,
            pll["scramble"],
            set_name=pll["set"] 
        ))
        print(f"{pll['label']}: {len(scrambles)} scrambles")
        counter += 1
    return cases

def main():

    pll_data = load_json("pll.json")
    all_cases = process_pll(pll_data)
    save_json(all_cases, "pll_cases.json")

if __name__ == "__main__":
    main()
