import { FaGithub, FaYoutube, FaUserCircle } from "react-icons/fa";
import { MdFeedback } from "react-icons/md";

function Footer() {

    const GITHUB_URL = "https://github.com/andlamb2002/lambro-trainer";
    const YT_URL = "https://youtube.com/your-video-or-channel";
    const USER_URL = "https://andrelambro.com/";
    const FEEDBACK_URL = "https://forms.gle/UU7TxjF18dac6wpn8";

    return (
        <footer className="bg-secondary">
            <div className="flex flex-col items-center p-2 text-xs sm:text-sm">
                <div>Built by Andreas Lambropoulos</div>
                <ul className="flex text-2xl sm:text-3xl gap-x-4 mt-2">
                    <li>
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                            title="GitHub Repo"
                            aria-label="GitHub Repo"
                        >
                            <FaGithub />
                        </a>
                    </li>
                    <li>
                        <a
                            href={YT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                            title="Youtube Demo"
                            aria-label="Youtube Demo"
                        >
                            <FaYoutube />
                        </a>
                    </li>
                    <li>
                        <a
                            href={USER_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                            title="Portfolio"
                            aria-label="Portfolio"
                        >
                            <FaUserCircle />
                        </a>
                    </li>
                    <li>
                        <a
                            href={FEEDBACK_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                            title="Feedback"
                            aria-label="Feedback"
                        >
                            <MdFeedback />
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer