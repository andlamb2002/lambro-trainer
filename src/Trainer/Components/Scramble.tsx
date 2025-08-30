import type { Case } from '../interfaces';

interface Props {
    currentScramble: string;
    recapMode: boolean;
    recapQueue: Case[];
    recapIndex: number;
    toggleRecap: () => void;
}

function Scramble({ currentScramble, recapMode, recapQueue, recapIndex, toggleRecap }: Props) {

    return (
        <>
            <h3>
                {currentScramble}
            </h3>
            <div>
                <button className="btn btn-primary" onClick={toggleRecap}>
                {recapMode ? 'End Recap' : 'Start Recap'}
                </button>
                
                {recapMode && (
                <span>
                    Recap Progress: {recapIndex + 1} / {recapQueue.length}
                </span>
                )}
            </div>
        </>
    )
}

export default Scramble