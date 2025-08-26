import pycuber as pc
import kociemba

from utils import load_json, save_json, invert_alg, apply_z2_to_moves, cube_to_kociemba_string, generate_case

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
        output_label = f"{str(counter).zfill(2)}_{oll['label']}"

        cases.append(generate_case(
            case_id,
            output_label,
            scrambles,
            oll["scramble"],
            set_name=oll["set"],
            img_stage="oll"
        ))
        print(f"{oll['label']}: {len(scrambles)} scrambles")
        counter += 1

    return cases

def main():

    pll_data = load_json("pll.json")
    oll_data = load_json("oll.json")
    all_cases = process_oll(oll_data, pll_data)
    save_json(all_cases, "oll_cases.json")

if __name__ == "__main__":
    main()