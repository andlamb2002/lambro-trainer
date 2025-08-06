import { useState, useEffect, useCallback } from 'react';

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

const deleteSolve = useCallback((solve: Solve) => {
    if (window.confirm(`Delete solve?`)) {
        setSolves(prev => prev.filter(s => s !== solve));

        if (selectedSolve === solve) {
            setSelectedSolve(null);
        }
    }
}, [selectedSolve]);

const deleteAllSolves = useCallback(() => {
    if (window.confirm('Delete all solves?')) {
        setSolves([]);
        setSelectedSolve(null);
    }
}, []);

useEffect(() => {
    localStorage.setItem('solves', JSON.stringify(solves));
}, [solves]);

useEffect(() => {
  const handleHotkeys = (e: KeyboardEvent) => {
    if (e.altKey && e.key.toLowerCase() === 'z') {
      if (selectedSolve) {
        deleteSolve(selectedSolve);
      }
    }

    if (e.altKey && e.key.toLowerCase() === 'd') {
      deleteAllSolves();
    }
  };

  window.addEventListener('keydown', handleHotkeys);
  return () => {
    window.removeEventListener('keydown', handleHotkeys);
  };
}, [selectedSolve, deleteSolve, deleteAllSolves]);


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
