
interface Props {
    solves: Solve[];
    selectedSolve: Solve | null;
    setSelectedSolve: (solve: Solve | null) => void;
    deleteSolve: (solve: Solve) => void;
    deleteAllSolves: () => void;
}

interface Solve {
    id: string;
    scramble: string;
    img: string;
    time: number;
}

function SolvesList({ solves, selectedSolve, setSelectedSolve, deleteSolve, deleteAllSolves }: Props) {

    const mean: string = 
        solves.length > 0
        ? (solves.reduce((sum, t) => sum + t.time, 0) / solves.length / 1000).toFixed(2)
        : '0.00';

    return (
        <>
                {selectedSolve && (
                <div>
                    <p>Case {selectedSolve.id}: {(selectedSolve.time / 1000).toFixed(2)}</p>
                    <p><img src={selectedSolve.img} alt={`Case ${selectedSolve.id}`} style={{ width: '80px' }} /></p>
                    <p>{selectedSolve.scramble}</p>
                    <button 
                        onClick={() => deleteSolve(selectedSolve)} 
                    >
                        Delete Solve
                    </button>
                </div>
            )}

            <h3>Solves: {solves.length}</h3>
            <h3>Mean: {mean}</h3>
            { solves.map((solve, index) => (
                <span 
                    key={index}
                    onClick={() => setSelectedSolve(solve)}
                    style={{ cursor: 'pointer' }}
                >
                    {(solve.time / 1000).toFixed(2)}
                    {index < solves.length - 1 ? ', ' : ''}
                </span>
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