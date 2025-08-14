import CasesSection from "../Components/CasesSection";
import PresetSection from "../Components/PresetSection";
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

    return (
        <>
            <CasesSection cases={cases} toggleCase={toggleCase} />
            <PresetSection
                presets={presets}
                savePreset={savePreset}
                loadPreset={loadPreset}
                deletePreset={deletePreset}
            />
        </>
    )
}

export default CaseSelectionPage