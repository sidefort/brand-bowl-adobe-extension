import { Loader2Icon } from "lucide-react";
import styles from "./Loading.module.scss";

export default function Loading() {
    return <div className={styles.container}><Loader2Icon />Loading projects...</div>;
}