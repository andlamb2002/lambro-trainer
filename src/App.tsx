import { useState } from 'react';
import '@picocss/pico/css/pico.min.css';

import Scramble from './Components/Scramble';
import Timer from './Components/Timer';
import TimesList from './Components/TimesList';

function App() {

const scrambles = [
    'R2 U2 R U2 R2 U2 R2 U2 R U2 R2',
    'R U\' R U R U R U\' R\' U\' R2',
    'R2\' U R U R\' U\' R\' U\' R\' U R\'',
    'R\' U\' R2 U R U R\' U\' R U R U\' R U\' R\'',
]

const [times, setTimes] = useState<number[]>([]);
const [currentScramble, setCurrentScramble] = useState<string>(() => getRandomScramble(scrambles));

function getRandomScramble(scrambles: string[]): string {
    const randomIndex = Math.floor(Math.random() * scrambles.length);
    return scrambles[randomIndex];
}

const handleOnStop = (time: number) => {
    setTimes(prev => [...prev, time]);
    setCurrentScramble(getRandomScramble(scrambles));
};

return (
        <>
            <Scramble currentScramble={currentScramble} />
            <Timer onStop={handleOnStop} />
            <TimesList times={times} />
        </>
    )
}

export default App
