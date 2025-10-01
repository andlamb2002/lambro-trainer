import { useMemo } from 'react';
import type { Solve } from '../interfaces';

// import { MdClose, MdArrowUpward, MdArrowDownward, MdUnfoldMore } from 'react-icons/md';
import { MdClose } from 'react-icons/md';

const headers = [
    { id: 'firstIndex', key: 'firstIndex', label: '#' },
    { id: 'label',      key: 'label',      label: 'Case' },
    { id: 'img',        key: 'img',        label: 'Image' },
    { id: 'count',      key: 'count',      label: 'Count' },
    { id: 'avgMs',      key: 'avgMs',      label: 'Avg' },
    { id: 'bestMs',     key: 'bestMs',     label: 'Best' },
    { id: 'worstMs',    key: 'worstMs',    label: 'Worst' },
    { id: 'stdevMs',    key: 'stdevMs',    label: 'SD' },
];

interface Props {
    open: boolean;
    onClose: () => void;
    solves: Solve[];
}

function StatsModal({ open, onClose, solves }: Props) {
    const aggregated = useMemo(() => {
        const map = new Map<string, { label: string; img?: string; times: number[]; firstSeenAt: number }>();

        solves.forEach((s, i) => {
            if (!map.has(s.label)) {
                map.set(s.label, { label: s.label, img: s.img, times: [], firstSeenAt: i + 1 }); 
            }
            map.get(s.label)!.times.push(s.time);
        });

        const rawRows = Array.from(map.values()).map(({ label, img, times, firstSeenAt }) => {
            const n = times.length;
            const sum = times.reduce((a, b) => a + b, 0);
            const avg = sum / n;
            const best = Math.min(...times);
            const worst = Math.max(...times);
            const variance = n > 1 ? times.reduce((a, t) => a + (t - avg) ** 2, 0) / (n - 1) : 0;
            const stdev = Math.sqrt(variance);

            return {
                firstIndex: 0,
                label,
                img,
                count: n,
                avgMs: (avg / 1000).toFixed(2),
                bestMs: (best / 1000).toFixed(2),
                worstMs: (worst / 1000).toFixed(2),
                stdevMs: (stdev / 1000).toFixed(2),
                firstSeenAt,
            };
        });

        rawRows.sort((a, b) => a.firstSeenAt - b.firstSeenAt);

        const finalRows = rawRows.map((r, idx) => ({
            ...r,
            firstIndex: idx + 1,
        }));

        console.log('stats rows (for table):', finalRows);

        return finalRows;
    }, [solves]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stats-title"
            onClick={onClose}
        >
            <div
                className="bg-primary rounded w-full max-w-4xl p-4 shadow-md relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="absolute right-2 top-2 btn btn-danger p-1"
                    onClick={onClose}
                    aria-label="Close"
                    title="Close"
                >
                    <MdClose size={24} />
                </button>

                <div className="flex items-center justify-between pr-8">
                    <h3 id="stats-title" className="text-xl font-bold">
                        Statistics
                    </h3>
                </div>

                <div className="mt-4 flex justify-center overflow-auto max-h-[65vh] scrollbar-hide">
                    <table>
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index}>
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {aggregated.map((row) => (
                                <tr key={row.label}>
                                    {headers.map((h) =>
                                        h.key === 'img' ? (
                                            <td key={h.id}>
                                                {row.img ? (
                                                    <img src={row.img} alt={row.label} />
                                                ) : (
                                                    '—'
                                                )}
                                            </td>
                                        ) : (
                                            <td key={h.id}>
                                                {row[h.key as keyof typeof row] as string}
                                            </td>
                                        )
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default StatsModal