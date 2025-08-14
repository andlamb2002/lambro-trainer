import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import '@picocss/pico/css/pico.min.css';

import Header from './Components/Header';
import CaseSelectionPage from './Pages/CaseSelectionPage';
import TimerPage from './Pages/TimerPage';

import generatedCases from './data/pllCases.json';

import type { Case, Preset } from './interfaces';

function App() {

const [cases, setCases] = useState<Case[]>(() => {
    const stored = localStorage.getItem('cases');
    return stored ? JSON.parse(stored) : generatedCases;
});

const enabledCases = cases.filter(c => c.enabled);

const [presets, setPresets] = useState<Preset[]>(() => {
    const stored = localStorage.getItem('presets');
    return stored ? JSON.parse(stored) : [];
});

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
    localStorage.setItem('cases', JSON.stringify(cases));
}, [cases]);

useEffect(() => {
    localStorage.setItem('presets', JSON.stringify(presets));
}, [presets]);

return (
        <>
            <Header />
            <Routes>
                <Route 
                    path="/timer" 
                    element={
                        <TimerPage 
                            cases={enabledCases}
                        />
                    } 
                />
                <Route 
                    path="/" 
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

export default App
