import CaseItem from "./CaseItem";
import type { Case } from "../interfaces";

interface Props {
    cases: Case[];
    toggleCase: (id: string) => void;
    toggleAllCases: (enabled: boolean) => void;
    toggleCasesInSet: (setName: string, enabled: boolean) => void;    
}

function CasesSection({ cases, toggleCase, toggleAllCases, toggleCasesInSet }: Props) {

    const groupedCases = cases.reduce<Record<string, Case[]>>((acc, c) => {
        if (!acc[c.set]) {
            acc[c.set] = [];
        }
        acc[c.set].push(c);
        return acc;
    }, {});

    return (
        <div>
            <div>
                <button onClick={() => toggleAllCases(true)}>All</button>
                <button onClick={() => toggleAllCases(false)}>None</button>
            </div>
            {Object.entries(groupedCases).map(([setName, setCases]) => (
                <div key={setName}>
                    <h3>{setName}</h3>
                    <div>
                        <button onClick={() => toggleCasesInSet(setName, true)}>All</button>
                        <button onClick={() => toggleCasesInSet(setName, false)}>None</button>
                    </div>
                    {setCases.map((c) => (
                        <CaseItem key={c.id} c={c} toggleCase={toggleCase} />
                    ))}
                </div>
            ))}
        </div>
    )
}

export default CasesSection