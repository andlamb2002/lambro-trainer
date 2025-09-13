import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import CaseItem from "./CaseItem";
import ParentCaseItem from "./ParentCaseItem";
import SubsetModal from "./SubsetModal";

import type { Case, SubsetGroup } from "../interfaces";
import { hasSubsets, groupSubsetsByBase } from "../../subsetUtils";

import { MdArrowForward } from "react-icons/md";

interface Props {
    cases: Case[];
    toggleCase: (id: string) => void;
    toggleAllCases: (enabled: boolean) => void;
    toggleCasesInSet: (setName: string, enabled: boolean) => void;    
}

function CasesSection({ cases, toggleCase, toggleAllCases, toggleCasesInSet }: Props) {

    const navigate = useNavigate();

    const subsetMode = useMemo(() => hasSubsets(cases), [cases]);

    const groupedBySet = useMemo(() => {
        return cases.reduce<Record<string, Case[]>>((acc, c) => {
            (acc[c.set] ||= []).push(c);
            return acc;
        }, {});
    }, [cases]);

    const groupsBySet = useMemo(() => {
        if (!subsetMode) return {};
        return groupSubsetsByBase(cases, {
            getBaseId: (c) => c.id.split("_")[0],
        });
    }, [cases, subsetMode]);

    function formatSetName(name: string): string {
        return name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    }

    const [active, setActive] = useState<{ setName: string; baseId: string } | null>(null);

    const openModal = (setName: string, group: SubsetGroup) =>
        setActive({ setName, baseId: group.baseId });
    const closeModal = () => setActive(null);

    const activeGroup = useMemo<SubsetGroup | undefined>(() => {
        if (!active) return undefined;
        return groupsBySet[active.setName]?.find(g => g.baseId === active.baseId);
    }, [active, groupsBySet]);

    return (
        <div className="sm:px-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0">
                <button
                    className="order-1 sm:order-2 btn btn-primary flex items-center gap-1 text-2xl font-bold w-auto self-start sm:self-auto px-2 py-1 sm:px-4 sm:py-2"
                    onClick={() => navigate("timer")}
                    title="Start Training"
                    aria-label="Start Training"
                >
                    Train
                    <MdArrowForward size={24} />
                </button>
                <div className="order-2 sm:order-1 flex gap-2 items-end">
                    <h2 className="text-xl font-bold underline">Case Selection</h2>
                    <button 
                        className="btn btn-success" 
                        onClick={() => toggleAllCases(true)} 
                        title="Toggle All" 
                        aria-label="Toggle All"
                    >
                        All
                    </button>
                    <button 
                        className="btn btn-danger" 
                        onClick={() => toggleAllCases(false)} 
                        title="Toggle None" 
                        aria-label="Toggle None"
                    >
                        None
                    </button>
                </div>
            </div>
            
            {Object.keys(groupedBySet).map((setName) => (
                <div key={setName}>
                <div className="flex justify-between items-center py-4">
                    <div className="flex gap-2 items-end">
                    <h3 className="text-lg">{formatSetName(setName)}</h3>
                    <button 
                        className="btn btn-success" 
                        onClick={() => toggleCasesInSet(setName, true)} 
                        title={`Toggle All - ${formatSetName(setName)}`} 
                        aria-label={`Toggle All - ${formatSetName(setName)}`}
                    >
                        All
                    </button>
                    <button 
                        className="btn btn-danger" 
                        onClick={() => toggleCasesInSet(setName, false)} 
                        title={`Toggle None - ${formatSetName(setName)}`} 
                        aria-label={`Toggle None - ${formatSetName(setName)}`}
                    >
                        None
                    </button>
                    </div>
                </div>

                {!subsetMode && (
                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-10 gap-1 justify-start">
                    {groupedBySet[setName].map((c) => (
                        <CaseItem key={c.id} c={c} toggleCase={toggleCase} />
                    ))}
                    </div>
                )}

                {subsetMode && (
                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-10 gap-1 justify-start">
                    {groupsBySet[setName].map((group) => {
                        const enableAll = () => group.children.forEach(ch => !ch.enabled && toggleCase(ch.id));
                        const disableAll = () => group.children.forEach(ch => ch.enabled && toggleCase(ch.id));
                        return (
                        <ParentCaseItem
                            key={group.baseId}
                            group={group}
                            onOpen={() => openModal(setName, group)}
                            onAll={enableAll}
                            onNone={disableAll}
                        />
                        );
                    })}
                    </div>
                )}
                </div>
            ))}

            {activeGroup && (
                <SubsetModal
                    open
                    onClose={closeModal}
                    baseId={activeGroup.baseId}
                    onAll={() => activeGroup.children.forEach(c => !c.enabled && toggleCase(c.id))}   // NEW
                    onNone={() => activeGroup.children.forEach(c => c.enabled && toggleCase(c.id))}   // NEW
                >
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {activeGroup.children.map((c) => (
                        <CaseItem key={c.id} c={c} toggleCase={toggleCase} />
                    ))}
                    </div>
                </SubsetModal>
            )}
        </div>
    )
}

export default CasesSection