export const domain = 'stg';
const environments = {
    live: "https://api.roja.one",
    stg: "https://stg-api.roja.one",
    dev: "https://dev.roja.one",
    beta: "https://beta.roja.one/server",
    local: "http://192.168.29.85:3500",
    demo: "https://demo-api.roja.one"
};

const path = {
    demo: "demo_assets",
    stg: "assets",
}
export const appName = domain === 'demo' ? "ROJA" : "Jackpot"
export const folderPath = domain !== 'local' ? path[domain] : 'assets'
export const socketurl = environments[domain];
export const BASE_URL = `${environments[domain]}/api/`;
export const imgApi = `${environments[domain]}/${folderPath}/uploads/`;
export const imgOfferApi = `${environments[domain]}/${folderPath}/documents/`;
export const banklogo = `${environments[domain]}/${folderPath}/banklogo/`;
export const privacyURL = 'https://www.roja.one/privacypolicy.html'
export const termsURL = 'https://www.roja.one/termsofuse.html'