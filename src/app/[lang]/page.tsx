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
