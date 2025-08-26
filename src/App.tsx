import { Routes, Route } from 'react-router-dom';

import Trainer from './Trainer/Trainer';
import Header from './Trainer/Header';

import pllCases from './Trainer/Data/pll_cases.json';
import ollCases from './Trainer/Data/oll_cases.json';

function App() {

return (
        <>
            <Header />
            <Routes>
                <Route path="/pll/*" element={<Trainer key="pll" algset="pll" data={pllCases} />} />
                <Route path="/oll/*" element={<Trainer key="oll" algset="oll" data={ollCases} />} />
                <Route path="*" element={<div>Page not found</div>} />
            </Routes>
        </>
    )
}

export default App
