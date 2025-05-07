import axios from "axios";

const API_URL = "https://brand-bowl-app-git-jimmy-add-adobe-extension-sidefort.vercel.app/api";

const token = localStorage.getItem('apiToken');

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
