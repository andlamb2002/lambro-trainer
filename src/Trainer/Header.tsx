import { Link } from 'react-router-dom';

function Header() {
    // Add nav later
    return (
        <header className="bg-app-header-dark text-app-text-dark">
                <Link to="/pll">PLL</Link> | <Link to="/oll">OLL</Link>
        </header>
    )
}

export default Header