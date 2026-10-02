import React from "react";
import { hydrateRoot } from "react-dom/client";
import HomeClient from "../app/home-client";
import "../app/globals.css";

const base = import.meta.env.BASE_URL;
const lang = document.documentElement.lang === "zh-CN" ? "zh" : "en";
const queryLang = new URLSearchParams(location.search).get("lang");
if ((queryLang === "zh" || queryLang === "en") && queryLang !== lang) {
  location.replace(`${base}${queryLang === "zh" ? "zh/" : ""}${location.hash}`);
} else {
  // Screenshots are shared by both language pages and by project-URL previews.
  hydrateRoot(document.getElementById("root")!, <HomeClient initialLang={lang} assetBase={base} />);
}
