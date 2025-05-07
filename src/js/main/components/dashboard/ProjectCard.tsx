import { useEffect, useState } from "react";
import { os, path } from "../../../lib/cep/node";
import {
  csi,
  evalES,
  evalFile,
  openLinkInBrowser,
  subscribeBackgroundColor,
  evalTS,
  subscribeActiveDocument,
} from "../../../lib/utils/bolt";
import styles from "./ProjectCard.module.scss";
import { addLogosToAPI } from "../../../services/logos";
import { CloudUploadIcon, DownloadIcon, Loader2Icon } from "lucide-react";
import { useLogos } from "../../../hooks/react-query/use-logos";
import { Logo } from "../../../types/logos";
import { RemoteImage } from "../shared/RemoteImage";

export default function ProjectCard({ uuid, file, label }: Logo) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const downloadLogo = async () => {
    setIsDownloading(true);
    try {
        // Make a fetch request to get the logo as an array buffer using axios
        const response = await fetch(file.fileURL);
        const blob = await response.blob();
        const svgBlob = new Blob([blob], { type: 'image/svg+xml' });
        const svgFile = new File([svgBlob], "brandbowl-logo.svg", { type: 'image/svg+xml' });



    } catch (error) {

    } finally {
        setIsDownloading(false);
    }

    // try {
    //     evalTS("exportFile").then(async (svg) => {
    //         if (!svg) {
    //             console.error("No SVG data returned");
    //             return;
    //         }

    //         const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
    //         await addLogosToAPI({
    //             files: [svgBlob],
    //             projectID: "680a09489f9819cf3a2f889d",
    //             });
    //       });
        
    // } catch (error) {
    //     console.error("Error uploading SVG:", error);
    // }
  }

  return (
    <div className={styles.projectCardContainer}>
        {/* <img src={file.fileURL} alt={label} className={styles.logoImage} /> */}
        <RemoteImage src={file.fileURL} alt={label} className={styles.logoImage} />

        <button className={styles.downloadButton} onClick={downloadLogo}><DownloadIcon /> Import</button>
    </div>         
  );
};
