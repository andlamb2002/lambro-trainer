import type { Solve } from '../interfaces';

interface Props {
    selectedSolve: Solve | null;
    deleteSolve: (solve: Solve) => void;
}

function SolveInfo({ selectedSolve, deleteSolve }: Props) {
    if (!selectedSolve) return null;

    return (
        <div>
            <p>Case {selectedSolve.label}: {(selectedSolve.time / 1000).toFixed(2)}</p>
            <p>
                <img
                    src={selectedSolve.img}
                    alt={`Case ${selectedSolve.id}`}
                    style={{ width: '80px' }}
                />
            </p>
            <p>{selectedSolve.scramble}</p>
            <p>{selectedSolve.originalAlg}</p>
            <button className="btn btn-danger" onClick={() => deleteSolve(selectedSolve)}>
                Delete Solve
            </button>
        </div>
    )
}

export default SolveInfo