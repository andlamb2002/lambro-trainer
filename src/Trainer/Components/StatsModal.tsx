import { useMemo, useState } from 'react';
import type { Solve } from '../interfaces';

import { FiX, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { HiArrowsUpDown } from "react-icons/hi2";

type SortKey =
    | 'firstIndex'
    | 'label'
    | 'count'
    | 'avgMs'
    | 'bestMs'
    | 'worstMs'
    | 'stdevMs';

type Row = {
    key: string;
    label: string;
    img?: string;
    count: number;
    avgMs: number;
    bestMs: number;
    worstMs: number;
    stdevMs: number;
    firstIndex: number;
};

interface Props {
    open: boolean;
    onClose: () => void;
    solves: Solve[];
}

function StatsModal({ open, onClose, solves }: Props) {

    const [sort, setSort] = useState<{ key: SortKey; dir: 'ascending' | 'descending' }>({
        key: 'firstIndex',
        dir: 'ascending',
    });

    const fmt = (ms: number) => (ms / 1000).toFixed(2);

    const rows = useMemo<Row[]>(() => {
    const map = new Map<string, { label: string; img?: string; times: number[]; firstIdx: number }>();
    solves.forEach((s, i) => {
      const k = s.label; 
      if (!map.has(k)) {
        map.set(k, { label: s.label, img: s.img, times: [], firstIdx: i + 1 });
      }
      map.get(k)!.times.push(s.time);
    });

    const out: Row[] = [];
        for (const { label, img, times, firstIdx } of map.values()) {
            const n = times.length;
            const sum = times.reduce((a, b) => a + b, 0);
            const avg = sum / n;
            const best = Math.min(...times);
            const worst = Math.max(...times);
            const variance = n > 1 ? times.reduce((a, t) => a + (t - avg) ** 2, 0) / (n - 1) : 0;
            out.push({
                key: label,
                label,
                img,
                count: n,
                avgMs: avg,
                bestMs: best,
                worstMs: worst,
                stdevMs: Math.sqrt(variance),
                firstIndex: firstIdx,
            });
        }
        return out;
    }, [solves]);

    const sorted = useMemo(() => {
        const data = [...rows];
        data.sort((a, b) => {
            const k = sort.key;
            const va = a[k] as number | string;
            const vb = b[k] as number | string;
            if (typeof va === 'number' && typeof vb === 'number') {
                return sort.dir === 'ascending' ? va - vb : vb - va;
            }
            return sort.dir === 'ascending'
                ? String(va).localeCompare(String(vb))
                : String(vb).localeCompare(String(va));
        });
        return data;
    }, [rows, sort]);

    function toggleSort(key: SortKey) {
        setSort((prev) =>
            prev.key === key
                ? { key, dir: prev.dir === 'ascending' ? 'descending' : 'ascending' }
                : { key, dir: 'ascending' }
            );
    }

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-2"
            onClick={onClose}
        >
            <div
                className="bg-primary rounded w-[95vw] sm:w-full max-w-5xl p-4 sm:p-6 shadow-md max-h-[80vh] overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="stats-title"
            >
                <button
                    className="absolute right-3 top-3 rounded hover:bg-secondary/40 p-2"
                    onClick={onClose}
                    aria-label="Close"
                    title="Close"
                >
                    <FiX className="w-5 h-5" />
                </button>

                <div className="flex items-end justify-between pb-4 pr-8">
                <h3 id="stats-title" className="text-lg">Statistics</h3>
                {/* room for future filters */}
                </div>

                {/* TABLE WRAPPER: scroll on both axes if needed, sticky header */}
                <div className="border rounded-md overflow-auto max-h-[65vh]">
                <table className="min-w-[720px] w-full text-sm sm:text-base">
                    <thead className="bg-secondary sticky top-0 z-10">
                    <tr>
                        <SortableTh
                        label="#"
                        active={sort.key === 'firstIndex'}
                        dir={sort.dir}
                        onClick={() => toggleSort('firstIndex')}
                        ariaSort={sort.key === 'firstIndex' ? sort.dir : 'none'}
                        className="w-[64px]"
                        />
                        <SortableTh
                        label="Case"
                        active={sort.key === 'label'}
                        dir={sort.dir}
                        onClick={() => toggleSort('label')}
                        ariaSort={sort.key === 'label' ? sort.dir : 'none'}
                        />
                        <th className="text-left px-3 py-2">Image</th>
                        <SortableTh
                        label="# of solves"
                        active={sort.key === 'count'}
                        dir={sort.dir}
                        onClick={() => toggleSort('count')}
                        ariaSort={sort.key === 'count' ? sort.dir : 'none'}
                        className="text-right"
                        />
                        <SortableTh
                        label="Avg"
                        active={sort.key === 'avgMs'}
                        dir={sort.dir}
                        onClick={() => toggleSort('avgMs')}
                        ariaSort={sort.key === 'avgMs' ? sort.dir : 'none'}
                        className="text-right"
                        />
                        <SortableTh
                        label="Best"
                        active={sort.key === 'bestMs'}
                        dir={sort.dir}
                        onClick={() => toggleSort('bestMs')}
                        ariaSort={sort.key === 'bestMs' ? sort.dir : 'none'}
                        className="text-right"
                        />
                        <SortableTh
                        label="Worst"
                        active={sort.key === 'worstMs'}
                        dir={sort.dir}
                        onClick={() => toggleSort('worstMs')}
                        ariaSort={sort.key === 'worstMs' ? sort.dir : 'none'}
                        className="text-right"
                        />
                        <SortableTh
                        label="Std Dev"
                        active={sort.key === 'stdevMs'}
                        dir={sort.dir}
                        onClick={() => toggleSort('stdevMs')}
                        ariaSort={sort.key === 'stdevMs' ? sort.dir : 'none'}
                        className="text-right"
                        />
                    </tr>
                    </thead>
                    <tbody>
                    {sorted.map((r) => (
                        <tr key={r.key} className="even:bg-secondary/30">
                        <td className="px-3 py-2">{r.firstIndex}</td>
                        <td className="px-3 py-2">{r.label}</td>
                        <td className="px-3 py-2">
                            {r.img ? (
                            <img
                                src={r.img}
                                alt={r.label}
                                className="w-12 h-12 object-contain mx-auto"
                                loading="lazy"
                            />
                            ) : (
                            <span className="text-xs opacity-60">—</span>
                            )}
                        </td>
                        <td className="px-3 py-2 text-right">{r.count}</td>
                        <td className="px-3 py-2 text-right">{fmt(r.avgMs)}</td>
                        <td className="px-3 py-2 text-right">{fmt(r.bestMs)}</td>
                        <td className="px-3 py-2 text-right">{fmt(r.worstMs)}</td>
                        <td className="px-3 py-2 text-right">{fmt(r.stdevMs)}</td>
                        </tr>
                    ))}
                    {sorted.length === 0 && (
                        <tr>
                        <td className="px-3 py-6 text-center opacity-70" colSpan={8}>
                            No solves yet.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}

function SortIndicator({ active, dir }: { active: boolean; dir: 'ascending' | 'descending' }) {
    if (!active) return <HiArrowsUpDown className="opacity-40 w-4 h-4" />;
    return dir === 'ascending'
        ? <FiArrowUp className="w-4 h-4" />
        : <FiArrowDown className="w-4 h-4" />;
}

function SortableTh({
    label,
    active,
    dir,
    onClick,
    ariaSort,
    className = '',
}: {
    label: string;
    active: boolean;
    dir: 'ascending' | 'descending';
    onClick: () => void;
    ariaSort: 'ascending' | 'descending' | 'none';
    className?: string;
}) {
    return (
        <th
            className={`text-left px-3 py-2 select-none ${className}`}
            aria-sort={ariaSort}
            scope="col"
        >
            <button
                type="button"
                onClick={onClick}
                className="inline-flex items-center gap-2 hover:underline"
                title={`Sort by ${label}`}
                aria-label={`Sort by ${label}`}
            >
                <span>{label}</span>
                <SortIndicator active={active} dir={dir} />
            </button>
        </th>
    );
}

export default StatsModal