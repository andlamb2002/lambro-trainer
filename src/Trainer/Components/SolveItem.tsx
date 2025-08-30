import type { Solve } from '../interfaces';

interface Props {
    solve: Solve;
    isLast: boolean;
    onSelect: (solve: Solve) => void;
}

function SolveItem({ solve, isLast, onSelect }: Props) {
    return (
        <span
            className="link"
            onClick={() => onSelect(solve)}
        >
            {(solve.time / 1000).toFixed(2)}
            {!isLast ? ', ' : ''}
        </span>
    )
}

export default SolveItem