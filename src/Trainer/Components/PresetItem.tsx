import type { Preset } from '../interfaces';

interface Props {
    preset: Preset;
    onLoad: (preset: Preset) => void;
    onDelete: (name: string) => void;
}

function PresetItem({ preset, onLoad, onDelete }: Props) {
    return (
        <li>
            <span
                className="link"
                onClick={() => onLoad(preset)}
            >
                {preset.name} ({preset.cases.length})
            </span>{' '}
            <button className="btn btn-danger" onClick={() => onDelete(preset.name)}>Delete</button>
        </li>
    )
}

export default PresetItem