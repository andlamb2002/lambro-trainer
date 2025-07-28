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

interface Solve {
    id: string;
    scramble: string;
    img: string;
    time: number;
}

// const [times, setTimes] = useState<number[]>([]);
const [currentCase, setCurrentCase] = useState<Case>(() => getRandomCase(formattedScrambles));
const [solves, setSolves] = useState<Solve[]>([]);

function getRandomCase(cases: Case[]): Case {
    const randomIndex = Math.floor(Math.random() * cases.length);
    // console.log(cases[randomIndex]);
    return cases[randomIndex];
}

const handleOnStop = (time: number) => {
    const newSolve: Solve = {
        id: currentCase.id,
        scramble: currentCase.scrambles,
        img: currentCase.img,
        time: time
    }
    console.log(newSolve);
    setSolves(prev => [...prev, newSolve]);
    setCurrentCase(getRandomCase(formattedScrambles));
};

return (
        <>
            <Scramble currentScramble={currentCase.scrambles} />
            <Timer onStop={handleOnStop} />
            <TimesList solves={solves} />
        </>
    )
}

export default App
