import CaseItem from "./CaseItem";
import type { Case } from "../interfaces";

interface Props {
  cases: Case[];
  toggleCase: (id: string) => void;
}

function CasesSection({ cases, toggleCase }: Props) {

    const groupedCases = cases.reduce<Record<string, Case[]>>((acc, c) => {
        if (!acc[c.set]) {
            acc[c.set] = [];
        }
        acc[c.set].push(c);
        return acc;
    }, {});

    return (
        <div>
            {Object.entries(groupedCases).map(([setName, setCases]) => (
                <div key={setName}>
                    <h3>{setName}</h3>
                    {setCases.map((c) => (
                        <CaseItem key={c.id} c={c} toggleCase={toggleCase} />
                    ))}
                </div>
            ))}
        </div>
    )
}

export default CasesSection