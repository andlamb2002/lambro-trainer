import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '@picocss/pico/css/pico.min.css';

import CaseSelectionPage from './Pages/CaseSelectionPage';
import TimerPage from './Pages/TimerPage';

import { formattedCases } from './generateCases';

interface Case {
    id: string;
    scrambles: string;
    img: string;
    enabled: boolean;
}

function App() {

const [cases, setCases] = useState<Case[]>(() => {
    const stored = localStorage.getItem('cases');
    return stored ? JSON.parse(stored) : formattedCases;
});

const toggleCase = (id: string) => {
    setCases(prev => 
        prev.map(c => 
            c.id === id ? { ...c, enabled: !c.enabled } : c
        )
    );
}

const enabledCases = cases.filter(c => c.enabled);

useEffect(() => {
    localStorage.setItem('cases', JSON.stringify(cases));
}, [cases]);

return (
        <>
            <Link to="/">Case Selection</Link> | <Link to="/timer">Timer</Link>
            <Routes>
                <Route 
                    path="/timer" 
                    element={<TimerPage cases={enabledCases}/>} 
                />
                <Route 
                    path="/" 
                    element={<CaseSelectionPage cases={cases} toggleCase={toggleCase}/>} 
                />
                <Route path="*" element={"Page Not Found"} />
            </Routes>
        </>
    )
}

export default App
