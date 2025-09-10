import type { Case, SubsetGroup } from "./Trainer/interfaces";

export const hasSubsets = (cases: Case[]) => cases.some(c => c.subset != null);

function groupBySet(cases: Case[]): Record<string, Case[]> {
    return cases.reduce<Record<string, Case[]>>((acc, c) => {
        (acc[c.set] ||= []).push(c);
        return acc;
    }, {});
}

export function groupSubsetsByBase(
    cases: Case[],
    opts: { getBaseId: (c: Case) => string }
    ): Record<string, SubsetGroup[]> {
        
    const getBaseId = opts.getBaseId;

    const sets = groupBySet(cases);
    const result: Record<string, SubsetGroup[]> = {};

    for (const [setName, setCases] of Object.entries(sets)) {
        const byBase: Record<string, Case[]> = {};
        for (const c of setCases) {
            const baseId = getBaseId(c);
            (byBase[baseId] ||= []).push(c);
            }

            result[setName] = Object.entries(byBase).map(([baseId, children]) => {
            const first = children[0];
            const sorted = [...children].sort((a, b) => (a.subset! - b.subset!));
            return {
                baseId,
                set: first.set,
                originalAlg: first.originalAlg,
                children: sorted,
            };
        });
    }

    return result;
}

export function aggregateEnabled(children: Case[]) {
    const total = children.length;
    const on = children.filter(c => c.enabled).length;
    return {
        total,
        on,
        state: (on === 0 ? "none" : on === total ? "all" : "some") as "none" | "all" | "some",
    };
}