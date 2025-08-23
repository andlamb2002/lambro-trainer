import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import '@picocss/pico/css/pico.min.css';

import Header from './Components/Header';
import CaseSelectionPage from './Pages/CaseSelectionPage';
import TimerPage from './Pages/TimerPage';

import type { Case, Preset } from './interfaces';

interface Props {
    algset: string
    data: Case[];
}

function Trainer({ algset, data }: Props) {

    const [cases, setCases] = useState<Case[]>(data);
    const [presets, setPresets] = useState<Preset[]>([]);

    const enabledCases = cases.filter(c => c.enabled);

    const toggleCase = (id: string) => {
        setCases(prev => 
            prev.map(c => 
                c.id === id ? { ...c, enabled: !c.enabled } : c
            )
        );
    }

    const savePreset = (name: string) => {
        if (!name.trim()) return;

        const newPreset: Preset = { name, cases };

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
        setCases(preset.cases);
    }

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

    useEffect(() => {
        const storedCases = localStorage.getItem(`${algset}_cases`);
        setCases(storedCases ? JSON.parse(storedCases) : data);

        const storedPresets = localStorage.getItem(`${algset}_presets`);
        setPresets(storedPresets ? JSON.parse(storedPresets) : []);
    }, [algset, data]);

    return (
        <>
            <Header />
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
                            presets={presets}
                            savePreset={savePreset}
                            loadPreset={loadPreset}
                            deletePreset={deletePreset}
                        /> 
                    }
                />
                <Route path="*" element={"Page Not Found"} />
            </Routes>
        </>
    )
}

export default Trainer
