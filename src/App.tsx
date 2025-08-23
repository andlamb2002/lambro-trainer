import { Routes, Route } from 'react-router-dom';

import Trainer from './Trainer/Trainer';

import pllCases from './Trainer/Data/pll_cases.json';
import ollCases from './Trainer/Data/oll_cases.json';

function App() {

return (
        <>
            <Routes>
                <Route path="/pll/*" element={<Trainer algs="pll" data={pllCases} />} />
                <Route path="/oll/*" element={<Trainer algs="oll" data={ollCases} />} />
                <Route path="*" element={<div>Page not found</div>} />
            </Routes>
        </>
    )
}

export default App
