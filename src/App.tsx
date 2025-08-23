import { Routes, Route } from 'react-router-dom';

import Trainer from './Trainer/Trainer';

import pllCases from './Trainer/Data/pll_cases.json';
import ollCases from './Trainer/Data/oll_cases.json';

function App() {

return (
        <>
            <Routes>
                <Route path="/pll/*" element={<Trainer algset="pll" data={pllCases} />} />
                <Route path="/oll/*" element={<Trainer algset="oll" data={ollCases} />} />
                <Route path="*" element={<div>Page not found</div>} />
            </Routes>
        </>
    )
}

export default App
