import { useState, useEffect, useRef } from 'react'

interface Props {
    onStop: (time: number) => void;
}

function Timer({ onStop }: Props) {

    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const intervalIdRef = useRef<number | undefined>(undefined);
    const startTimeRef = useRef<number>(0);
    const isRunningRef = useRef<boolean>(isRunning);
    const hasStoppedRef = useRef<boolean>(false);
    
    function start() {
        setIsRunning(true);
        startTimeRef.current = Date.now() - time;
    }

    function stop() {
        setIsRunning(false);
        hasStoppedRef.current = true;

        const finalTime = Date.now() - startTimeRef.current;
        setTime(finalTime);
        onStop(finalTime);
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
        const handleKeyDown = () => {
            if (isRunningRef.current) {
                stop();
            }
        }

        const handleKeyUp = (event: KeyboardEvent) => {
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
            <h1>Time: {(time / 1000).toFixed(2)}</h1>
        </>
    );
}

export default Timer