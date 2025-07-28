

interface Case {
    id: string;
    scrambles: string;
    img: string;
    enabled: boolean;
}

const scrambles = [
    'R2 U2 R U2 R2 U2 R2 U2 R U2 R2',
    'R U\' R U R U R U\' R\' U\' R2',
    'R2 U R U R\' U\' R\' U\' R\' U R\'',
    'R\' U\' R2 U R U R\' U\' R U R U\' R U\' R\'',
]

function invertScramble(scramble: string): string {
    return scramble.split(' ').map(move => {
        if (move.endsWith('\'')) {
            return move.slice(0, -1);
        } else if (move.endsWith('2')) {
            return move;
        } else {
            return move + '\'';
        }
    }).reverse().join(' ');
}

function generateCases(scrambles: string[]): Case[] {
    return scrambles.map((scramble, index) => ({
        id: (index + 1).toString().padStart(2, '0'),
        scrambles: invertScramble(scramble),
        img: `https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&bg=t&case=${encodeURIComponent(scramble)}`,
        enabled: true,
    }));
}

export const formattedScrambles: Case[] = generateCases(scrambles);
