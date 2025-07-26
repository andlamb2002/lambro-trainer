

interface Props {
    times: number[];
}

function TimesList({ times }: Props) {
  return (
    <>
        <ul>
        {times.map((time, index) => (
          <li key={index}>{(time / 1000).toFixed(2)}</li>
        ))}
      </ul>
    </>
  )
}

export default TimesList