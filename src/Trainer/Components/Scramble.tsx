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
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-0 mb-4 sm:px-4">
            <div className="flex w-full justify-between sm:w-auto sm:justify-normal sm:items-center gap-2 sm:gap-8">
                <button
                    className="btn btn-primary flex items-center gap-1 text-2xl font-bold w-auto self-start sm:self-auto px-2 py-1 sm:px-4 sm:py-2"
                    onClick={() => navigate("..")}
                >
                    <MdArrowBack size={24} />
                    Select
                </button>
                <h3 className="hidden sm:block font-bold text-2xl">
                    {currentScramble}
                </h3>
                <div className="sm:hidden flex items-center whitespace-nowrap gap-2">
                    {recapMode && (
                        <div>
                            {recapIndex + 1} / {recapQueue.length}
                        </div>
                    )}
                    <button className="btn btn-primary text-2xl font-bold px-2 py-1 sm:px-4 sm:py-2" onClick={toggleRecap}>
                        {recapMode ? 'End' : 'Recap'}
                    </button>
                </div>
            </div>
            <div className="hidden sm:flex items-center whitespace-nowrap gap-2">
                {recapMode && (
                    <div>
                        {recapIndex + 1} / {recapQueue.length}
                    </div>
                )}
                <button className="btn btn-primary text-2xl font-bold px-2 py-1 sm:px-4 sm:py-2" onClick={toggleRecap}>
                    {recapMode ? 'End' : 'Recap'}
                </button>
            </div>
            <h3 className="sm:hidden font-bold text-2xl">
                {currentScramble}
            </h3>
        </div>
    )
}

export default Scramble