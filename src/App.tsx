import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';

import Trainer from './Trainer/Trainer';
import Header from './Trainer/Header';
import Homepage from "./Homepage";

import pllCases from './Trainer/Data/pll_cases.json';
import ollCases from './Trainer/Data/oll_cases.json';
import ollcpCases from './Trainer/Data/ollcp_cases.json';
import zbllCases from './Trainer/Data/zbll_cases.json';

function App() {

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") !== "light"; 
    });

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

return (
        <div className="flex flex-col min-h-screen bg-primary text-text scrollbar-hide">
            <Header 
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/pll/*" element={<Trainer key="pll" algset="pll" data={pllCases} />} />
                    <Route path="/oll/*" element={<Trainer key="oll" algset="oll" data={ollCases} />} />
                    <Route path="/ollcp/*" element={<Trainer key="ollcp" algset="ollcp" data={ollcpCases} />} />
                    <Route path="/zbll/*" element={<Trainer key="zbll" algset="zbll" data={zbllCases} />} />
                    <Route path="*" element={<div>Page not found</div>} />
                </Routes>
            </main>
            
        </div>
    )
}

export default App
