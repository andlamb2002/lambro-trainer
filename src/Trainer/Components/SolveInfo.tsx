import type { Solve } from '../interfaces';

import { MdDelete } from 'react-icons/md';

interface Props {
    solves: Solve[];
    selectedSolve: Solve | null;
    deleteSolve: (solve: Solve) => void;
}

function SolveInfo({ solves, selectedSolve, deleteSolve }: Props) {
    if (!selectedSolve) return null;

    const index = solves.findIndex(s => s.id === selectedSolve.id) + 1;

    return (
        <div className="bg-secondary rounded shadow-md p-4 ml-1 sm:ml-0 sm:mr-4">
            <div className="flex justify-between items-center">
                <div className="text-xl font-bold">
                    {index}. {(selectedSolve.time / 1000).toFixed(2)}
                </div>
                <button
                    className="btn btn-danger p-1"
                    onClick={() => deleteSolve(selectedSolve)}
                >
                    <MdDelete size={24} />
                </button>
            </div>
            <div>
                Case: {selectedSolve.label}
            </div>
            <div>
                <img
                    src={selectedSolve.img}
                    alt={`Case ${selectedSolve.id}`}
                    className="w-24 h-24 sm:w-36 sm:h-36 object-contain"
                />
            </div>
            <div className="select-text">
                {selectedSolve.scramble}
            </div>
            <div className="select-text">
                Solution: {selectedSolve.originalAlg}
            </div>
        </div>
    )
}

export default SolveInfo