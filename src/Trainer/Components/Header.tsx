import { Link, useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();
    const onTimerPage = location.pathname.endsWith('/timer');

    return (
        <header>
            <Link to={onTimerPage ? '..' : 'timer'} relative="path">
                {onTimerPage ? 'Select' : 'Start'}
            </Link>
        </header>
    )
}

export default Header