import { useState } from "react";
import { evalTS } from "../../../lib/utils/bolt";
import styles from "./ProjectDashboard.module.scss";
import { addLogosToAPI } from "../../../services/logos";
import { CloudUploadIcon, Loader2Icon, LogOutIcon, PlusIcon } from "lucide-react";
import { useLogos } from "../../../hooks/react-query/use-logos";
import ProjectCard from "./ProjectCard";
import BrandBowlLogo from "../../../assets/brand-bowl-logo";
import Loading from "./Loading";
import ErrorCard from "./ErrorCard";
import { useProjects } from "../../../hooks/react-query/use-projects";
import { deleteToken } from "../../../utils/token/delete-token";

interface ProjectDashboardProps {
  onLogout: () => void;
}

export default function ProjectDashboard({ onLogout }: ProjectDashboardProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<string | undefined>("");
  const { data, refetch, isLoading, isError } = useLogos(selectedProject);
  const { data: projects, isLoading: isLoadingProjects, isError: isErrorProjects } = useProjects();

  const handleLogout = async () => {
    deleteToken();
    onLogout();
  };

  const uploadSVG = async () => {
    setIsUploading(true);
    try {
        evalTS("exportFile").then(async (svg) => {
            if (!svg || !selectedProject) {
                console.error("No SVG data returned");
                return;
            }

            const svgBlob = new Blob([svg], { type: 'image/svg+xml' });

            const svgFile = new File([svgBlob], "logo.svg", { type: 'image/svg+xml' });
            
            await addLogosToAPI({
                files: [svgFile],
                projectID: selectedProject,
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

    if (isError || isErrorProjects) return <ErrorCard message="There was an error loading the projects." onRetry={refetch} />;

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

            <button className={styles.logoutButton} onClick={handleLogout} title="Logout">
                <LogOutIcon /> Logout
            </button>
        </div>
        <div className={styles.projectsContainer}>
          <label htmlFor="projects" className={styles.projectsLabel}>Select Project:</label>
          <div className={styles.projectsDropdownContainer}>
            <select id="projects" className={styles.projectsDropdown} disabled={isLoadingProjects} value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                {isLoadingProjects && <option disabled>Loading...</option>}
                {projects?.data && projects.data.length > 0 && (
                  <>
                    <option value="" disabled>Select a project</option>
                    {projects.data.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </>
                
                )}
            </select>
            {/* <button id="btnAdd" className={styles.addProjectButton}><PlusIcon /></button> */}
          </div>
        </div>


        <div className={styles.uploadContainer}>
		    <button className={styles.uploadButton} onClick={uploadSVG}>
                {isUploading ? <><Loader2Icon className={styles.spinning} />Uploading...</> : <><CloudUploadIcon  /> Upload selected artboard</>}
            </button>
	    </div>

        <h2 className={styles.logosHeading}>Assets</h2>
        {renderContent()}
  </div>
  );
};
