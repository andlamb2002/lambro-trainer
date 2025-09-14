import { Link } from "react-router-dom";

function Homepage() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 w-3/5 mt-4 gap-2 sm:gap-8 mx-auto">
            
            <Link to="/pll" className="link flex flex-col items-center rounded hover:bg-secondary p-2" title="PLL Trainer" aria-label="PLL Trainer">
                <img
                    src="https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&bg=t&case=RUR'U'R'FR2U'R'U'RUR'F'"
                    alt="PLL Trainer"
                    className="w-36 h-36"
                />
                <span className="mt-2 text-2xl font-bold">PLL Trainer</span>
            </Link>

            <Link to="/oll" className="link flex flex-col items-center rounded hover:bg-secondary p-2" title="OLL Trainer" aria-label="Oll Trainer">
                <img
                    src="https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage=oll&bg=t&case=RUR'U'R'FRF'"
                    alt="OLL Trainer"
                    className="w-36 h-36"
                />
                <span className="mt-2 text-2xl font-bold">OLL Trainer</span>
            </Link>

            <Link to="/ollcp" className="link flex flex-col items-center rounded hover:bg-secondary p-2" title="OLLCP Trainer" aria-label="OLLCP Trainer">
                <img
                    src="https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage=coll&bg=t&case=D2U2B2L'B'LR2FD2F'U'F2B2L2U2B2D'B2DF2"
                    alt="OLLCP Trainer"
                    className="w-36 h-36"
                />
                <span className="mt-2 text-2xl font-bold">OLLCP Trainer</span>
            </Link>

            <Link to="/zbll" className="link flex flex-col items-center rounded hover:bg-secondary p-2" title="ZBLL Trainer" aria-label="ZBLL Trainer">
                <img
                    src="https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage=ll&bg=t&alg=R2 D' F2 D R2 D2 F2 D R2 D2 B D F2 D' B' D'"
                    alt="ZBLL Trainer"
                    className="w-36 h-36"
                />
                <span className="mt-2 text-2xl font-bold">ZBLL Trainer</span>
            </Link>

        </div>
    )
}

export default Homepage