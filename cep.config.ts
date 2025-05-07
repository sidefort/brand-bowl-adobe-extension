import { CEP_Config } from "vite-cep-plugin";
import { version } from "./package.json";


const config: CEP_Config = {
  version,
  id: "co.brandbowl.brandbowl",
  displayName: "Brand Bowl",
  symlink: "local",
  port: 3000,
  servePort: 5000,
  startingDebugPort: 8860,
  extensionManifestVersion: 6.0,
  requiredRuntimeVersion: 9.0,
  hosts: [
    { name: "ILST", version: "[0.0,99.9]" },
    { name: "PHXS", version: "[0.0,99.9]" },
    { name: "PHSP", version: "[0.0,99.9]" },
    { name: "IDSN", version: "[0.0,99.9]" },
  ],

  type: "Panel",
  iconDarkNormal: "./src/assets/light-icon.png",
  iconNormal: "./src/assets/dark-icon.png",
  iconDarkNormalRollOver: "./src/assets/light-icon.png",
  iconNormalRollOver: "./src/assets/dark-icon.png",
  parameters: ["--v=0", "--enable-nodejs", "--mixed-context"],
  width: 200,
  height: 450,

  panels: [
    {
      mainPath: "./main/index.html",
      name: "main",
      panelDisplayName: "Brand Bowl",
      autoVisible: false,
      width: 200,
      height: 450,
    },

  ],
  build: {
    jsxBin: "off",
    sourceMap: true,
  },
  zxp: {
    country: "EE",
    province: "CA",
    org: "Sidefort OÜ",
    password: "mypassword",
    tsa: [
      "http://timestamp.digicert.com/", // Windows Only
      "http://timestamp.apple.com/ts01", // MacOS Only
    ],
    allowSkipTSA: false,
    sourceMap: false,
    jsxBin: "off",
  },
  installModules: [],
  copyAssets: [],
  copyZipAssets: [],
};
export default config;
