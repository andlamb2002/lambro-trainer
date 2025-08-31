import { useNavigate } from "react-router-dom";

import CaseItem from "./CaseItem";
import type { Case } from "../interfaces";

import { MdArrowForward } from "react-icons/md";

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
        <div className="px-4">
            <div className="flex justify-between">
                <div className="flex gap-2 items-end">
                    <h2 className="text-xl font-bold underline">Case Selection</h2>
                    <button className="btn btn-success" onClick={() => toggleAllCases(true)}>All</button>
                    <button className="btn btn-danger" onClick={() => toggleAllCases(false)}>None</button>
                </div>
                <button
                    className="btn btn-primary flex items-center gap-1 text-2xl font-bold px-4 py-2"
                    onClick={() => navigate("timer")}
                >
                    Train
                    <MdArrowForward size={24} />
                </button>
            </div>
            
            
            {Object.entries(groupedCases).map(([setName, setCases]) => (
                <div key={setName}>
                    <div className="flex justify-between items-center py-4">
                        <div className="flex gap-2 items-end">
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