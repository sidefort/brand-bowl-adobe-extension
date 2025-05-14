import axios from "axios";
import { getToken } from "../utils/token/get-token";

export const API_URL = "https://brand-bowl-app-git-jimmy-add-adobe-extension-sidefort.vercel.app/api";
export const SITE_URL = "https://brand-bowl-app-git-jimmy-add-adobe-extension-sidefort.vercel.app";

const brandBowlAPI = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    headers: {
        "X-BrandBowlB-Token-Type": "brand-bowl",
        "X-BrandBowl-User-Type": "user",
        "X-BrandBowl-Client": "adobe-ext",
    },
});

brandBowlAPI.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

export default brandBowlAPI;
