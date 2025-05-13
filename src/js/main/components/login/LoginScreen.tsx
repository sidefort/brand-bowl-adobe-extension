import { useState, useEffect } from "react";
import { openLinkInBrowser } from "../../../lib/utils/bolt";
import {  SITE_URL } from "../../../integrations/brand-bowl-api";
import { generateToken } from "../../../utils/token/generate-token";
import BrandBowlLogo from "../../../assets/brand-bowl-logo";
import styles from "./LoginScreen.module.scss";
import { Loader2Icon } from "lucide-react";
import { checkIfTokenIsValidOnAPI } from "../../../services/auth";
import { setToken } from "../../../utils/token/set-token";

interface LoginScreenProps {
    onAuthenticate: () => void;
}

export default function LoginScreen({ onAuthenticate }: LoginScreenProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tempToken, setTempToken] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds

    useEffect(() => {
        // If it's loading, check if the token is valid every 2 seconds until
        // the check returns true or it times out after 5 minutes
        if (isLoading && !tempToken) {
            setError("Token not found. Please try again.");
            setIsLoading(false);
            return;
        }
        if (isLoading && tempToken) {
            const interval = setInterval(async () => {
                try {
                    const {data: isValid } = await checkIfTokenIsValidOnAPI(tempToken);

                    if (isValid?.success) {
                        clearInterval(interval);
                        setToken(tempToken);
                        setTempToken(null);
                        onAuthenticate();
                    } else {
                        setTimeRemaining((prev) => prev - 2);
                        if (timeRemaining <= 0) {
                            clearInterval(interval);
                            setError("Token expired. Please try again.");
                            setIsLoading(false);
                        }
                    }
                } catch (err) {
                    console.error("Error checking token validity:", err);
                }
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [isLoading]);

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = generateToken();
            setTempToken(token);
            const url = `${SITE_URL}/integrations?token=${encodeURIComponent(token)}&ext=ilst&action=authorize`;
            openLinkInBrowser(url);
        } catch (err) {
            console.error("Error during login:", err);
            setError("Login failed. Please try again.");
            setTempToken(null);
        }
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className={styles.loadingContainer}>
                    <Loader2Icon className={styles.spinning} /> Waiting for the request to be accepted...
                </div>
            );
        }

        if (error) {
            return (
                <div className={styles.errorContainer}>
                    <p className={styles.errorMessage}>{error}</p>
                </div>
            );
        }


        return (
            <button className={styles.loginButton} onClick={handleLogin}>
                Login
            </button>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <BrandBowlLogo width={150} />
            </div>
            {renderContent()}
        </div>
    )
}