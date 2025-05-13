import brandBowlAPI from "../integrations/brand-bowl-api";
import type { DataOrError } from "../types/data-or-error";

export const checkIfTokenIsValidOnAPI = async (token: string): Promise<DataOrError<{ success: boolean }>> => {
    try {
        const response = await brandBowlAPI.post(`/v1/external-integrations/api-keys/${token}`, {});

        if (response.data.error) {
            throw new Error(response.data.error);
        }

        return { data: response.data.data };
    } catch (error: any) {
        return { error: error?.response?.data || String(error) };
    }
};