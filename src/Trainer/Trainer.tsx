import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import CaseSelectionPage from './Pages/CaseSelectionPage';
import TimerPage from './Pages/TimerPage';

import type { Case, Preset } from './interfaces';

interface Props {
    algset: string
    data: Case[];
}

function Trainer({ algset, data }: Props) {

    const [cases, setCases] = useState<Case[]>(() => {
        const stored = localStorage.getItem(`${algset}_cases`);
        return stored ? JSON.parse(stored) : data;
    });

    const [presets, setPresets] = useState<Preset[]>(() => {
        const stored = localStorage.getItem(`${algset}_presets`);
        return stored ? JSON.parse(stored) : [];
    });

    const enabledCases = cases.filter(c => c.enabled);

    const toggleCase = (id: string) => {
        setCases(prev => 
            prev.map(c => 
                c.id === id ? { ...c, enabled: !c.enabled } : c
            )
        );
    }

    const toggleAllCases = (enabled: boolean) => {
        setCases(prev => prev.map(c => ({ ...c, enabled })));
    };

    const toggleCasesInSet = (setName: string, enabled: boolean) => {
        setCases(prev =>
            prev.map(c => c.set === setName ? { ...c, enabled } : c)
        );
    };

    const savePreset = (name: string) => {
        if (!name.trim()) return;

        const newPreset: Preset = { name, cases: enabledCases };

        setPresets(prev => {
            const index = prev.findIndex(p => p.name === name);
            if (index !== -1) {
                const updated = [...prev];
                updated[index] = newPreset;
                return updated;
            } else {
                return [...prev, newPreset];
            }
        });
    }

    const loadPreset = (preset: Preset) => {
        setCases(prev =>
            prev.map(c => ({
                ...c,
                enabled: preset.cases.some(p => p.id === c.id)
            }))
        );
    };

    const deletePreset = (name: string) => {
        if (window.confirm(`Delete preset ${name}?`)) {
            setPresets(prev => prev.filter(p => p.name !== name));
        }
    }

    useEffect(() => {
        localStorage.setItem(`${algset}_cases`, JSON.stringify(cases));
    }, [algset, cases]);

    useEffect(() => {
        localStorage.setItem(`${algset}_presets`, JSON.stringify(presets));
    }, [algset, presets]);

    return (
        <div className="bg-app-body-dark text-app-text-dark">
            <Routes>
                <Route 
                    path="timer" 
                    element={
                        <TimerPage 
                            cases={enabledCases}
                            algset={algset}
                        />
                    } 
                />
                <Route 
                    index
                    element={
                        <CaseSelectionPage 
                            cases={cases} 
                            toggleCase={toggleCase}
                            toggleAllCases={toggleAllCases}
                            toggleCasesInSet={toggleCasesInSet}
                            presets={presets}
                            savePreset={savePreset}
                            loadPreset={loadPreset}
                            deletePreset={deletePreset}
                        /> 
                    }
                />
                <Route path="*" element={"Page Not Found"} />
            </Routes>
        </div>
    )
}

export default Trainer
