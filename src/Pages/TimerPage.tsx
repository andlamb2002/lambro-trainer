import { useState, useEffect } from 'react';

import Scramble from '../Components/Scramble';
import Timer from '../Components/Timer';
import SolvesList from '../Components/SolvesList';

import type { Case, Solve } from '../interfaces';

interface Props {
    cases: Case[];
}

function TimerPage({ cases }: Props) {

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
    if (window.confirm(`Delete solve ${solve.id}?`)) {
        setSolves(prev => prev.filter(s => s !== solve));

        if (selectedSolve === solve) {
            setSelectedSolve(null);
        }
    }
}

const deleteAllSolves = () => {
    if (window.confirm('Delete all solves?')) {
        setSolves([]);
        setSelectedSolve(null);
    }
}

useEffect(() => {
    localStorage.setItem('solves', JSON.stringify(solves));
}, [solves]);

return (
        <>
            {currentCase && <Scramble currentScramble={currentCase.scrambles} />}
            <Timer cases={cases} onStop={handleOnStop} onCaseChange={setCurrentCase} />
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
