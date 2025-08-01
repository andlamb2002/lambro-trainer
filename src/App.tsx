// import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '@picocss/pico/css/pico.min.css';

import CaseSelectionPage from './Pages/CaseSelectionPage';
import TimerPage from './Pages/TimerPage';

import { formattedScrambles } from './generateCases';

// interface Case {
//     id: string;
//     scrambles: string;
//     img: string;
//     enabled: boolean;
// }

// interface Solve {
//     id: string;
//     scramble: string;
//     img: string;
//     time: number;
// }

function App() {

// const [selectedSolve, setSelectedSolve] = useState<Solve | null>(null);

return (
        <>
            <Link to="/">Case Selection</Link> | <Link to="/timer">Timer</Link>
            <Routes>
                <Route path="/timer" element={<TimerPage scrambles={formattedScrambles}/>} />
                <Route path="/" element={<CaseSelectionPage />} />
                <Route path="*" element={"Page Not Found"} />
            </Routes>
        </>
    )
}

export default App
