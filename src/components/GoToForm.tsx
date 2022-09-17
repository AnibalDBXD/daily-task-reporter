import { redirect } from "../utils/redirect";

const GoToForm = () => {
    const handleClick = () => {
        redirect("/form");
    }
    return (
        <div className="fixed left-4 top-14 cursor-pointer">
            <a onClick={handleClick}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-500 hover:text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
            </a>
        </div>
    );
}

export default GoToForm;