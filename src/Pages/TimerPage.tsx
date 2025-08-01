import { useState, useEffect } from 'react';

import Scramble from '../Components/Scramble';
import Timer from '../Components/Timer';
import SolvesList from '../Components/SolvesList';

import { formattedScrambles } from '../generateCases';

interface Case {
    id: string;
    scrambles: string;
    img: string;
    enabled: boolean;
}

interface Solve {
    id: string;
    scramble: string;
    img: string;
    time: number;
}

function TimerPage() {

const [currentCase, setCurrentCase] = useState<Case | null>(null);

const [solves, setSolves] = useState<Solve[]>(() => {
    const stored = localStorage.getItem('solves');
    return stored ? JSON.parse(stored) : [];
});

const [selectedSolve, setSelectedSolve] = useState<Solve | null>(null);

const handleOnStop = (solve: Solve) => {
    setSolves(prev => [...prev, solve]);
    setSelectedSolve(solve);
}

const deleteSolve = (solve: Solve) => {
    setSolves(prev => prev.filter(s => s !== solve));

    if (selectedSolve === solve) {
        setSelectedSolve(null);
    }
}

const deleteAllSolves = () => {
    setSolves([]);
    setSelectedSolve(null);
}

useEffect(() => {
    localStorage.setItem('solves', JSON.stringify(solves));
}, [solves]);

return (
        <>
            {currentCase && <Scramble currentScramble={currentCase.scrambles} />}
            <Timer cases={formattedScrambles} onStop={handleOnStop} onCaseChange={setCurrentCase} />
            <SolvesList 
                solves={solves} 
                selectedSolve={selectedSolve} 
                setSelectedSolve={setSelectedSolve} 
                deleteSolve={deleteSolve} 
                deleteAllSolves={deleteAllSolves}
            />
        </>
    )
}

export default TimerPage
