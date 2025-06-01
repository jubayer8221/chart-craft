// import { Locale, LOCALES } from "../../../config";
// import { getMessages } from "../../i18n";
// import MainPage from "@/components/Home/Home";

// interface PageProps {
//   params: { lang: string };
// }

// export default function HomePage({ params }: PageProps) {
//   const rawLang = params.lang || "en";
//   const lang = rawLang.toLowerCase();
//   const locale: Locale = LOCALES.includes(lang as Locale)
//     ? (lang as Locale)
//     : "en";

//   const messages = getMessages(locale);

//   return (
//     <section>
//       <MainPage />

//       <p>{messages.description ?? "This is the home page."}</p>
//     </section>
//   );
// }
import MainPage from "@/components/Home/Home";

export default function Home() {
  return (
    <main className="">
      <MainPage />
    </main>
  );
}

// import MainPage from "@/components/Home/Home";
// import { translateText } from "@/app/api/translate";

// interface PageProps {
//   params: { lang: string };
// }

// export default async function Home({ params }: PageProps) {
//   const lang = params.lang || "en";

//   // Fetch translations dynamically
//   const welcomeText = await translateText("Welcome to our website", lang);
//   const homeLabel = await translateText("Home", lang);

//   return (
//     <main>
//       <MainPage welcomeText={welcomeText} homeLabel={homeLabel} />
//     </main>
//   );
// }
