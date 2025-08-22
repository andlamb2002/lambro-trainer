import type { Case } from '../interfaces';

interface Props {
  c: Case;
  toggleCase: (id: string) => void;
}

function CaseItem({ c, toggleCase }: Props) {
    return (
        <>
            <img
                src={c.img}
                alt={`Case ${c.id}`}
                onClick={() => toggleCase(c.id)}
                style={{
                    width: '80px',
                    cursor: 'pointer',
                    opacity: c.enabled ? 1 : 0.4,
                }}
            />
        </>
    )
}

export default CaseItem