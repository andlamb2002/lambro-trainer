import { Link } from "react-router-dom";

import Footer from "./Trainer/Footer";

interface TrainerCardProps {
    to: string;
    title: string;
    imgSrc: string;
    alt: string;
}

function TrainerCard({ to, title, imgSrc, alt }: TrainerCardProps) {
    return (
        <Link
            to={to}
            className="link flex flex-col items-center rounded hover:bg-secondary p-2"
            title={title}
            aria-label={title}
        >
            <img src={imgSrc} alt={alt} className="w-36 h-36" />
            <span className="mt-2 text-2xl font-bold text-center">{title}</span>
        </Link>
    );
}

function Homepage() {
    return (
        <div className="flex flex-col flex-grow justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-4 w-3/5 mt-4 gap-2 sm:gap-8 mx-auto">
                <TrainerCard
                    to="/pll"
                    title="PLL Trainer"
                    imgSrc="https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&bg=t&case=RUR'U'R'FR2U'R'U'RUR'F'"
                    alt="PLL Trainer"
                />
                <TrainerCard
                    to="/oll"
                    title="OLL Trainer"
                    imgSrc="https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage=oll&bg=t&case=RUR'U'R'FRF'"
                    alt="OLL Trainer"
                />
                <TrainerCard
                    to="/ollcp"
                    title="OLLCP Trainer"
                    imgSrc="https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage=coll&bg=t&case=D2U2B2L'B'LR2FD2F'U'F2B2L2U2B2D'B2DF2"
                    alt="OLLCP Trainer"
                />
                <TrainerCard
                    to="/zbll"
                    title="ZBLL Trainer"
                    imgSrc="https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage=ll&bg=t&alg=B2DL2D'B2U2R2D'F2D2L'D'R2DLD'"
                    alt="ZBLL Trainer"
                />
            </div>
            <Footer />
        </div>
    )
}

export default Homepage