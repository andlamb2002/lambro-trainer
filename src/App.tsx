import { useState } from 'react';
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

// interface Solve {
//     id: string;
//     scramble: string;
//     img: string;
//     time: number;
// }

function App() {

const [cases, setCases] = useState<Case[]>(formattedCases);

const toggleCase = (id: string) => {
    setCases(prev => 
        prev.map(c => 
            c.id === id ? { ...c, enabled: !c.enabled } : c
        )
    );
}

const enabledCases = cases.filter(c => c.enabled);

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
