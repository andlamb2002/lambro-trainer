import json
from pathlib import Path
import pycuber as pc
import kociemba

DATA_DIR = Path(__file__).parent.parent / "data"

def load_json(filename):
    with open(DATA_DIR / filename, "r") as f:
        return json.load(f)

PLL_DATA = load_json("pll.json")
OLL_DATA = load_json("oll.json")

color_map = {
    "white": "U", "red": "R", "green": "F",
    "yellow": "D", "orange": "L", "blue": "B"
}

z2_map = {'U': 'D', 'D': 'U', 'R': 'L', 'L': 'R', 'F': 'F', 'B': 'B'}

def invert_alg(alg):
    moves = alg.split()
    inverted = []
    for move in reversed(moves):
        if move.endswith("'"):
            inverted.append(move[:-1])
        elif move.endswith("2"):
            inverted.append(move) 
        else:
            inverted.append(move + "'")
    return " ".join(inverted)

def rotate_move_z2(move):
    face = move[0]
    modifier = move[1:] if len(move) > 1 else ''
    return z2_map[face] + modifier

def apply_z2_to_moves(moves_str):
    return ' '.join(rotate_move_z2(m) for m in moves_str.split())

def cube_to_kociemba_string(cube):
    face_order = ['U', 'R', 'F', 'D', 'L', 'B']
    s = ''
    for face in face_order:
        for row in range(3):
            for col in range(3):
                square = cube.get_face(face)[row][col]
                s += color_map[square.colour.lower()]
    return s

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
        
def process_all_cases(oll_data, pll_data):
    all_cases = []
    for i, oll in enumerate(oll_data, start=1):
        inv_oll = invert_alg(oll["scramble"])
        scrambles = []
        for pll in pll_data:
            for auf in get_auf_moves(pll["label"]):
                scrambles.append(invert_alg(generate_scramble(pll, auf, inv_oll)))
        all_cases.append({
            "id": f"OLL{str(i).zfill(2)}",
            "set": oll["set"],
            "label": oll["label"],
            "originalAlg": oll["scramble"],
            "scrambles": scrambles,
            "img": f"https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage=oll&bg=t&case={oll['scramble'].replace(' ','')}",
            "enabled": True
        })
        print(f"{oll['label']}: {len(scrambles)} scrambles")
    return all_cases

def save_json(data, filename):
    with open(DATA_DIR / filename, "w") as f:
        json.dump(data, f, indent=2)

def main():
    all_cases = process_all_cases(OLL_DATA, PLL_DATA)
    save_json(all_cases, "oll_cases.json")

if __name__ == "__main__":
    main()