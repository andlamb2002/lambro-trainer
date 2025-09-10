import React from 'react'

interface Props {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    wide?: boolean;
}

function SubsetModal({ open, onClose, title, children, wide }: Props) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className={`bg-primary text-text rounded-2xl w-full ${wide ? "max-w-4xl" : "max-w-2xl"} shadow-xl`}>
                <div className="flex items-center justify-between p-3 border-b border-white/10">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <button className="btn btn-danger" onClick={onClose}>Close</button>
                </div>
                <div className="p-3">{children}</div>
            </div>
        </div>
    );
}

export default SubsetModal