import { useState, useEffect, useCallback } from 'react';

import Scramble from '../Components/Scramble';
import Timer from '../Components/Timer';
import SolveInfo from '../Components/SolveInfo';
import SolvesList from '../Components/SolvesList';

import type { Case, Solve } from '../interfaces';

interface Props {
    cases: Case[];
    algset: string;
}

function TimerPage({ cases, algset }: Props) {

    const [recapQueue, setRecapQueue] = useState<Case[]>([]);
    const [recapMode, setRecapMode] = useState(false);
    const [recapIndex, setRecapIndex] = useState(0);

    const [currentCase, setCurrentCase] = useState<Case | null>(() => {
        if (recapMode && recapQueue.length > 0) {
            return recapQueue[0];
        }
        return getRandomCase(cases);
    });

    const [currentScramble, setCurrentScramble] = useState<string>("");

    const [solves, setSolves] = useState<Solve[]>(() => {
        const stored = localStorage.getItem(`${algset}_solves`);
        return stored ? JSON.parse(stored) : [];
    });

    const sortedSolves = [...solves].map((s, i) => ({ ...s, index: i + 1 }));

    const [selectedSolve, setSelectedSolve] = useState<Solve | null>(() => {
        const stored = localStorage.getItem(`${algset}_solves`);
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

    const handleCaseChange = useCallback((c: Case, s: string) => {
        setCurrentCase(c);
        setCurrentScramble(s);
    }, []);

    const deleteSolve = useCallback((solve: Solve) => {
        if (window.confirm(`Delete solve?`)) {
            setSolves(prev => {
                const updated = prev.filter(s => s.id !== solve.id);

                if (selectedSolve?.id === solve.id) {
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
            setRecapIndex(0);
        } else {
            const shuffled = [...cases]
                .sort(() => Math.random() - 0.5)
                .map(c => ({
                    ...c,
                    scrambles: [
                    c.scrambles[Math.floor(Math.random() * c.scrambles.length)]
                    ],
                }));
            setRecapQueue(shuffled);
            setRecapMode(true);
            setRecapIndex(0);
        }
    };

    useEffect(() => {
        localStorage.setItem(`${algset}_solves`, JSON.stringify(solves));
    }, [algset, solves]);

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
        <div className="px-2 py-4">
            {currentCase && 
                <Scramble 
                    currentScramble={currentScramble}
                    recapMode={recapMode}
                    recapQueue={recapQueue}
                    recapIndex={recapIndex}
                    toggleRecap={toggleRecap}
                />
            }
            <div className="grid grid-cols-3">
                <div className="col-span-1">
                    <SolvesList 
                        solves={sortedSolves}
                        setSelectedSolve={setSelectedSolve}
                        deleteSolve={deleteSolve}
                        deleteAllSolves={deleteAllSolves}
                    />
                </div>
                <div className="col-span-1">
                    <Timer 
                        cases={cases} 
                        onStop={handleOnStop}
                        getRandomCase={getRandomCase}
                        onCaseChange={handleCaseChange} 
                        recapMode={recapMode}
                        recapQueue={recapQueue}
                        setRecapMode={setRecapMode}
                        recapIndex={recapIndex}
                        onRecapIndexChange={setRecapIndex}
                    />
                </div>
                <div className="col-span-1">
                    <SolveInfo 
                        solves={sortedSolves}
                        selectedSolve={selectedSolve} 
                        deleteSolve={deleteSolve} 
                    />
                </div>
            </div>
        </div>
    )
}

export default TimerPage
