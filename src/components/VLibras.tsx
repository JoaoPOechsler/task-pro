"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    VLibras?: { Widget: new (url: string) => void };
  }
}

export default function VLibras() {
  useEffect(() => {
    if (document.querySelector("[vw]")) return;

    const wrapper = document.createElement("div");
    wrapper.setAttribute("vw", "");
    wrapper.className = "enabled";
    wrapper.innerHTML = `
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    `;
    document.body.appendChild(wrapper);

    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
      }
    };
    document.head.appendChild(script);
  }, []);

  return null;
}
