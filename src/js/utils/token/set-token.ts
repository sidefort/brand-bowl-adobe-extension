export function setToken(token: string) {
    if (!token) {
        throw new Error("Token is required");
    }
    localStorage.setItem('brandBowlApiToken', token);
}