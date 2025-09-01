import SolveItem from './SolveItem';

import type { Solve } from '../interfaces';

interface Props {
    solves: Solve[];
    setSelectedSolve: (solve: Solve | null) => void;
    deleteSolve: (solve: Solve) => void;
    deleteAllSolves: () => void;
}

function SolvesList({ solves, setSelectedSolve, deleteSolve, deleteAllSolves }: Props) {

    const mean: string = 
        solves.length > 0
        ? (solves.reduce((sum, t) => sum + t.time, 0) / solves.length / 1000).toFixed(2)
        : '0.00';

    const deleteHidden = solves.length === 0 ? 'invisible' : '';

    return (
        <div className="flex flex-col sm:px-4 pr-1">
            <div className="sm:text-xl">
                <h3>Solves: {solves.length}</h3>
                <h3>Mean: {mean}</h3>
            </div>
            <ul className="flex-1 overflow-y-auto max-h-50 sm:max-h-80 my-4 space-y-2 scrollbar-hide">
                {[...solves].reverse().map((solve, index) => (
                    <SolveItem
                        key={index}
                        index={solves.length - index}
                        solve={solve}
                        onSelect={(s) => setSelectedSolve(s)}
                        deleteSolve={deleteSolve}
                    />
                ))}
            </ul>
            <button 
                className={`${deleteHidden} btn btn-danger w-full`}
                onClick={() => deleteAllSolves()} 
            >
                Delete All
            </button>
        </div>
    )
}

export default SolvesList