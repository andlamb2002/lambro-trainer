
interface Props {
    solves: Solve[];
}

interface Solve {
    id: string;
    scramble: string;
    img: string;
    time: number;
}

function SolvesList({ solves }: Props) {

    const mean: string = 
        solves.length > 0
        ? (solves.reduce((sum, t) => sum + t.time, 0) / solves.length / 1000).toFixed(2)
        : '0.00';

    const latest: Solve | undefined = solves[solves.length - 1];

    return (
        <>
            <div>

                 {latest && (
                    <div>
                        <p><strong>Last Case:</strong> {latest.id}</p>
                        <p><img src={latest.img} alt={`Case ${latest.id}`} style={{ width: '80px' }} /></p>
                        <p><strong>Scramble:</strong> {latest.scramble}</p>
                        <p><strong>Time:</strong> {(latest.time / 1000).toFixed(2)}</p>
                    </div>
                )}

                <h3>Solves: {solves.length}</h3>
                <h3>Mean: {mean}</h3>
                { solves.map((solve, index) => (
                    <span key={index}>{(solve.time / 1000).toFixed(2)}{index < solves.length - 1 ? ', ' : ''}</span>
                ))}
            </div>
        </>
    )
}

export default SolvesList