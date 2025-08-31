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
        <div className="px-4">
            <h2 className="text-xl font-bold underline">Presets</h2>
            <div className="flex gap-2 pt-2">
                <input
                    className="flex-grow bg-secondary placeholder:text-text/60 rounded shadow-md px-2 py-1 focus:outline-none"
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Enter preset name"
                />
                <button className="btn btn-primary" onClick={() => savePreset(presetName)}>Save</button>
            </div>
            <ul className="flex flex-col gap-2 py-2">
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