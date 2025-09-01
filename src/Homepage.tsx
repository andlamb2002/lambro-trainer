import { Link } from "react-router-dom";

function Homepage() {
    return (
        <div className="grid grid-cols-2 sm:w-3/5 mt-4 gap-2 sm:gap-8 mx-auto">
            
            <Link to="/pll" className="link flex flex-col items-center rounded hover:bg-secondary">
                <img
                    src="https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&bg=t&case=RUR'U'R'FR2U'R'U'RUR'F'"
                    alt="PLL Trainer"
                    className="w-36 h-36"
                />
                <span className="mt-2 text-2xl font-bold">PLL Trainer</span>
            </Link>

            <Link to="/oll" className="link flex flex-col items-center rounded hover:bg-secondary">
                <img
                    src="https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage=oll&bg=t&case=RUR'U'R'FRF'"
                    alt="OLL Trainer"
                    className="w-36 h-36"
                />
                <span className="mt-2 text-2xl font-bold">OLL Trainer</span>
            </Link>

        </div>
    )
}

export default Homepage