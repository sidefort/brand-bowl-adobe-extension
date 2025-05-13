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
import styles from "./ProjectDashboard.module.scss";
import { addLogosToAPI } from "../../../services/logos";
import { CloudUploadIcon, Loader2Icon, LogOutIcon } from "lucide-react";
import { useLogos } from "../../../hooks/react-query/use-logos";
import ProjectCard from "./ProjectCard";
import BrandBowlLogo from "../../../assets/brand-bowl-logo";
import Loading from "./Loading";
import ErrorCard from "./ErrorCard";

interface ProjectDashboardProps {
  onLogout: () => void;
}

export default function ProjectDashboard({ onLogout }: ProjectDashboardProps) {
//   const [documentSelection, setDocumentSelection] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { data, refetch, isLoading, isError } = useLogos("680a09489f9819cf3a2f889d");

  //* Demonstration of Traditional string eval-based ExtendScript Interaction
  const jsxTest = async () => {
    // console.log(evalES(`helloWorld("${csi.getApplicationID()}")`));
    await evalTS("alertDialog", "Hello, user!")
  };

  //* Demonstration of End-to-End Type-safe ExtendScript Interaction
  const jsxTestTS = () => {
    evalTS("helloStr", "test").then((res) => {
      console.log(res);
    });
    evalTS("helloNum", 1000).then((res) => {
      console.log(typeof res, res);
    });
    evalTS("helloArrayStr", ["ddddd", "aaaaaa", "zzzzzzz"]).then((res) => {
      console.log(typeof res, res);
    });
    evalTS("helloObj", { height: 90, width: 100 }).then((res) => {
      console.log(typeof res, res);
      console.log(res.x);
      console.log(res.y);
    });
    evalTS("helloVoid").then(() => {
      console.log("function returning void complete");
    });
    evalTS("helloError", "test").catch((e) => {
      console.log("there was an error", e);
    });
  };

  const nodeTest = () => {
    alert(
      `Node.js ${process.version}\nPlatform: ${
        os.platform
      }\nFolder: ${path.basename(window.cep_node.global.__dirname)}`
    );
  };

  useEffect(() => {
    if (window.cep) {
    //   subscribeBackgroundColor(setBgColor);
    //   subscribeActiveDocument(setDocumentSelection);
    }
  }, []);

  const uploadSVG = async () => {
    setIsUploading(true);
    try {
        evalTS("exportFile").then(async (svg) => {
            if (!svg) {
                console.error("No SVG data returned");
                return;
            }

            const svgBlob = new Blob([svg], { type: 'image/svg+xml' });

            const svgFile = new File([svgBlob], "logo.svg", { type: 'image/svg+xml' });
            
            await addLogosToAPI({
                files: [svgFile],
                projectID: "680a09489f9819cf3a2f889d",
                });

            await evalTS("alertDialog", "The asset was uploaded successfully!")

            refetch();
          });
        
    } catch (error) {
        console.error("Error uploading SVG:", error);
        await evalTS("alertDialog", "There was an error uploading the asset. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function renderContent() {
    if (isLoading) return <Loading />;

    if (isError) return <ErrorCard message="There was an error loading the projects." onRetry={refetch} />;

    if (data?.data?.logos && data.data.logos.length === 0) {
        return <div className={styles.noLogos}>No logos found.</div>;
    }

    if (data?.data?.logos && data.data.logos.length > 0) {
        return (
            <div className={styles.logosContainer}>
                {data?.data?.logos && data.data.logos.length > 0 && data.data.logos.map((logo) => (
                    <ProjectCard key={logo.uuid} {...logo} />
                ))}
            </div>
        );
    }

    return null;
    
  }

  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <BrandBowlLogo width={150} />

            {/* <span id="greeting">Hello, user!</span> */}
            <button className={styles.logoutButton} onClick={jsxTest} title="Logout">
                <LogOutIcon /> Logout
            </button>
        </div>
        <label >Select Project:</label>
        <select id="projects" />
        {/* <button id="btnAdd" onClick={() => openLinkInBrowser("https://www.getbrandbowl.com")}>Add New</button> */}
        <button id="btnAdd">Add New</button>
        {/* <p>Document Selection: {String(documentSelection)}</p> */}


        <div className={styles.uploadContainer}>
		    <button className={styles.uploadButton} onClick={uploadSVG}>
                {isUploading ? <><Loader2Icon className={styles.spinning} />Uploading...</> : <><CloudUploadIcon  /> Upload selected artboard</>}
            </button>
	    </div>

        <h2 className={styles.logosHeading}>Assets</h2>
        {renderContent()}
        {/* <div className={styles.logosContainer}>
            {data?.data?.logos && data.data.logos.length > 0 && data.data.logos.map((logo) => (
                <ProjectCard key={logo.uuid} {...logo} />
            ))}
        </div> */}
  </div>
  );
};
