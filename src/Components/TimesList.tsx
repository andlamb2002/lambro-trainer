

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
                <h3>Solves: {times.length}</h3>
                <h3>Mean: {mean}</h3>
                { times.map((time, index) => (
                    <span key={index}>{(time / 1000).toFixed(2)}{index < times.length - 1 ? ', ' : ''}</span>
                ))}
            </div>
        </>
    )
}

export default TimesList