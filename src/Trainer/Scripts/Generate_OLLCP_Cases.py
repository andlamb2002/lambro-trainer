from utils import load_json, save_json,invert_alg, get_auf_moves, generate_case, generate_scramble

def subset_from_pll_and_auf(pll_item: dict, auf: str) -> int:
    pll_set = pll_item.get("set", "")
    if pll_set == "edges_only":
        return 1
    if pll_set == "diag_swap":
        return 2
    if pll_set == "adj_swap":
        auf_map = {"": 3, "U2": 4, "U": 5, "U'": 6}
        try:
            return auf_map[auf]
        except KeyError:
            raise ValueError(f"Unexpected AUF '{auf}' for adj_swap PLL '{pll_item.get('label')}'")
    raise ValueError(f"Unknown PLL set '{pll_set}' for PLL '{pll_item.get('label')}'")

def process_ollcp(oll_data: list[dict], pll_data: list[dict]):
    cases = []
    counter = 1

    for oll in oll_data:
        if oll["label"].lower() == "skip":
            continue

        inv_oll = invert_alg(oll["scramble"])
        buckets = {i: [] for i in range(1, 7)}

        for pll in pll_data:
            auf_list = get_auf_moves(pll["label"])
            for auf in auf_list:
                subset = subset_from_pll_and_auf(pll, auf)
                scramble = invert_alg(generate_scramble(pll, auf, inv_oll))
                buckets[subset].append(scramble)

        counts = {k: len(v) for k, v in buckets.items()}
        print(f"OLL {counter:02d} '{oll['label']}': subset counts {counts}")

        for subset in range(1, 7):
            case_id = f"OLL{counter:02d}_{subset:02d}"
            label = f"{counter:02d}_{subset:02d}_{oll['label']}"
            case = generate_case(
                case_id=case_id,
                label=label,
                scrambles=buckets[subset],
                original_alg=oll["scramble"],
                img_stage="coll",
                set_name=oll["set"]
            )
            case["subset"] = subset
            cases.append(case)

        counter += 1

    return cases

def main():
    pll_data = load_json("pll.json")
    oll_data = load_json("oll.json")
    all_cases = process_ollcp(oll_data, pll_data)
    save_json(all_cases, "ollcp_cases.json")

if __name__ == "__main__":
    main()
