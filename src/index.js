import React from "react";
import ReactDOM from "react-dom/client";
import "./stylesheets/index.css";
import App from "./components/App";
import { VideoProvider } from "./components/Videos";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <VideoProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  // </VideoProvider>
);
