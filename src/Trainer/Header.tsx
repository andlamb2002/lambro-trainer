import { Link } from 'react-router-dom';

function Header() {
    // Add nav later
    return (
        <header>
                <Link to="/pll">PLL</Link> | <Link to="/oll">OLL</Link>
        </header>
    )
}

export default Header