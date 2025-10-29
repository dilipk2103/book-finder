import React from "react";
import { createRoot } from "react-dom/client";

import LibraryExplorer from "./LibraryExplorer.jsx";
import "./libraryTheme.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LibraryExplorer />
  </React.StrictMode>
);
