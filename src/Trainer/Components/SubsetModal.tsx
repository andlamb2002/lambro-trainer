interface Props {
    open: boolean;
    onClose: () => void;
    baseId: string;
    children: React.ReactNode;
    onAll: () => void;
    onNone: () => void;
}

function SubsetModal({ open, onClose, baseId, children, onAll, onNone }: Props) {
    if (!open) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
            onClick={onClose} 
        >
            <div 
                className="bg-primary rounded w-full max-w-3xl p-4 shadow-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex gap-2 items-end pb-4">
                    <h3 className="text-lg">{baseId}</h3>
                    <button className="btn btn-success" onClick={onAll}>All</button>
                    <button className="btn btn-danger" onClick={onNone}>None</button>
                </div>

                <div>{children}</div>
            </div>
        </div>
    );
}

export default SubsetModal