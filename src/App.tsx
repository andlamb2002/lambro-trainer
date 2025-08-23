import { Routes, Route, Link } from 'react-router-dom';

import Trainer from './Trainer/Trainer';

import pllCases from './Trainer/Data/pll_cases.json';
import ollCases from './Trainer/Data/oll_cases.json';

function App() {

// Add nav to header later

return (
        <>
            <header>
                  <Link to="/pll">PLL</Link> | <Link to="/oll">OLL</Link>
            </header>
            <Routes>
                <Route path="/pll/*" element={<Trainer key="pll" algset="pll" data={pllCases} />} />
                <Route path="/oll/*" element={<Trainer key="oll" algset="oll" data={ollCases} />} />
                <Route path="*" element={<div>Page not found</div>} />
            </Routes>
        </>
    )
}

export default App
