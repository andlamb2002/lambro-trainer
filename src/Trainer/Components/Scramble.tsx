import { useNavigate } from 'react-router-dom';

import type { Case } from '../interfaces';

import { MdArrowBack } from "react-icons/md";

interface Props {
    currentScramble: string;
    recapMode: boolean;
    recapQueue: Case[];
    recapIndex: number;
    toggleRecap: () => void;
}

function Scramble({ currentScramble, recapMode, recapQueue, recapIndex, toggleRecap }: Props) {

    const navigate = useNavigate();


    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-8">
                <button
                    className="btn btn-primary flex items-center gap-1 text-2xl font-bold px-4 py-2"
                    onClick={() => navigate("..")}
                >
                    <MdArrowBack size={24} />
                    Select
                </button>
                <h3 className="font-bold text-2xl">
                    {currentScramble}
                </h3>
            </div>
            <div className="flex items-center gap-2">
                {recapMode && (
                    <div>
                        Progress: {recapIndex + 1} / {recapQueue.length}
                    </div>
                )}
                <button className="btn btn-primary text-2xl font-bold px-4 py-2" onClick={toggleRecap}>
                    {recapMode ? 'End' : 'Recap'}
                </button>
            </div>
        </div>
    )
}

export default Scramble