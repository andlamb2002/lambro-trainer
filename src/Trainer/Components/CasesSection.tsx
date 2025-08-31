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

    function formatSetName(name: string): string {
        return name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    }

    return (
        <div>
            <button
                className="btn btn-primary"
                onClick={() => navigate("timer")}
            >
                Start
            </button>

            <div className="flex gap-2">
                <h2 className="text-xl font-bold underline">Case Selection</h2>
                <button className="btn btn-success" onClick={() => toggleAllCases(true)}>All</button>
                <button className="btn btn-danger" onClick={() => toggleAllCases(false)}>None</button>
            </div>
            
            {Object.entries(groupedCases).map(([setName, setCases]) => (
                <div key={setName}>
                    <div className="flex justify-between items-center py-4">
                        <div className="flex gap-2">
                            <h3 className="text-lg underline">{formatSetName(setName)}</h3>
                            <button className="btn btn-success" onClick={() => toggleCasesInSet(setName, true)}>All</button>
                            <button className="btn btn-danger" onClick={() => toggleCasesInSet(setName, false)}>None</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-10 justify-start" >
                        {setCases.map((c) => (
                            <CaseItem key={c.id} c={c} toggleCase={toggleCase} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CasesSection