export interface Case {
    id: string;
    label: string;
    scrambles: string[];
    originalAlg: string; 
    img: string;
    enabled: boolean;
}

export interface Solve {
    id: string;
    label: string;
    scramble: string;
    img: string;
    time: number;
}

export interface Preset {
    name: string;
    cases: Case[];
}