import json
import os
import pycuber as pc

# Restrict to only double-symmetry cases
DOUBLE_SYMM_CASES = {"OLL01", "OLL20", "OLL21", "OLL55", "OLL56", "OLL57", "OLL58"}

FACE_MAP = {
    "white": "U",
    "yellow": "D",
    "green": "F",
    "blue": "B",
    "red": "R",
    "orange": "L",
}

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, "..", "data", "all_cases.json")

def scramble_to_state(scramble: str) -> str:
    """Convert a scramble into a canonical 54-character Kociemba string."""
    cube = pc.Cube()
    seq = pc.Formula(scramble)
    cube(seq)

    face_order = ["U", "R", "F", "D", "L", "B"]
    state = ""
    for face in face_order:
        for row in cube.get_face(face):
            for sticker in row:
                state += FACE_MAP[sticker.colour]
    return state

def conjugate_u2(scramble: str) -> str:
    """Return scramble with U2-conjugation applied: U2 + scramble + U2."""
    return f"U2 {scramble} U2"

# ----------------- Union-Find -----------------
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        pa, pb = self.find(a), self.find(b)
        if pa != pb:
            self.parent[pa] = pb

def find_duplicate_groups(scrambles: list[str]):
    """Find duplicate *groups* of scrambles under U2-conjugacy."""
    n = len(scrambles)
    print(f"   → Processing {n} scrambles...")

    states = [scramble_to_state(s) for s in scrambles]
    uf = UnionFind(n)

    for i in range(n):
        if i % 10 == 0:
            print(f"     Progress: {i}/{n}")
        for j in range(i + 1, n):
            conj_scramble = conjugate_u2(scrambles[j])
            s2 = scramble_to_state(conj_scramble)
            if states[i] == s2:
                uf.union(i, j)

    # Collect groups
    groups = {}
    for i in range(n):
        root = uf.find(i)
        groups.setdefault(root, []).append(scrambles[i])

    # Only keep groups with >1 scramble
    return [group for group in groups.values() if len(group) > 1]

def main():
    with open(DATA_FILE, "r") as f:
        data = json.load(f)

    for case in data:
        if case["id"] not in DOUBLE_SYMM_CASES:
            continue

        print(f"\n🔍 Checking case {case['id']} with {len(case['scrambles'])} scrambles")
        groups = find_duplicate_groups(case["scrambles"])
        if groups:
            print(f"✅ Found {len(groups)} groups of duplicates in {case['id']}:")
            for g in groups:
                print("  Group:", g)
        else:
            print("❌ No duplicates found")

if __name__ == "__main__":
    main()
