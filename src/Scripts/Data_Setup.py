import json

PLL_SCRAMBLES = [
    "x R' U R' D2 R U' R' D2 R2 x'",
    "x R2 D2 R U R' D2 R U' R x'",
    "x' R U' R' D R U R' D' R U R' D R U' R' D' x",
    "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
    "R2 U R' U R' U' R U' R2 D U' R' U R D'",
    "R' U' R U D' R2 U R' U R U' R U' R2 D",
    "R2 U' R U' R U R' U R2 D' U R U' R' D",
    "R U R' U' D R2 U' R U' R' U R' U R2 D'",
    "R2 U2 R U2 R2 U2 R2 U2 R U2 R2",
    "x R2 F R F' R U2 r' U r U2 x'",
    "R U R' F' R U R' U' R' F R2 U' R'",
    "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
    "R' U L' U2 R U' L R' U L' U2 R U' L",
    "R U' R' U' R U R D R' U' R D' R' U2 R'",
    "R2 F R U R U' R' F' R U2 R' U2 R",
    "R U R' U' R' F R2 U' R' U' R U R' F'",
    "R U' R U R U R U' R' U' R2",
    "R2 U R U R' U' R' U' R' U R'",
    "R' U R U' R' f' U' R U2 R' U' R U' R' f R",
    "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    "R' U' R U' R U R U' R' U R U R2 U' R'",
]

PLL_LABELS = [
    "Aa","Ab","E","F","Ga","Gb","Gc","Gd","H","Ja","Jb",
    "Na","Nb","Ra","Rb","T","Ua","Ub","V","Y","Z"
]

def combine_cases(scrambles, labels):
    if len(scrambles) != len(labels):
        raise ValueError("Scrambles and labels must be the same length")
    return [{"label": label, "scramble": scramble}
            for label, scramble in zip(labels, scrambles)]


if __name__ == "__main__":
    merged_cases = combine_cases(PLL_SCRAMBLES, PLL_LABELS)
    print(json.dumps(merged_cases, indent=2))