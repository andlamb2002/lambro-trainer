import { Link, useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();
    const onTimerPage = location.pathname === '/timer';

    return (
        <header>
            <Link to={onTimerPage ? '/' : '/timer'}>
                {onTimerPage ? 'Select' : 'Start'}
            </Link>
        </header>
    )
}

export default Header