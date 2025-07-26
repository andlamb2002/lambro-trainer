

interface Props {
    times: number[];
}

function TimesList({ times }: Props) {

    const mean: string = times.length > 0
      ? (times.reduce((sum, t) => sum + t, 0) / times.length / 1000).toFixed(2)
      : '0.00';

    return (
        <>
            <div>
                <h2>Solves: {times.length}</h2>
                <h2>Mean: {mean}</h2>
                { times.map((time, index) => (
                    <span key={index}>{(time / 1000).toFixed(2)}{index < times.length - 1 ? ', ' : ''}</span>
                ))}
            </div>
        </>
    )
}

export default TimesList