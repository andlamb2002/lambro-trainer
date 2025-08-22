import pycuber as pc
import kociemba
import json

PLL_DATA = [
  {
    "label": "Aa",
    "scramble": "x R' U R' D2 R U' R' D2 R2 x'"
  },
  {
    "label": "Ab",
    "scramble": "x R2 D2 R U R' D2 R U' R x'"
  },
  {
    "label": "E",
    "scramble": "x' R U' R' D R U R' D' R U R' D R U' R' D' x"
  },
  {
    "label": "F",
    "scramble": "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"
  },
  {
    "label": "Ga",
    "scramble": "R2 U R' U R' U' R U' R2 D U' R' U R D'"
  },
  {
    "label": "Gb",
    "scramble": "R' U' R U D' R2 U R' U R U' R U' R2 D"
  },
  {
    "label": "Gc",
    "scramble": "R2 U' R U' R U R' U R2 D' U R U' R' D"
  },
  {
    "label": "Gd",
    "scramble": "R U R' U' D R2 U' R U' R' U R' U R2 D'"
  },
  {
    "label": "H",
    "scramble": "R2 U2 R U2 R2 U2 R2 U2 R U2 R2"
  },
  {
    "label": "Ja",
    "scramble": "x R2 F R F' R U2 r' U r U2 x'"
  },
  {
    "label": "Jb",
    "scramble": "R U R' F' R U R' U' R' F R2 U' R'"
  },
  {
    "label": "Na",
    "scramble": "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'"
  },
  {
    "label": "Nb",
    "scramble": "R' U L' U2 R U' L R' U L' U2 R U' L"
  },
  {
    "label": "Ra",
    "scramble": "R U' R' U' R U R D R' U' R D' R' U2 R'"
  },
  {
    "label": "Rb",
    "scramble": "R2 F R U R U' R' F' R U2 R' U2 R"
  },
  {
    "label": "T",
    "scramble": "R U R' U' R' F R2 U' R' U' R U R' F'"
  },
  {
    "label": "Ua",
    "scramble": "R U' R U R U R U' R' U' R2"
  },
  {
    "label": "Ub",
    "scramble": "R2 U R U R' U' R' U' R' U R'"
  },
  {
    "label": "V",
    "scramble": "R' U R U' R' f' U' R U2 R' U' R U' R' f R"
  },
  {
    "label": "Y",
    "scramble": "F R U' R' U' R U R' F' R U R' U' R' F R F'"
  },
  {
    "label": "Z",
    "scramble": "R' U' R U' R U R U' R' U R U R2 U' R'"
  }
]

color_map = {
    "white": "U",
    "red": "R",
    "green": "F",
    "yellow": "D",
    "orange": "L",
    "blue": "B"
}

z2_map = {
    'U': 'D',
    'D': 'U',
    'R': 'L',
    'L': 'R',
    'F': 'F',
    'B': 'B'
}

def invert_alg(alg: str) -> str:
    moves = alg.split()
    inverted = []
    for move in reversed(moves):
        if move.endswith("'"):
            inverted.append(move[:-1])
        elif move.endswith("2"):
            inverted.append(move)
        else:
            inverted.append(move + "'")
    return ' '.join(inverted)

def rotate_move_z2(move):
    face = move[0]
    modifier = move[1:] if len(move) > 1 else ''
    new_face = z2_map[face]
    return new_face + modifier

def apply_z2_to_moves(moves_str):
    moves = moves_str.split()
    rotated_moves = [rotate_move_z2(move) for move in moves]
    return ' '.join(rotated_moves)

def cube_to_kociemba_string(cube):
    face_order = ['U', 'R', 'F', 'D', 'L', 'B']
    s = ''
    for face in face_order:
        for row in range(3):
            for col in range(3):
                square = cube.get_face(face)[row][col]
                color_char = color_map.get(square.colour.lower())
                if color_char is None:
                    raise ValueError(f"Unknown color: {square.colour}")
                s += color_char
    if len(s) != 54:
        raise ValueError(f"Cube string length invalid: {len(s)}")
    return s

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

def solve_scrambles(case_data):
    results = []
    for case in case_data:
        scramble = case["scramble"]
        solutions_for_scramble = []
        auf_variations = generate_auf_variations(scramble)
        for var_scramble in auf_variations:
            cube = pc.Cube()
            cube(var_scramble)
            cube("z2") 
            state_str = cube_to_kociemba_string(cube)
            solution = kociemba.solve(state_str)
            corrected_solution = apply_z2_to_moves(solution)
            solutions_for_scramble.append(corrected_solution)
        chosen_solutions = choose_unique_solutions(solutions_for_scramble, 4)
        results.append((scramble, chosen_solutions))
    return results

def generate_case(scramble, label, solutions, index):
    return {
        'id': str(index + 1).zfill(2),
        'label': label,
        'scrambles': solutions,
        'originalAlg': invert_alg(scramble),
        'img': f'https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&bg=t&case={scramble.replace(" ", "")}',
        'enabled': True,
    }

def export_cases_to_json(cases_data, results, filename):
    cases = []
    for i, (scramble, solutions) in enumerate(results):
        label = cases_data[i]["label"]
        cases.append(generate_case(scramble, label, solutions, i))
    with open(filename, 'w') as f:
        json.dump(cases, f, indent=2)

def main():
    results = solve_scrambles(PLL_DATA)
    pll_file = "../data/pll_cases.json"
    export_cases_to_json(PLL_DATA, results, pll_file)

    for scramble, chosen_solutions in results:
        print(f"Base Scramble: {scramble}")
        for solution in chosen_solutions:
            print(f" Solution: {solution}")
        print()

if __name__ == "__main__":
    main()
