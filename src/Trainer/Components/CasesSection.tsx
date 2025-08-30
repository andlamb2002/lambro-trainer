import { useNavigate } from "react-router-dom";

import CaseItem from "./CaseItem";
import type { Case } from "../interfaces";

interface Props {
    cases: Case[];
    toggleCase: (id: string) => void;
    toggleAllCases: (enabled: boolean) => void;
    toggleCasesInSet: (setName: string, enabled: boolean) => void;    
}

function CasesSection({ cases, toggleCase, toggleAllCases, toggleCasesInSet }: Props) {

    const navigate = useNavigate();

    const groupedCases = cases.reduce<Record<string, Case[]>>((acc, c) => {
        if (!acc[c.set]) {
            acc[c.set] = [];
        }
        acc[c.set].push(c);
        return acc;
    }, {});

    return (
        <div>
            <button
                className="btn-primary"
                onClick={() => navigate("timer")}
            >
                Start
            </button>
            <div>
                <button className="btn btn-success" onClick={() => toggleAllCases(true)}>All</button>
                <button className="btn btn-danger" onClick={() => toggleAllCases(false)}>None</button>
            </div>
            {Object.entries(groupedCases).map(([setName, setCases]) => (
                <div key={setName}>
                    <h3>{setName}</h3>
                    <div>
                        <button className="btn btn-success" onClick={() => toggleCasesInSet(setName, true)}>All</button>
                        <button className="btn btn-danger" onClick={() => toggleCasesInSet(setName, false)}>None</button>
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