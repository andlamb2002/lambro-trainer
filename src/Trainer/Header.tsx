import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="bg-app-header-dark text-app-text-dark">
            <nav>
                <Link to="/pll" className="link">PLL</Link>
                <Link to="/oll" className="link">OLL</Link>
            </nav>
        </header>
    )
}

export default Header