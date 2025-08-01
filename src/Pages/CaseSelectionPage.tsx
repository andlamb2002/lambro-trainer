import { useState } from "react";

interface Props {
    cases: Case[];
    toggleCase: (id: string) => void;
    presets: Preset[];
    savePreset: (name: string) => void;
    loadPreset: (preset: Preset) => void;
    deletePreset: (name: string) => void;
}

interface Case {
    id: string;
    scrambles: string;
    img: string;
    enabled: boolean;
}

interface Preset {
    name: string;
    cases: Case[];
}

function CaseSelectionPage({ cases, toggleCase, presets, savePreset, loadPreset, deletePreset }: Props) {

    const [presetName, setPresetName] = useState<string>('');

    return (
        <>
            <div>
                {cases.map(c => (
                    <div key={c.id}>
                        <img
                            src={c.img}
                            alt={`Case ${c.id}`}
                            onClick={() => toggleCase(c.id)}
                            style={{ width: '80px', cursor: 'pointer', opacity: c.enabled ? 1 : 0.4 }}
                        />
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={presetName}
                    onChange={e => setPresetName(e.target.value)}
                    placeholder="Enter preset name"
                />
                <button onClick={() => {
                    savePreset(presetName);
                    setPresetName('');
                }}>Save Preset</button>
                <ul>
                    {presets.map(preset => (
                    <li key={preset.name}>
                        <span onClick={() => loadPreset(preset)} style={{ cursor: 'pointer' }}>
                        {preset.name}
                        </span>
                        {' '}
                        <button onClick={() => deletePreset(preset.name)}>Delete</button>
                    </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default CaseSelectionPage