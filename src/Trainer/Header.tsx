import { Link } from 'react-router-dom';

import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

interface Props {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
}

function Header({ darkMode, setDarkMode }: Props) {
    return (
        <header className="flex items-center justify-between bg-secondary px-2 py-4 sm:p-6 shadow-lg">
            <div className="text-xl sm:text-2xl font-bold" >
                <Link 
                    to="/" 
                    className="link"
                    title="Home"
                    aria-label="Home"
                >
                    Lambro Trainer
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <nav className="flex gap-4">
                    <Link to="/pll" className="link" title="PLL Trainer" aria-label="PLL Trainer">PLL</Link>
                    <Link to="/oll" className="link" title="OLL Trainer" aria-label="OLL Trainer">OLL</Link>
                    <Link to="/ollcp" className="link" title="OLLCP Trainer" aria-label="OLLCP Trainer">OLLCP</Link>
                    <Link to="/zbll" className="link" title="ZBLL Trainer" aria-label="ZBLL Trainer">ZBLL</Link>
                </nav>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="btn btn-primary p-1"
                    title={darkMode ? "Light Mode" : "Dark Mode"}
                    aria-label={darkMode ? "Light Mode" : "Dark Mode"}
                >
                    {darkMode ? <MdOutlineLightMode size={24} /> : <MdOutlineDarkMode size={24} />}
                </button>
            </div>
        </header>
    )
}

export default Header