import brandBowlAPI from "../integrations/brand-bowl-api";
import { DataOrError } from "../types/data-or-error";
import { Logo, Project } from "../types/logos";

export const getProjectsFromAPI = async (): Promise<DataOrError<Project[]>> => {
    try {

        const response = await brandBowlAPI.get("/v1/external-integrations/projects/");

        if (response.data.error) {
            throw new Error(response.data.error);
        }

        return { data: response.data.data.projects };
    } catch (error: any) {
        return { error: error?.response?.data || String(error) };
    }
};

interface GetLogosToAPIParams {
    projectID: string;
}

export const getLogosFromAPI = async ({
    projectID = "680a09489f9819cf3a2f889d",
}: GetLogosToAPIParams): Promise<DataOrError<{ logos: Logo[] }>> => {
    try {

        const response = await brandBowlAPI.get(`/v1/external-integrations/projects/${projectID}/logos`);

        if (response.data.error) {
            throw new Error(response.data.error);
        }

        return { data: response.data.data };
    } catch (error: any) {
        return { error: error?.response?.data || String(error) };
    }
};