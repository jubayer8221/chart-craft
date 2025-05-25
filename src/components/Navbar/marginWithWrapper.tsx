// import { ReactNode } from "react";
// import { Locale, LOCALES } from "../../../config";

// interface MarginWidthWrapperProps {
//   children: ReactNode;
//   params: { lang: string };
// }
// interface MarginWidthWrapperProps {
//   children: ReactNode;
//   params: Promise<{ lang: string }>;
// }

// export default function MarginWidthWrapper({
//   children,
//   params,
// }: {
//   children: ReactNode;
// }) {
//   const rawLang = lang || "en";
//   const locale: Locale = LOCALES.includes(rawLang as Locale)
//     ? (rawLang as Locale)
//     : "en";
//   return (
//     <div
//       className="flex flex-col md:ml-60 sm:border-r dark:border-gray-700 sm:border-zinc-700 dark:bg-gray-800 min-h-screen"
//       dir={locale === "ar" ? " md:mr-60" : "md:ml-60"}
//     >
//       {children}
//     </div>
//   );
// }

import { ReactNode } from "react";
import { Locale, LOCALES } from "../../../config";

interface MarginWidthWrapperProps {
  children: ReactNode;
  params: { lang: string };
}

export default function MarginWidthWrapper({
  children,
  params,
}: MarginWidthWrapperProps) {
  const rawLang = params?.lang || "en";

  const locale: Locale = LOCALES.includes(rawLang as Locale)
    ? (rawLang as Locale)
    : "en";

  // const dir = locale === "ar" ? "rtl" : "ltr";

  // margin-left if LTR, margin-right if RTL
  const marginClass = locale === "ar" ? "mr-[240px]" : "ml-[240px]";

  return (
    <div
      className={`flex flex-col ${marginClass} sm:border-zinc-700 dark:bg-gray-800 min-h-screen`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
}
