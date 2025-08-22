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
                onClick={() => onLoad(preset)}
                style={{ cursor: 'pointer' }}
            >
                {preset.name}
            </span>{' '}
            <button onClick={() => onDelete(preset.name)}>Delete</button>
        </li>
    )
}

export default PresetItem