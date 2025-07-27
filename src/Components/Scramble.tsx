
interface Props {
    currentScramble: string;
}

function Scramble({ currentScramble }: Props) {
        
    return (
        <>
            {currentScramble}
        </>
    )
}

export default Scramble