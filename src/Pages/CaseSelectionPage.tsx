import { useState } from "react";
import CaseItem from "../Components/CaseItem";
import PresetItem from "../Components/PresetItem";

import type { Case, Preset } from '../interfaces';

interface Props {
    cases: Case[];
    toggleCase: (id: string) => void;
    presets: Preset[];
    savePreset: (name: string) => void;
    loadPreset: (preset: Preset) => void;
    deletePreset: (name: string) => void;
}

function CaseSelectionPage({ cases, toggleCase, presets, savePreset, loadPreset, deletePreset }: Props) {

    const [presetName, setPresetName] = useState<string>('');

    const handleLoadPreset = (preset: Preset) => {
        loadPreset(preset);
        setPresetName(preset.name);
    };

    return (
        <>
            <div>
                {cases.map((c) => (
                    <CaseItem key={c.id} c={c} toggleCase={toggleCase} />
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
                }}>Save Preset</button>
                <ul>
                    {presets.map((preset) => (
                    <PresetItem
                        key={preset.name}
                        preset={preset}
                        onLoad={handleLoadPreset}
                        onDelete={deletePreset}
                    />
                    ))}
                </ul>
            </div>
        </>
    )
}

export default CaseSelectionPage