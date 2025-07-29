
interface Props {
    currentScramble: string;
}

function Scramble({ currentScramble }: Props) {
        
    return (
        <h3>
            {currentScramble}
        </h3>
    )
}

export default Scramble