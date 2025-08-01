interface Props {
    cases: Case[];
    toggleCase: (id: string) => void;
}

interface Case {
    id: string;
    scrambles: string;
    img: string;
    enabled: boolean;
}

function CaseSelectionPage({ cases, toggleCase }: Props) {

    return (
        <>
            { cases.map(c => (
                <div key={c.id}>
                    <img
                        src={c.img}
                        alt={`Case ${c.id}`}
                        onClick={() => toggleCase(c.id)}
                        style={{ width: '80px', cursor: 'pointer', opacity: c.enabled ? 1 : 0.4 }}
                    />
                </div>
            ))}
        </>
    )
}

export default CaseSelectionPage