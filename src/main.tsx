import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./global.css";
import "./index.css";

async function main(element: Element | DocumentFragment) {
  const root = createRoot(element);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

main(document.getElementById("root")!);
