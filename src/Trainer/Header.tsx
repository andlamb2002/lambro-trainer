import { Link } from 'react-router-dom';

interface Props {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
}

function Header({ darkMode, setDarkMode }: Props) {
    return (
        <header className="bg-secondary">
            <nav>
                <Link to="/pll" className="link">PLL</Link>
                <Link to="/oll" className="link">OLL</Link>
            </nav>
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="btn btn-primary"
            >
                {darkMode ? "Light" : "Dark"}
            </button>
        </header>
    )
}

export default Header