import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import Scramble from '../Components/Scramble';
import SolveInfo from '../Components/SolveInfo';
import SolvesList from '../Components/SolvesList';

import type { Case, Solve } from '../interfaces';
import { addRandomAUF } from '../../scrambleUtils';

interface Props {
    cases: Case[];
    algset: string;
}

function TimerPage({ cases, algset }: Props) {
    const [recapQueue, setRecapQueue] = useState<Case[]>([]);
    const [recapMode, setRecapMode] = useState(false);
    const [recapIndex, setRecapIndex] = useState(0);

    const [currentCase, setCurrentCase] = useState<Case | null>(null);
    const [currentScramble, setCurrentScramble] = useState<string>('');

    const initial = useMemo(() => {
        const raw = localStorage.getItem(`${algset}_solves`);
        const solves = raw ? (JSON.parse(raw) as Solve[]) : [];
        return { solves, selected: solves.at(-1) ?? null };
    }, [algset]);

    const [solves, setSolves] = useState<Solve[]>(initial.solves);
    const [selectedSolve, setSelectedSolve] = useState<Solve | null>(initial.selected);

    const sortedSolves = useMemo(
        () => solves.map((s, i) => ({ ...s, index: i + 1 })),
        [solves]
    );

    useEffect(() => {
        localStorage.setItem(`${algset}_solves`, JSON.stringify(solves));
    }, [algset, solves]);

    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);

    const intervalIdRef = useRef<number | undefined>(undefined);
    const startTimeRef = useRef<number>(0);
    const isRunningRef = useRef<boolean>(false);
    const hasStoppedRef = useRef<boolean>(false);

    const currentCaseRef = useRef<Case | null>(null);
    const currentScrambleRef = useRef<string>('');

    const recapModeRef = useRef<boolean>(false);
    const recapQueueRef = useRef<Case[]>([]);
    const recapIndexRef = useRef<number>(0);

    const getRandomCase = useCallback((src: Case[]): Case => {
        const i = Math.floor(Math.random() * src.length);
        return src[i];
    }, []);

    const handleCaseChange = useCallback((c: Case, s: string) => {
        setCurrentCase(c);
        setCurrentScramble(s);
    }, []);

    function getRandomScrambleFromCase(c: Case): string {
        if (!c.scrambles || c.scrambles.length === 0) return '';

        const randomIndex = Math.floor(Math.random() * c.scrambles.length);
        return c.scrambles[randomIndex];
    }

    const setCaseAndScramble = useCallback((c: Case) => {
        const chosen = getRandomScrambleFromCase(c);
        const withAUF = addRandomAUF(chosen);

        currentCaseRef.current = c;
        currentScrambleRef.current = withAUF;

        handleCaseChange(c, withAUF);
        return withAUF;
    }, [handleCaseChange]);

    const updateCurrentCase = useCallback((c: Case) => {
        setCaseAndScramble(c);
    }, [setCaseAndScramble]);

    function start() {
        if (cases.length === 0) return;

        setTime(0);
        setIsRunning(true);
        startTimeRef.current = Date.now();
    }

    function nextCaseAfterSolve(): Case {
        if (recapModeRef.current) {
            const next = recapIndexRef.current + 1;

            if (next < recapQueueRef.current.length) {
                recapIndexRef.current = next;
                setRecapIndex(next);
                return recapQueueRef.current[next];
            }

            setRecapMode(false);
            recapIndexRef.current = 0;
            setRecapIndex(0);
        }
        return getRandomCase(cases);
    }

    function stop() {
        setIsRunning(false);
        hasStoppedRef.current = true;

        const finalTime = Date.now() - startTimeRef.current;
        setTime(finalTime);

        const caseUsed = currentCaseRef.current!;
        const scrambleUsed = currentScrambleRef.current;

        const solve: Solve = {
            id: `${caseUsed.id}-${Date.now()}`,
            label: caseUsed.label,
            originalAlg: caseUsed.originalAlg,
            scramble: scrambleUsed,
            img: caseUsed.img,
            time: finalTime,
        };

        setSolves(prev => [...prev, solve]);
        setSelectedSolve(solve);

        const next = nextCaseAfterSolve();
        updateCurrentCase(next);
    }

    useEffect(() => {
        if (isRunning) {
            intervalIdRef.current = window.setInterval(() => {
                setTime(Date.now() - startTimeRef.current);
            }, 10);
        }
        return () => {
            if (intervalIdRef.current !== undefined) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = undefined;
            }
        };
    }, [isRunning]);

    useEffect(() => {
        isRunningRef.current = isRunning;
    }, [isRunning]);

    useEffect(() => {
        if (cases.length > 0) {
            updateCurrentCase(getRandomCase(cases));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    useEffect(() => {
        if (recapMode && recapQueue.length > 0 && recapIndex === 0) {
            const first = recapQueue[0];
            setCaseAndScramble(first);
        }

        recapModeRef.current = recapMode;
        recapQueueRef.current = recapQueue;
        recapIndexRef.current = recapIndex;
    }, [recapMode, recapQueue, recapIndex, setCaseAndScramble]);

    const deleteSolve = useCallback((solve: Solve) => {
        if (window.confirm('Delete solve?')) {
            setSolves(prev => {
                const updated = prev.filter(s => s.id !== solve.id);
                if (selectedSolve?.id === solve.id) {
                    setSelectedSolve(updated.at(-1) ?? null);
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

    useEffect(() => {
        const handleHotkeys = (e: KeyboardEvent) => {
            if (e.altKey && e.key.toLowerCase() === 'z') {
                if (selectedSolve) {
                    e.preventDefault();
                    deleteSolve(selectedSolve);
                }
            }
            if (e.altKey && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                deleteAllSolves();
            }
        };

        window.addEventListener('keydown', handleHotkeys);
        return () => window.removeEventListener('keydown', handleHotkeys);
    }, [selectedSolve, deleteSolve, deleteAllSolves]);

    function isButtonOrLink(el: Element | null) {
        if (!(el instanceof HTMLElement)) return false;

        const tag = el.tagName;
        return tag === 'BUTTON' || tag === 'A';
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                document.activeElement instanceof HTMLElement &&
                isButtonOrLink(document.activeElement)
            ) {
                event.preventDefault();
            }
            if (isRunningRef.current) {
                stop();
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (
                document.activeElement instanceof HTMLElement &&
                isButtonOrLink(document.activeElement)
            ) {
                event.preventDefault();
            }
            if (event.code === 'Space' && !isRunningRef.current && !hasStoppedRef.current) {
                start();
            }
            if (hasStoppedRef.current) {
                hasStoppedRef.current = false;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTouchStart = () => {
        if (isRunningRef.current) stop();
    };

    const handleTouchEnd = () => {
        if (!isRunningRef.current && !hasStoppedRef.current) {
            start();
        }
        if (hasStoppedRef.current) {
            hasStoppedRef.current = false;
        }
    };

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
                    scrambles: [c.scrambles[Math.floor(Math.random() * c.scrambles.length)]],
                }));
                
            setRecapQueue(shuffled);
            setRecapMode(true);
            setRecapIndex(0);
        }
    };

    return (
        <div className="px-2 py-2 sm:py-4">
            {currentCase && (
                <Scramble
                currentScramble={currentScramble}
                recapMode={recapMode}
                recapQueue={recapQueue}
                recapIndex={recapIndex}
                toggleRecap={toggleRecap}
                />
            )}

            <div className="grid grid-cols-3">
                <div className="order-2 sm:order-1 col-span-1">
                    <SolvesList
                        solves={sortedSolves}
                        setSelectedSolve={setSelectedSolve}
                        deleteSolve={deleteSolve}
                        deleteAllSolves={deleteAllSolves}
                    />
                </div>

                <div className="order-1 sm:order-2 col-span-3 sm:col-span-1">
                    <h1
                        className="bg-secondary sm:bg-primary text-6xl text-center rounded-xl shadow-lg sm:shadow-none m-2 py-8 select-none"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        style={{ touchAction: 'manipulation' }}
                    >
                        {(time / 1000).toFixed(2)}
                    </h1>
                </div>

                <div className="order-3 col-span-2 sm:col-span-1">
                    <SolveInfo
                        solves={sortedSolves}
                        selectedSolve={selectedSolve}
                        deleteSolve={deleteSolve}
                    />
                </div>
            </div>
        </div>
    );
    }

    export default TimerPage;
