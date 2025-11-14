import { useState } from 'react';

import SolveItem from './SolveItem';
import StatsModal from './StatsModal';

import type { Solve } from '../interfaces';

import { MdBarChart } from 'react-icons/md';

interface Props {
    solves: Solve[];
    setSelectedSolve: (solve: Solve | null) => void;
    deleteSolve: (solve: Solve) => void;
    deleteAllSolves: () => void;
    isCooldown: boolean;
}

function SolvesList({ solves, setSelectedSolve, deleteSolve, deleteAllSolves, isCooldown }: Props) {
    const [statsOpen, setStatsOpen] = useState(false);

    const mean: string = 
        solves.length > 0
        ? (solves.reduce((sum, t) => sum + t.time, 0) / solves.length / 1000).toFixed(2)
        : '0.00';

    const deleteHidden = solves.length === 0 ? 'invisible' : '';

    return (
        <div className="flex flex-col sm:pl-4 pt-2 pr-1 sm:pr-0">
            <div className="flex items-start justify-between">
                <div className="sm:text-xl">
                    <h3>Solves: {solves.length}</h3>
                    <h3>Mean: {mean}</h3>
                </div>
                <button
                    className="btn btn-primary p-1 sm:p-2"
                    onClick={() => setStatsOpen(true)}
                    title="Open Statistics"
                    aria-label="Open Statistics"
                    disabled={isCooldown} 
                    >
                    <MdBarChart size={24} />
                </button>
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
                title="Delete All Solves"
                aria-label="Delete All Solves"
            >
                Delete All
            </button>
            <StatsModal
                open={statsOpen}
                onClose={() => setStatsOpen(false)}
                solves={solves}
            />
        </div>
    )
}

export default SolvesList