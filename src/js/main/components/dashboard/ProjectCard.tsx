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
import axios from "axios";

export default function ProjectCard({ uuid, file, label }: Logo) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  async function downloadLogo() {
    setIsDownloading(true);
    try {
      const url = file.fileURL;
      const ext = url.split('.').pop()!.toLowerCase();
      let data: string;
      const isSVG = ext === 'svg' || ext === 'svgz';
  
      if (isSVG) {
        const response = await axios.get(url, { responseType: 'text' });
        const svgText = response.data;

        evalTS("placeSVGInArtboard", svgText).then(async (svg) => {
                          console.log("The SVG was placed in the artboard");
                        });
      } else {
        // raster image as binary
        const resp = await axios.get(url, { responseType: 'arraybuffer' });
        const bytes = new Uint8Array(resp.data);
        // build raw‐binary JS string
        data = Array.prototype.map.call(bytes, (b: number) =>
          String.fromCharCode(b)
        ).join('');

        const fileName = `downloaded.${ext}`;
      // Pass the literal strings (JSON-escaped) plus the flag
      await evalTS(
        'placeImageInArtboard',
        fileName,
        data,
      );
      console.log('Image placed:', fileName);
      }
  
      
  
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className={styles.projectCardContainer}>
        <RemoteImage src={file.fileURL} alt={label} className={styles.logoImage} />

        <button className={styles.downloadButton} onClick={downloadLogo}>
          {isDownloading ? <><Loader2Icon className={styles.spinning} />Importing...</> : <><DownloadIcon /> Import</>}
          </button>
    </div>         
  );
};
