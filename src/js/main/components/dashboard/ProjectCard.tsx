import { useState } from "react";
import { evalTS } from "../../../lib/utils/bolt";
import styles from "./ProjectCard.module.scss";
import { DownloadIcon, Loader2Icon } from "lucide-react";
import { Logo } from "../../../types/logos";
import { RemoteImage } from "../shared/RemoteImage";
import axios from "axios";

export default function ProjectCard({ file, label }: Logo) {
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
        const resp = await axios.get(url, { responseType: 'arraybuffer' });
        const bytes = new Uint8Array(resp.data);

        data = Array.prototype.map.call(bytes, (b: number) =>
          String.fromCharCode(b)
        ).join('');

        const fileName = `downloaded.${ext}`;

      await evalTS(
        'placeImageInArtboard',
        fileName,
        data,
      );
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className={styles.projectCardContainer} onClick={downloadLogo}>
        <RemoteImage src={file.fileURL} alt={label} className={styles.logoImage} />

        <div className={styles.label}>
          {isDownloading ? <><Loader2Icon className={styles.spinning} />Importing...</> : <><DownloadIcon /> Import</>}
          </div>
    </div>         
  );
};
