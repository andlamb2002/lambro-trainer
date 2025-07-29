import { useState } from 'react';
import '@picocss/pico/css/pico.min.css';

import Scramble from './Components/Scramble';
import Timer from './Components/Timer';
import SolvesList from './Components/SolvesList';

import { formattedScrambles } from './generateCases';

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

function App() {

const [currentCase, setCurrentCase] = useState<Case | null>(null);
const [solves, setSolves] = useState<Solve[]>([]);

const handleOnStop = (solve: Solve) => {
    setSolves(prev => [...prev, solve]);
}

return (
        <>
            {currentCase && <Scramble currentScramble={currentCase.scrambles} />}
            <Timer cases={formattedScrambles} onStop={handleOnStop} onCaseChange={setCurrentCase} />
            <SolvesList solves={solves} />
        </>
    )
}

export default App
