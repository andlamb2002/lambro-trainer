import type { Case } from '../interfaces';

interface Props {
  c: Case;
  toggleCase: (id: string) => void;
}

function CaseItem({ c, toggleCase }: Props) {

    const bgClass = c.enabled ? "bg-success" : "";

    return (
        <div 
            onClick={() => toggleCase(c.id)}
            className={`aspect-square flex items-center justify-center rounded cursor-pointer hover:opacity-60 ${bgClass}`}
        >
            <img
                src={c.img}
                alt={`Case ${c.id}`}
                className="object-contain"
            />
        </div>
    )
}

export default CaseItem