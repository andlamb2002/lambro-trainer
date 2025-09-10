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

    // const groupedCases = cases.reduce<Record<string, Case[]>>((acc, c) => {
    //     if (!acc[c.set]) {
    //         acc[c.set] = [];
    //     }
    //     acc[c.set].push(c);
    //     return acc;
    // }, {});

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

    // const selectedCount = useMemo(() => cases.filter(c => c.enabled).length, [cases]);
    // const totalCount = cases.length;

    const [active, setActive] = useState<{ setName: string; group: SubsetGroup } | null>(null);
    const openModal = (setName: string, group: SubsetGroup) => setActive({ setName, group });
    const closeModal = () => setActive(null);

    return (
        <div className="sm:px-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0">
                <button
                    className="order-1 sm:order-2 btn btn-primary flex items-center gap-1 text-2xl font-bold w-auto self-start sm:self-auto px-2 py-1 sm:px-4 sm:py-2"
                    onClick={() => navigate("timer")}
                >
                    Train
                    <MdArrowForward size={24} />
                </button>
                <div className="order-2 sm:order-1 flex gap-2 items-end">
                    <h2 className="text-xl font-bold underline">Case Selection</h2>
                    <button className="btn btn-success" onClick={() => toggleAllCases(true)}>All</button>
                    <button className="btn btn-danger" onClick={() => toggleAllCases(false)}>None</button>
                </div>
            </div>
            
            {/* {Object.entries(groupedCases).map(([setName, setCases]) => (
                <div key={setName}>
                    <div className="flex justify-between items-center py-4">
                        <div className="flex gap-2 items-end">
                            <h3 className="text-lg">{formatSetName(setName)}</h3>
                            <button className="btn btn-success" onClick={() => toggleCasesInSet(setName, true)}>All</button>
                            <button className="btn btn-danger" onClick={() => toggleCasesInSet(setName, false)}>None</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-10 gap-1 justify-start" >
                        {setCases.map((c) => (
                            <CaseItem key={c.id} c={c} toggleCase={toggleCase} />
                        ))}
                    </div>
                </div>
            ))} */}
            {Object.keys(groupedBySet).map((setName) => (
                <div key={setName}>
                <div className="flex justify-between items-center py-4">
                    <div className="flex gap-2 items-end">
                    <h3 className="text-lg">{formatSetName(setName)}</h3>
                    <button className="btn btn-success" onClick={() => toggleCasesInSet(setName, true)}>All</button>
                    <button className="btn btn-danger" onClick={() => toggleCasesInSet(setName, false)}>None</button>
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

            {/* OLLCP subsets modal */}
            <SubsetModal
                open={!!active}
                onClose={closeModal}
                title={active ? `${active.group.baseId} – Subsets` : ""}
                wide
            >
                {active && (
                <>
                    <div className="flex justify-end gap-2 mb-2">
                    <button
                        className="btn btn-success"
                        onClick={() => active.group.children.forEach(c => !c.enabled && toggleCase(c.id))}
                    >
                        All
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => active.group.children.forEach(c => c.enabled && toggleCase(c.id))}
                    >
                        None
                    </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {active.group.children.map((c) => (
                        <CaseItem key={c.id} c={c} toggleCase={toggleCase} />
                    ))}
                    </div>
                </>
                )}
            </SubsetModal>
        </div>
    )
}

export default CasesSection