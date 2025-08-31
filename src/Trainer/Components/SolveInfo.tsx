import type { Solve } from '../interfaces';

import { MdDelete } from 'react-icons/md';

interface Props {
    selectedSolve: Solve | null;
    deleteSolve: (solve: Solve) => void;
}

function SolveInfo({ selectedSolve, deleteSolve }: Props) {
    if (!selectedSolve) return null;

    return (
        <div className="bg-secondary rounded shadow-md p-4 mx-4">
            <div className="flex justify-between items-center">
                <div className="text-xl font-bold">
                    {(selectedSolve.time / 1000).toFixed(2)}
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
                    className="w-36 h-36 object-contain"
                />
            </div>
            <div>
                {selectedSolve.scramble}
            </div>
            <div>
                Solution: {selectedSolve.originalAlg}
            </div>
        </div>
    )
}

export default SolveInfo