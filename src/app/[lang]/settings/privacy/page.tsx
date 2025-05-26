"use client";
import React, { useState } from "react";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: "info-we-collect",
    title: "1. Information We Collect",
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2">
          a. Personal Information
        </h3>
        <p>
          We collect personal information you provide directly to us when you:
        </p>
        <ul className="list-disc list-inside ml-5 mb-2">
          <li>Register or create an account</li>
          <li>Use the Chart Crafter Dashboard services</li>
          <li>Communicate with our support team</li>
        </ul>
        <p>
          Examples include your name, email address, company name, and payment
          details.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">b. Usage Data</h3>
        <p>
          We automatically collect data about your interactions with the
          dashboard, including:
        </p>
        <ul className="list-disc list-inside ml-5 mb-2">
          <li>IP address</li>
          <li>Device and browser information</li>
          <li>Pages visited and time spent</li>
          <li>Features used and actions taken</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">
          c. Cookies and Tracking Technologies
        </h3>
        <p>
          We use cookies and similar tracking technologies to improve user
          experience and analyze usage patterns.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: (
      <>
        <p>We use the information collected to:</p>
        <ul className="list-disc list-inside ml-5">
          <li>
            Provide, maintain, and improve Chart Crafter Dashboard services
          </li>
          <li>Manage your account and provide customer support</li>
          <li>
            Communicate important updates, marketing, and promotional materials
            (with your consent)
          </li>
          <li>Analyze usage to optimize performance and security</li>
          <li>Comply with legal obligations</li>
        </ul>
      </>
    ),
  },
  {
    id: "data-sharing",
    title: "3. Data Sharing and Disclosure",
    content: (
      <>
        <p>
          We do <strong>not</strong> sell or rent your personal information to
          third parties. We may share your data with:
        </p>
        <ul className="list-disc list-inside ml-5">
          <li>
            Trusted service providers who support our operations under strict
            confidentiality agreements
          </li>
          <li>
            Legal authorities if required by law or to protect rights and safety
          </li>
          <li>
            Business partners for analytics or integrations with your consent
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "data-security",
    title: "4. Data Security",
    content: (
      <p>
        We implement industry-standard security measures including encryption,
        secure servers, and access controls to protect your information from
        unauthorized access, alteration, or disclosure.
      </p>
    ),
  },
  {
    id: "rights-choices",
    title: "5. Your Rights and Choices",
    content: (
      <>
        <p>Depending on your location, you may have rights to:</p>
        <ul className="list-disc list-inside ml-5 mb-2">
          <li>Access, correct, or delete your personal data</li>
          <li>Object to or restrict certain processing activities</li>
          <li>Withdraw consent for marketing communications at any time</li>
          <li>Request data portability</li>
        </ul>
        <p>
          To exercise these rights, please contact us at{" "}
          <a
            href="mailto:privacy@chartcrafter.com"
            className="text-blue-600 underline hover:text-blue-800"
          >
            privacy@chartcrafter.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "6. Data Retention",
    content: (
      <p>
        We retain your personal information as long as your account is active or
        as needed to provide you services, comply with legal obligations,
        resolve disputes, and enforce agreements.
      </p>
    ),
  },
  {
    id: "international-transfers",
    title: "7. International Transfers",
    content: (
      <p>
        Chart Crafter may transfer your data to servers and partners located
        outside your country. We ensure appropriate safeguards are in place to
        protect your information.
      </p>
    ),
  },
  {
    id: "childrens-privacy",
    title: "8. Children’s Privacy",
    content: (
      <p>
        Chart Crafter Dashboard is not intended for individuals under 13 years
        old. We do not knowingly collect personal information from children.
      </p>
    ),
  },
  {
    id: "policy-changes",
    title: "9. Changes to This Privacy Policy",
    content: (
      <p>
        We may update this policy from time to time. We will notify you of any
        material changes by posting the new policy on the dashboard and updating
        the effective date.
      </p>
    ),
  },
  {
    id: "contact-us",
    title: "10. Contact Us",
    content: (
      <>
        <p>
          If you have questions or concerns about this Privacy Policy, please
          contact:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:privacy@chartcrafter.com"
            className="text-blue-600 underline hover:text-blue-800"
          >
            privacy@chartcrafter.com
          </a>
        </p>
        <p>
          <strong>Address:</strong> 123 Chart Crafter Blvd, Suite 400, City,
          Country
        </p>
      </>
    ),
  },
];

const PrivacyPolicy: React.FC = () => {
  const [effectiveDate, setEffectiveDate] = useState<string>("");
  const version = "v1.0";

  React.useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setEffectiveDate(formattedDate);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#312c4a] text-gray-900 dark:text-gray-100 py-12 px-4">
      <header className="max-w-7xl mx-auto mb-4">
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Chart Crafter Dashboard
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Effective Date:{" "}
          <time dateTime={effectiveDate}>{effectiveDate || "..."}</time> |
          Version: {version}
        </p>
        <section className="mt-4 max-w-3xl prose prose-indigo dark:prose-invert">
          <p>
            Welcome to Chart Crafter! Your privacy is important to us. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our dashboard platform (“Chart
            Crafter”). Please read this policy carefully to understand our views
            and practices regarding your personal data.
          </p>
        </section>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-2">
        {/* Main content cards */}
        <article className="space-y-5">
          {sections.map(({ id, title, content }) => (
            <section
              id={id}
              key={id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 prose prose-indigo dark:prose-invert max-w-none"
            >
              <h2 className="text-3xl font-bold mb-2">{title}</h2>
              <div>{content}</div>
            </section>
          ))}
        </article>

        {/* Sidebar / Contents */}
        <nav className="sticky top-24 hidden lg:flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h2 className="text-2xl font-extrabold mb-6 border-b border-gray-300 dark:border-gray-700 pb-3">
            Contents
          </h2>
          <ul className="flex flex-col gap-3 text-sm font-medium">
            {sections.map(({ id, title }) => (
              <li key={id}>
                <button
                  onClick={() => scrollToSection(id)}
                  className="text-left w-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:underline"
                >
                  {title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
