import { useState } from 'react';
import '@picocss/pico/css/pico.min.css';

import Timer from './Components/Timer';
import TimesList from './Components/TimesList';

function App() {

  const [times, setTimes] = useState<number[]>([]);

  const handleOnStop = (time: number) => {
    setTimes(prev => [...prev, time]);
  };

  return (
    <>
      <Timer onStop={handleOnStop} />
      <TimesList times={times} />
    </>
  )
}

export default App
