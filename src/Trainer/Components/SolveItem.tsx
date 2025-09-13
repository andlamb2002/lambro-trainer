import type { Solve } from '../interfaces';

import { MdDelete } from "react-icons/md";

interface Props {
    index: number;
    solve: Solve;
    onSelect: (solve: Solve) => void;
    deleteSolve: (solve: Solve) => void;
}

function SolveItem({ index, solve, onSelect, deleteSolve }: Props) {
    return (
        <li
            className="flex justify-between items-center bg-secondary p-2 rounded shadow-md cursor-pointer hover:bg-secondary/60"
            onClick={() => onSelect(solve)}
            title={`Select Solve ${index}`}
            role="button"
            aria-pressed="false"
        >
            <div>
                {index}. {(solve.time / 1000).toFixed(2)}
            </div>
            <button
                className="hidden sm:block btn btn-danger p-1"
                onClick={(e) => {
                    deleteSolve(solve);
                    e.stopPropagation(); 
                }}
                title={`Delete Solve ${index}`}
                aria-label={`Delete Solve ${index}`}
            >
                <MdDelete size={24} />
            </button>
        </li>
    )
}

export default SolveItem