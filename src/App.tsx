// import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import '@picocss/pico/css/pico.min.css';

import CaseSelectionPage from './Pages/CaseSelectionPage';
import TimerPage from './Pages/TimerPage';

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

// const [currentCase, setCurrentCase] = useState<Case | null>(null);

// const [solves, setSolves] = useState<Solve[]>(() => {
//     const stored = localStorage.getItem('solves');
//     return stored ? JSON.parse(stored) : [];
// });

// const [selectedSolve, setSelectedSolve] = useState<Solve | null>(null);

// const handleOnStop = (solve: Solve) => {
//     setSolves(prev => [...prev, solve]);
//     setSelectedSolve(solve);
// }

// const deleteSolve = (solve: Solve) => {
//     setSolves(prev => prev.filter(s => s !== solve));

//     if (selectedSolve === solve) {
//         setSelectedSolve(null);
//     }
// }

// const deleteAllSolves = () => {
//     setSolves([]);
//     setSelectedSolve(null);
// }

// useEffect(() => {
//     localStorage.setItem('solves', JSON.stringify(solves));
// }, [solves]);

return (
        <>
            <Link to="/">Case Selection</Link> | <Link to="/timer">Timer</Link>
            <Routes>
                <Route path="/timer" element={<TimerPage />} />
                <Route path="/" element={<CaseSelectionPage />} />
                <Route path="*" element={"Page Not Found"} />
            </Routes>
        </>
    )
}

export default App
