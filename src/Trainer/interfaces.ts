export interface Case {
    id: string;
    set: string;
    label: string;
    scrambles: string[];
    originalAlg: string; 
    img: string;
    enabled: boolean;
    subset?: number;
}

export interface SubsetGroup {
    baseId: string;
    set: string;
    originalAlg: string;
    children: Case[];
}

export interface Solve {
    id: string;
    label: string;
    originalAlg: string;
    scramble: string;
    img: string;
    time: number;
    subset?: number;
}

export interface Preset {
    name: string;
    cases: Case[];
}