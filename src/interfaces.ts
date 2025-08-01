export interface Case {
    id: string;
    scrambles: string;
    img: string;
    enabled: boolean;
}

export interface Solve {
    id: string;
    scramble: string;
    img: string;
    time: number;
}

export interface Preset {
    name: string;
    cases: Case[];
}