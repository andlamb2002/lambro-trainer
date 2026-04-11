import { useEffect, useState } from 'react';

interface Props {
    testSiteUrl: string;
}

function AnnouncementModal({ testSiteUrl }: Props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('v2-announcement-dismissed');
        if (!dismissed) {
            setOpen(true);
        }
    }, []);

    function handleClose() {
        setOpen(false);
    }

    function handleDontShowAgain() {
        localStorage.setItem('v2-announcement-dismissed', 'true');
        setOpen(false);
    }

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="v2-announcement-title"
            onClick={handleClose}
        >
            <div
                className="bg-secondary rounded shadow-md w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="p-4">
                    <h2 id="v2-announcement-title" className="text-xl font-bold mb-6">
                        Lambro Trainer V2 Coming Soon
                    </h2>
                    <p>
                        Includes improved features like sessions replacing presets and recap progress surviving page reloads. Try it out at:
                    </p>
                    <a
                        href={testSiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link inline-block mb-6"
                    >
                        {testSiteUrl}
                    </a>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 btn btn-success"
                        >
                            Ok
                        </button>
                        <button
                            type="button"
                            onClick={handleDontShowAgain}
                            className="flex-1 btn btn-danger"
                        >
                            Don't Show Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnnouncementModal;