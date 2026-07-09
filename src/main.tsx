import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@fontsource/amiri-quran";
import "@fontsource/amiri";
import "@fontsource/amiri/700.css";
import "@fontsource/inter";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/tajawal";
import "@fontsource/tajawal/500.css";
import "@fontsource/tajawal/700.css";
import "./index.css";

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    // Optionally alert the user that a new version is available
  },
  onOfflineReady() {
    // App is ready to work offline
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
