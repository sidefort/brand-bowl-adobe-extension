import React from "react";
import ReactDOM from "react-dom/client";
import { initBolt, enableSpectrum } from "../lib/utils/bolt";
import "../index.scss";
import "../css-reset.css";
import Main from "./main";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

enableSpectrum();
initBolt();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <Main />
    </QueryClientProvider>
  </React.StrictMode>
);
