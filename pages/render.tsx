import React from "react";
import { renderToString } from "react-dom/server";
import HomeClient from "../app/home-client";
export { metadataText, SITE_URL } from "../app/site-data";
export const render = (lang: "en" | "zh", assetBase: string) => renderToString(<HomeClient initialLang={lang} assetBase={assetBase} />);
