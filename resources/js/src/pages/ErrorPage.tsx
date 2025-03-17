import { useRouteError } from "react-router-dom";
import { motion } from "framer-motion";

const ErrorPage = () => {
    const error: any = useRouteError();

    const statusMessage = (status: number) => {
        console.log(status)
        switch (status) {
            case 404:
                return "Page Not Found";
            case 500:
                return "Internal Server Error";
            default:
                return "An unexpected error has occurred.";
        }
    };

    const animationVariants = {
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4">
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="text-center"
            >
                <h1 className="text-6xl font-bold text-red-600 mb-4 animate-pulse">
                    {error?.status || "Error"}
                </h1>
                <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">
                    {statusMessage(error?.status || 500)}
                </p>

                {error?.message && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                        {error.message}
                    </p>
                )}

                {error?.status === 404 && (
                    <motion.div
                        className="mb-8"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <svg
                            className="w-64 h-64 text-indigo-500 dark:text-indigo-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7l6 6-6 6m6-6h13"
                            />
                        </svg>
                    </motion.div>
                )}

                <a
                    href="/"
                    className="inline-block bg-blue-600 text-white text-lg px-6 py-3 rounded-md shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Back to Home
                </a>
            </motion.div>
        </div>
    );
};

export default ErrorPage;
