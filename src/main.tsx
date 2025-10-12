import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// Configure native status bar
if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Light }).catch(console.error);
  StatusBar.setBackgroundColor({ color: '#3B82F6' }).catch(console.error);
}

createRoot(document.getElementById("root")!).render(<App />);
