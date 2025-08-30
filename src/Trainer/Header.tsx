import { Link } from 'react-router-dom';

interface Props {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
}

function Header({ darkMode, setDarkMode }: Props) {
    return (
        <header className="flex items-center justify-between bg-secondary px-4 py-8 shadow-lg">
            <div className="text-2xl font-bold">
                Lambro Trainer
            </div>
            <div className="flex items-center gap-4 pr-4">
                <nav className="flex gap-4">
                    <Link to="/pll" className="link">PLL</Link>
                    <Link to="/oll" className="link">OLL</Link>
                </nav>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="btn btn-primary"
                >
                    {darkMode ? "Light" : "Dark"}
                </button>
            </div>
        </header>
    )
}

export default Header