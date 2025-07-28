import { useState } from 'react';
import '@picocss/pico/css/pico.min.css';

import Scramble from './Components/Scramble';
import Timer from './Components/Timer';
import TimesList from './Components/TimesList';

import { formattedScrambles } from './generateCases';

function App() {

interface Case {
    id: string;
    scrambles: string;
    img: string;
    enabled: boolean;
}

const [times, setTimes] = useState<number[]>([]);
const [currentCase, setCurrentCase] = useState<Case>(() => getRandomCase(formattedScrambles));

function getRandomCase(cases: Case[]): Case {
    const randomIndex = Math.floor(Math.random() * cases.length);
    console.log(cases[randomIndex]);
    return cases[randomIndex];
}

const handleOnStop = (time: number) => {
    setTimes(prev => [...prev, time]);
    setCurrentCase(getRandomCase(formattedScrambles));
};

return (
        <>
            <Scramble currentScramble={currentCase.scrambles} />
            <Timer onStop={handleOnStop} />
            <TimesList times={times} />
        </>
    )
}

export default App
