import { useState, useEffect, useRef } from 'react'

import type { Case, Solve } from '../interfaces';

interface Props {
    cases: Case[];
    onStop: (solve: Solve) => void;
    getRandomCase: (cases: Case[]) => Case;
    onCaseChange: (currentCase: Case) => void;
    recapMode: boolean;
    recapQueue: Case[];
    setRecapMode: (mode: boolean) => void;
    onRecapIndexChange: (index: number) => void;
}

function Timer({ cases, onStop, getRandomCase, onCaseChange, recapMode, recapQueue, setRecapMode, onRecapIndexChange }: Props) {

    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const [currentCase, setCurrentCase] = useState<Case>(() => getRandomCase(cases));

    const intervalIdRef = useRef<number | undefined>(undefined);
    const startTimeRef = useRef<number>(0);
    const isRunningRef = useRef<boolean>(isRunning);
    const hasStoppedRef = useRef<boolean>(false);
    const currentCaseRef = useRef<Case>(currentCase);
    const recapModeRef = useRef<boolean>(recapMode);
    const recapQueueRef = useRef<Case[]>(recapQueue);
    const recapIndexRef = useRef(0);
    
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
        };

        console.log('✅ Stopping timer');
        console.log('Final time (ms):', finalTime);
        console.log('Used case:', caseUsed);
        console.log('Recap mode?', recapModeRef.current);
        console.log('Current recapIndex:', recapIndexRef.current);
        console.log('Recap queue length:', recapQueue.length);

        onStop(solve);

        if (recapModeRef.current) {
            const nextIndex = recapIndexRef.current + 1;
            console.log('Next index:', nextIndex);

            if (nextIndex < recapQueueRef.current.length) {
                recapIndexRef.current = nextIndex;
                onRecapIndexChange(nextIndex);
                const nextCase = recapQueueRef.current[nextIndex];
                setCurrentCase(nextCase);
                currentCaseRef.current = nextCase;
            } else {
                setRecapMode(false);
                recapIndexRef.current = 0;
                onRecapIndexChange(0);
                const newCase = getRandomCase(cases);
                setCurrentCase(newCase);
                currentCaseRef.current = newCase;
            }
        } else {
            const newCase = getRandomCase(cases);
            console.log('Standard mode - new random case:', newCase);

            setCurrentCase(newCase);
            currentCaseRef.current = newCase;
        }
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
        recapModeRef.current = recapMode;
    }, [recapMode]);

    useEffect(() => {
        recapQueueRef.current = recapQueue;

        if (
            recapModeRef.current &&
            recapQueue.length > 0 &&
            recapIndexRef.current === 0
        ) {
            const firstCase = recapQueue[0];
            setCurrentCase(firstCase);
            currentCaseRef.current = firstCase;
        }
    }, [recapQueue]);

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