import React from "react";
import Link from "next/link";
import {
  FaQuestionCircle,
  FaBook,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";

const HelpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-[#312c4a] to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Chart Crafter Help Center
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Find answers to your questions, explore guides, or get in touch with
            our support team.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Links */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="#faq"
              className="group bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <FaQuestionCircle className="text-4xl text-[#312c4a] mb-4 group-hover:text-blue-900" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">FAQs</h3>
              <p className="text-gray-600">
                Get answers to common questions about Chart Crafter.
              </p>
            </Link>
            <Link
              href="#guides"
              className="group bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <FaBook className="text-4xl text-[#312c4a] mb-4 group-hover:text-blue-900" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                User Guides
              </h3>
              <p className="text-gray-600">
                Explore step-by-step tutorials to master Chart Crafter.
              </p>
            </Link>
            <Link
              href="#contact"
              className="group bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <FaEnvelope className="text-4xl text-[#312c4a] mb-4 group-hover:text-blue-900" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Contact Support
              </h3>
              <p className="text-gray-600">
                Reach out to our team for personalized assistance.
              </p>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How do I create a new chart?
              </h3>
              <p className="text-gray-600">
                To create a new chart, navigate to the dashboard, click New
                Chart, select your chart type, and input your data. Follow the
                on-screen prompts to customize and save.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Can I export my charts?
              </h3>
              <p className="text-gray-600">
                Yes! Chart Crafter supports exporting charts in PNG, SVG, and
                PDF formats. Click the &quot;Export&quot; button on your chart
                page to download.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How do I share my charts?
              </h3>
              <p className="text-gray-600">
                You can share charts via a unique link or embed them on your
                website. Go to the &quot;Share&quot; option in the chart editor
                to generate a link or embed code.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="inline-flex items-center text-[#312c4a] hover:text-blue-900 font-semibold"
            >
              View All FAQs <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </section>

        {/* User Guides Section */}
        <section id="guides" className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">
            User Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Getting Started with Chart Crafter
              </h3>
              <p className="text-gray-600 mb-4">
                Learn the basics of creating and customizing charts with our
                beginner-friendly guide.
              </p>
              <Link
                href="/guides/getting-started"
                className="text-[#312c4a] hover:text-blue-900 font-semibold"
              >
                Read Guide <FaArrowRight className="inline ml-2" />
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Advanced Chart Customization
              </h3>
              <p className="text-gray-600 mb-4">
                Dive into advanced features like animations, custom themes, and
                interactive elements.
              </p>
              <Link
                href="/guides/advanced-customization"
                className="text-[#312c4a] hover:text-blue-900 font-semibold"
              >
                Read Guide <FaArrowRight className="inline ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Support Section */}
        <section id="contact" className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Contact Support
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <p className="text-gray-600 mb-6 text-center">
              Need help? Our support team is here to assist you. Reach out via
              email or check our community forums.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="mailto:support@chartcrafter.com"
                className="inline-flex items-center bg-[#312c4a] text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
              >
                <FaEnvelope className="mr-2" /> Email Support
              </a>
              <Link
                href="/community"
                className="inline-flex items-center bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Join Community
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Chart Crafter. All rights reserved.
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpPage;
