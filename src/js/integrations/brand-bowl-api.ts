import axios from "axios";
import { getToken } from "../utils/token/get-token";

export const API_URL = "https://brand-bowl-app-git-jimmy-add-adobe-extension-sidefort.vercel.app/api";
export const SITE_URL = "https://brand-bowl-app-git-jimmy-add-adobe-extension-sidefort.vercel.app";

const token = getToken();

const brandBowlAPI = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    headers: {
        "X-BrandBowlB-Token-Type": "brand-bowl",
        "X-BrandBowl-User-Type": "user",
        "X-BrandBowl-Client": "adobe-ext",
        Authorization: token ? `Bearer ${token}` : null,
    },
});

export default brandBowlAPI;
