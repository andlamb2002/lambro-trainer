import json
import pycuber as pc
from pathlib import Path
import kociemba

DATA_DIR = Path(__file__).parent.parent / "data"

COLOR_MAP = {
    "white": "U", "red": "R", "green": "F",
    "yellow": "D", "orange": "L", "blue": "B"
}

Z2_MAP = {'U': 'D', 'D': 'U', 'R': 'L', 'L': 'R', 'F': 'F', 'B': 'B'}

def load_json(filename: str):
    with open(DATA_DIR / filename, "r") as f:
        return json.load(f)

def save_json(data, filename: str):
    with open(DATA_DIR / filename, "w") as f:
        json.dump(data, f, indent=2)

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
    return " ".join(inverted)

def rotate_move_z2(move: str) -> str:
    face = move[0]
    modifier = move[1:] if len(move) > 1 else ''
    return Z2_MAP[face] + modifier

def apply_z2_to_moves(moves_str: str) -> str:
    return ' '.join(rotate_move_z2(m) for m in moves_str.split())

def get_auf_moves(pll_label):
    if pll_label in {"skip", "H", "Na", "Nb"}:
        return [""]
    elif pll_label in {"E", "Z"}:
        return ["", "U"]
    else:
        return ["", "U", "U'", "U2"]

def cube_to_kociemba_string(cube: pc.Cube) -> str:
    face_order = ['U', 'R', 'F', 'D', 'L', 'B']
    s = ''
    for face in face_order:
        for row in range(3):
            for col in range(3):
                square = cube.get_face(face)[row][col]
                s += COLOR_MAP[square.colour.lower()]
    return s

def generate_case(case_id: str, label: str, scrambles: list[str],
                  original_alg: str, img_stage: str = None, set_name: str = None):
    case = {
        "id": case_id,
        "set": set_name,
        "label": label,
        "originalAlg": original_alg,
        "scrambles": scrambles,
        "img": f"https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&bg=t&case={original_alg.replace(' ','')}",
        "enabled": True,
    }
    if img_stage == "oll":
        case["img"] = f"https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage={img_stage}&bg=t&case={original_alg.replace(' ','')}"
    elif img_stage:
        case["img"] = f"https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage={img_stage}&bg=t&alg={scrambles[0].replace(' ','')}"
    return case

def generate_scramble(pll, auf, inv_oll):
    cube = pc.Cube()
    combo = ' '.join(x for x in [pll["scramble"], auf, inv_oll] if x)
    if combo.strip():
        cube(combo)
    cube("z2") 
    state_str = cube_to_kociemba_string(cube)
    solution = kociemba.solve(state_str)
    return apply_z2_to_moves(solution)