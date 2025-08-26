import pycuber as pc
import kociemba

from utils import load_json, save_json, invert_alg, apply_z2_to_moves, cube_to_kociemba_string, generate_case

# DATA_DIR = Path(__file__).parent.parent / "data"

# def load_json(filename):
#     with open(DATA_DIR / filename, "r") as f:
#         return json.load(f)

# PLL_DATA = load_json("pll.json")
# OLL_DATA = load_json("oll.json")

# def invert_alg(alg):
#     moves = alg.split()
#     inverted = []
#     for move in reversed(moves):
#         if move.endswith("'"):
#             inverted.append(move[:-1])
#         elif move.endswith("2"):
#             inverted.append(move) 
#         else:
#             inverted.append(move + "'")
#     return " ".join(inverted)

# def rotate_move_z2(move):
#     face = move[0]
#     modifier = move[1:] if len(move) > 1 else ''
#     return z2_map[face] + modifier

# def apply_z2_to_moves(moves_str):
#     return ' '.join(rotate_move_z2(m) for m in moves_str.split())

# def cube_to_kociemba_string(cube):
#     face_order = ['U', 'R', 'F', 'D', 'L', 'B']
#     s = ''
#     for face in face_order:
#         for row in range(3):
#             for col in range(3):
#                 square = cube.get_face(face)[row][col]
#                 s += color_map[square.colour.lower()]
#     return s

def generate_scramble(pll, auf, inv_oll):
    cube = pc.Cube()
    combo = ' '.join(x for x in [pll["scramble"], auf, inv_oll] if x)
    if combo.strip():
        cube(combo)
    cube("z2") 
    state_str = cube_to_kociemba_string(cube)
    solution = kociemba.solve(state_str)
    return apply_z2_to_moves(solution)

def get_auf_moves(pll_label):
    if pll_label in {"skip", "H", "Na", "Nb"}:
        return [""]
    elif pll_label in {"E", "Z"}:
        return ["", "U"]
    else:
        return ["", "U", "U'", "U2"]
        
# def process_all_cases(oll_data, pll_data):
#     all_cases = []
#     for i, oll in enumerate(oll_data, start=1):
#         inv_oll = invert_alg(oll["scramble"])
#         scrambles = []
#         for pll in pll_data:
#             for auf in get_auf_moves(pll["label"]):
#                 scrambles.append(invert_alg(generate_scramble(pll, auf, inv_oll)))
#         all_cases.append({
#             "id": f"OLL{str(i).zfill(2)}",
#             "set": oll["set"],
#             "label": oll["label"],
#             "originalAlg": oll["scramble"],
#             "scrambles": scrambles,
#             "img": f"https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage=oll&bg=t&case={oll['scramble'].replace(' ','')}",
#             "enabled": True
#         })
#         print(f"{oll['label']}: {len(scrambles)} scrambles")
#     return all_cases

# def save_json(data, filename):
#     with open(DATA_DIR / filename, "w") as f:
#         json.dump(data, f, indent=2)

def process_oll(oll_data: list[dict], pll_data: list[dict]):
    cases = []
    counter = 1
    for oll in oll_data:
        if oll["label"].lower() == "skip":
            continue

        inv_oll = invert_alg(oll["scramble"])
        scrambles = []

        for pll in pll_data:
            for auf in get_auf_moves(pll["label"]):
                scrambles.append(invert_alg(generate_scramble(pll, auf, inv_oll)))

        case_id = f"OLL{str(counter).zfill(2)}"
        cases.append(generate_case(
            case_id,
            oll["label"],
            scrambles,
            oll["scramble"],
            set_name=oll["set"],
            img_stage="oll"
        ))
        print(f"{oll['label']}: {len(scrambles)} scrambles")
        counter += 1

    return cases

def main():
    # all_cases = process_all_cases(OLL_DATA, PLL_DATA)
    # save_json(all_cases, "oll_cases.json")

    pll_data = load_json("pll.json")
    oll_data = load_json("oll.json")
    all_cases = process_oll(oll_data, pll_data)
    save_json(all_cases, "oll_cases.json")

if __name__ == "__main__":
    main()