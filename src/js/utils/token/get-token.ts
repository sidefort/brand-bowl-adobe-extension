export function getToken() {
    const token = localStorage.getItem('brandBowlApiToken');
    if (!token) {
        return null;
    }
    return token;
}