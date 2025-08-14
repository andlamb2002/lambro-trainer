import CaseItem from "./CaseItem";
import type { Case } from "../interfaces";

interface Props {
  cases: Case[];
  toggleCase: (id: string) => void;
}

function CasesSection({ cases, toggleCase }: Props) {
    return (
        <div>
            {cases.map((c) => (
                <CaseItem key={c.id} c={c} toggleCase={toggleCase} />
            ))}
        </div>
    )
}

export default CasesSection