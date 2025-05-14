import { useQuery } from "@tanstack/react-query";
import { getLogosFromAPI } from "../../services/logos";

export function useLogos(projectID?: string) {
    return useQuery({
        queryKey: ["logos", projectID],
        queryFn: () => getLogosFromAPI({ projectID: projectID || "" }),
        // enable only if projectID is not empty
        enabled: !!projectID,
    });
}
