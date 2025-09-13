import type { Preset } from '../interfaces';

import { MdDelete } from "react-icons/md";

interface Props {
    preset: Preset;
    onLoad: (preset: Preset) => void;
    onDelete: (name: string) => void;
}

function PresetItem({ preset, onLoad, onDelete }: Props) {
    return (
        <li 
            className="flex justify-between items-center bg-secondary p-2 rounded shadow-md cursor-pointer hover:bg-secondary/60"
            onClick={() => onLoad(preset)}
            title={`Load Preset: ${preset.name}`}
            role="button"
            aria-pressed="false"
        >
            <div>
                {preset.name} ({preset.cases.length})
            </div>
            <button 
                className="btn btn-danger p-1" 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(preset.name);
                }}
            >
                <MdDelete size={24} />
            </button>
        </li>
    )
}

export default PresetItem