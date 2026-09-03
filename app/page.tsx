import type { Metadata } from "next";
import HomeClient from "./home-client";
import { canonicalUrl, languageFromQuery, metadataText, SITE_URL, type Lang } from "./site-data";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type PageProps = {
  searchParams: SearchParams;
};

async function resolveLanguage(searchParams: SearchParams): Promise<Lang> {
  const params = await searchParams;
  return languageFromQuery(params.lang);
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const lang = await resolveLanguage(searchParams);
  const copy = metadataText[lang];
  const canonical = canonicalUrl(lang);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}/`,
        "zh-CN": `${SITE_URL}/?lang=zh`,
        "x-default": `${SITE_URL}/`,
      },
    },
    openGraph: {
      title: "VideoHarvester",
      description: copy.socialDescription,
      type: "website",
      url: canonical,
      locale: lang === "zh" ? "zh_CN" : "en_US",
      alternateLocale: lang === "zh" ? ["en_US"] : ["zh_CN"],
      images: [{
        url: `${SITE_URL}/og.png`,
        width: 1536,
        height: 1024,
        alt: copy.imageAlt,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: "VideoHarvester",
      description: copy.socialDescription,
      images: [`${SITE_URL}/og.png`],
    },
  };
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const lang = languageFromQuery(params.lang);

  return <HomeClient key={lang} initialLang={lang} />;
}
