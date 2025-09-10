import type { Case, SubsetGroup } from "../interfaces";
import { aggregateEnabled } from "../../subsetUtils";
import { stripSpaces } from "../../scrambleUtils";

interface Props {
  group: SubsetGroup;
  onOpen: () => void;
  onAll: () => void;
  onNone: () => void;
}

const ollPreviewUrl = (originalAlg: string) =>
  `https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage=oll&bg=t&case=${stripSpaces(originalAlg)}`;


function ParentCaseItem({ group, onOpen, onAll, onNone }: Props) {
    const agg = aggregateEnabled(group.children);
    const bg =
        agg.state === "all" ? "bg-success" :
        agg.state === "some" ? "bg-warning" : "";

    return (
        <div
            className={`relative aspect-square flex items-center justify-center rounded cursor-pointer hover:opacity-60 ${bg}`}
            title={`${group.baseId} (${agg.on}/${group.children.length})`}
            onClick={onOpen}
            >
            <img
                src={ollPreviewUrl(group.originalAlg)} 
                alt={`${group.baseId} (OLL)`}
                className="object-contain"
            />
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                <button
                className="px-1 py-0.5 text-xs rounded bg-success/90 hover:bg-success shadow"
                onClick={(e) => { e.stopPropagation(); onAll(); }}
                >
                All
                </button>
                <button
                className="px-1 py-0.5 text-xs rounded bg-danger/90 hover:bg-danger shadow"
                onClick={(e) => { e.stopPropagation(); onNone(); }}
                >
                None
                </button>
            </div>
        </div>
    )
}

export default ParentCaseItem