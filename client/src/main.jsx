// import {StrictMode} from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext.jsx";
import { PodcastContextProvider } from "@/context/PodCastContext.jsx";
import { AudioProvider } from "./context/AudioContext";
// import {AuthProvider} from "@/context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <PodcastContextProvider>
        <AudioProvider>
          <App />
        </AudioProvider>
      </PodcastContextProvider>
    </AuthProvider>
  </BrowserRouter>
);
