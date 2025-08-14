import { useState } from "react";
import PresetItem from "./PresetItem";
import type { Preset } from "../interfaces";

interface Props {
    presets: Preset[];
    savePreset: (name: string) => void;
    loadPreset: (preset: Preset) => void;
    deletePreset: (name: string) => void;
}

function PresetSection({ presets, savePreset, loadPreset, deletePreset }: Props) {

    const [presetName, setPresetName] = useState<string>("");

    const handleLoadPreset = (preset: Preset) => {
        loadPreset(preset);
        setPresetName(preset.name);
    };

    return (
        <div>
            <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Enter preset name"
            />
            <button onClick={() => savePreset(presetName)}>Save Preset</button>

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
    )
}

export default PresetSection