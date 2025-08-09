import { useState, useEffect, useCallback } from 'react';

import Scramble from '../Components/Scramble';
import Timer from '../Components/Timer';
import SolvesList from '../Components/SolvesList';

import type { Case, Solve } from '../interfaces';

interface Props {
    cases: Case[];
}

function TimerPage({ cases }: Props) {

    const [recapQueue, setRecapQueue] = useState<Case[]>([]);
    const [recapMode, setRecapMode] = useState(false);
    const [recapIndex, setRecapIndex] = useState(0);

    const [currentCase, setCurrentCase] = useState<Case | null>(() => {
        if (recapMode && recapQueue.length > 0) {
            return recapQueue[0];
        }
        return getRandomCase(cases);
    });

    const [solves, setSolves] = useState<Solve[]>(() => {
        const stored = localStorage.getItem('solves');
        return stored ? JSON.parse(stored) : [];
    });

    const [selectedSolve, setSelectedSolve] = useState<Solve | null>(() => {
        const stored = localStorage.getItem('solves');
        const parsed = stored ? JSON.parse(stored) : [];
        return parsed.length > 0 ? parsed[parsed.length - 1] : null;
    });

    const handleOnStop = (solve: Solve) => {
        setSolves(prev => [...prev, solve]);
        setSelectedSolve(solve);
    }

    function getRandomCase(cases: Case[]): Case {
        const randomIndex = Math.floor(Math.random() * cases.length);
        return cases[randomIndex];
    }

      function getRandomScrambleFromCase(c: Case): string {
        if (!c.scrambles || c.scrambles.length === 0) return '';
        const randomIndex = Math.floor(Math.random() * c.scrambles.length);
        return c.scrambles[randomIndex];
    }

    const deleteSolve = useCallback((solve: Solve) => {
        if (window.confirm(`Delete solve?`)) {
            setSolves(prev => {
                const updated = prev.filter(s => s !== solve);

                if (selectedSolve === solve) {
                    setSelectedSolve(updated.length > 0 ? updated[updated.length - 1] : null);
                }

                return updated;
            });
        }
    }, [selectedSolve]);

    const deleteAllSolves = useCallback(() => {
        if (window.confirm('Delete all solves?')) {
            setSolves([]);
            setSelectedSolve(null);
        }
    }, []);

    const toggleRecap = () => {
        if (recapMode) {
            setRecapMode(false);
            setRecapQueue([]);
        } else {
            const shuffled = [...cases].sort(() => Math.random() - 0.5);
            setRecapQueue(shuffled);
            console.log('Recap queue:', shuffled.map(c => c.id));
            setRecapMode(true);
        }
    };

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
            {currentCase && 
                <Scramble 
                    currentScramble={getRandomScrambleFromCase(currentCase)}
                    recapMode={recapMode}
                    recapQueue={recapQueue}
                    recapIndex={recapIndex}
                    toggleRecap={toggleRecap}
                />
            }
            <Timer 
                cases={cases} 
                onStop={handleOnStop}
                getRandomCase={getRandomCase}
                onCaseChange={setCurrentCase} 
                recapMode={recapMode}
                recapQueue={recapQueue}
                setRecapMode={setRecapMode}
                onRecapIndexChange={setRecapIndex}
            />
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
