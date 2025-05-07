import { RotateCwIcon, TriangleAlert } from "lucide-react";
import styles from "./ErrorCard.module.scss";

interface ErrorCardProps {
    message: string;
    onRetry?: () => void;
}

export default function ErrorCard({ message, onRetry }: ErrorCardProps) {
    return (
        <div className={styles.container}>
            <div className={styles.messageContainer}>
                <TriangleAlert /> {message}
            </div>
            {onRetry && 
                <button className={styles.retryButton}>
                    <RotateCwIcon /> Try again
                </button>
            }
        </div>
    );
}