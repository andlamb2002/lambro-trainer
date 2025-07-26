import { useState } from 'react';
import Timer from './Components/Timer';
import '@picocss/pico/css/pico.min.css';

function App() {

  const [times, setTimes] = useState<number[]>([]);

  const handleOnStop = (time: number) => {
    setTimes(prev => [...prev, time]);
  };

  return (
    <>
      <Timer onStop={handleOnStop} />
      <ul>
        {times.map((time, index) => (
          <li key={index}>{(time / 1000).toFixed(2)}</li>
        ))}
      </ul>
    </>
  )
}

export default App
