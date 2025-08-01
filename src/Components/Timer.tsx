import { useState, useEffect, useRef } from 'react'

import type { Case, Solve } from '../interfaces';

interface Props {
    cases: Case[];
    onStop: (solve: Solve) => void;
    onCaseChange: (currentCase: Case) => void;
}

function Timer({ cases, onStop, onCaseChange }: Props) {

    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const [currentCase, setCurrentCase] = useState<Case>(() => getRandomCase(cases));

    const intervalIdRef = useRef<number | undefined>(undefined);
    const startTimeRef = useRef<number>(0);
    const isRunningRef = useRef<boolean>(isRunning);
    const hasStoppedRef = useRef<boolean>(false);
    const currentCaseRef = useRef<Case>(currentCase);
    
    function start() {
        setIsRunning(true);
        startTimeRef.current = Date.now() - time;
    }

    function stop() {
        setIsRunning(false);
        hasStoppedRef.current = true;

        const finalTime = Date.now() - startTimeRef.current;
        setTime(finalTime);

        const caseUsed = currentCaseRef.current;

        const solve: Solve = {
            id: caseUsed.id,
            scramble: caseUsed.scrambles,
            img: caseUsed.img,
            time: finalTime,
        }
    
        onStop(solve);
        const newCase: Case = getRandomCase(cases);
        setCurrentCase(newCase);
    }

    function getRandomCase(cases: Case[]): Case {
        const randomIndex = Math.floor(Math.random() * cases.length);
        return cases[randomIndex];
    }

    useEffect(() => {
        if(isRunning) {
            intervalIdRef.current = setInterval(() => {
                setTime(Date.now() - startTimeRef.current);
            }, 10)
        }

        return () => {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = undefined;
        }

    }, [isRunning]);

    useEffect (() => {
        isRunningRef.current = isRunning;
    }, [isRunning]);

    useEffect(() => {
        currentCaseRef.current = currentCase;
        onCaseChange(currentCase);
    }, [currentCase, onCaseChange]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                document.activeElement instanceof HTMLElement &&
                (document.activeElement.tagName === 'BUTTON' || document.activeElement.tagName === 'A')
            ) {
                event.preventDefault();
            }
            
            if (isRunningRef.current) {
                stop();
            }
        }

        const handleKeyUp = (event: KeyboardEvent) => {
            if (
                document.activeElement instanceof HTMLElement &&
                (document.activeElement.tagName === 'BUTTON' || document.activeElement.tagName === 'A')
            ) {
                event.preventDefault();
            }
            
            if (event.code === 'Space' && !isRunningRef.current && !hasStoppedRef.current) {
                start();
            }

            if (hasStoppedRef.current) {
                hasStoppedRef.current = false;
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <h1>{(time / 1000).toFixed(2)}</h1>
        </>
    );
}

export default Timer