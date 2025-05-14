import { useQuery } from "@tanstack/react-query";
import { getProjectsFromAPI } from "../../services/projects";

export function useProjects() {
    return useQuery({
        queryKey: ["all-projects"],
        queryFn: () => getProjectsFromAPI(),
    });
}
