import type { SubsetGroup } from "../interfaces";
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

    const panelBg =
        agg.state === "all" ? "bg-success" :
        agg.state === "some" ? "bg-warning" :
        "";

    const toggleAll = () => {
        if (agg.state === "all") onNone(); 
        else onAll();
    };

    return (
        <div className="flex flex-col rounded overflow-hidden select-none">
            <div
                className={`aspect-square ${panelBg} flex items-center justify-center cursor-pointer hover:opacity-60`}
                title={`${group.baseId} (${agg.on}/${agg.total})`}
                role="button"
                onClick={toggleAll}
            >
                <img
                    src={ollPreviewUrl(group.originalAlg)}
                    alt={`${group.baseId} (OLL)`}
                    className="object-contain"
                />
            </div>

            <button
                className="w-full text-base px-2 py-1 bg-secondary hover:bg-secondary/60 cursor-pointer text-center"
                onClick={onOpen}
            >
                {agg.on} / {agg.total}
            </button>
        </div>
    )
}

export default ParentCaseItem