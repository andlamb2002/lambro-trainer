import { Link } from 'react-router-dom';

import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

interface Props {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
}

function Header({ darkMode, setDarkMode }: Props) {
    return (
        <header className="flex items-center justify-between bg-secondary px-2 py-4 sm:p-6 shadow-lg">
            <div className="text-xl sm:text-2xl font-bold">
                Lambro Trainer
            </div>
            <div className="flex items-center gap-4">
                <nav className="flex gap-4">
                    <Link to="/pll" className="link">PLL</Link>
                    <Link to="/oll" className="link">OLL</Link>
                </nav>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="btn btn-primary p-1"
                >
                    {darkMode ? <MdOutlineLightMode size={24} /> : <MdOutlineDarkMode size={24} />}
                </button>
            </div>
        </header>
    )
}

export default Header