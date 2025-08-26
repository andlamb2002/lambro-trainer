import SolveItem from './SolveItem';

import type { Solve } from '../interfaces';

interface Props {
    solves: Solve[];
    setSelectedSolve: (solve: Solve | null) => void;
    deleteAllSolves: () => void;
}

function SolvesList({ solves, setSelectedSolve, deleteAllSolves }: Props) {

    const mean: string = 
        solves.length > 0
        ? (solves.reduce((sum, t) => sum + t.time, 0) / solves.length / 1000).toFixed(2)
        : '0.00';

    return (
        <>
            <h3>Solves: {solves.length}</h3>
            <h3>Mean: {mean}</h3>
            {solves.map((solve, index) => (
                <SolveItem
                    key={index}
                    solve={solve}
                    isLast={index === solves.length - 1}
                    onSelect={(s) => setSelectedSolve(s)}
                />
            ))}
            <div>
                <button 
                    onClick={() => deleteAllSolves()} 
                >
                    Delete All Solves
                </button>
            </div>
        </>
    )
}

export default SolvesList