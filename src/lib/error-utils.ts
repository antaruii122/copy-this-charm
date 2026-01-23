import { toast } from "sonner";
import { ApplicationError } from "./errors";

/**
 * Global error handler to process and display errors consistently.
 * @param error The error object (any type)
 * @param silent If true, suppresses the toast notification
 */
export const handleError = (error: unknown, silent: boolean = false) => {
    console.error("Application Error:", error);

    let message = "An unexpected error occurred.";
    let description = "Please try again later.";

    if (error instanceof ApplicationError) {
        message = error.message;
        if (error.details) {
            // Potentially format details for the toast
            description = JSON.stringify(error.details);
        }
    } else if (error instanceof Error) {
        message = error.message;
    }

    if (!silent) {
        toast.error(message, {
            description: description === "Please try again later." ? undefined : description,
            action: {
                label: "Dismiss",
                onClick: () => console.log("Error dismissed"),
            },
        });
    }
};

/**
 * Async wrapper to handle errors in promises automatically.
 * Usage: const [data, error] = await catchError(promise);
 */
export async function catchError<T>(
    promise: Promise<T>
): Promise<[T | null, Error | null]> {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        return [null, error as Error];
    }
}
