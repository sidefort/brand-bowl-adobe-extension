import { Loader2Icon } from "lucide-react";
import styles from "./LoadingScreen.module.scss";

export default function LoadingScreen() {
    return <div className={styles.container}><Loader2Icon /></div>;
}