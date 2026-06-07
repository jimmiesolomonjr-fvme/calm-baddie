import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Color Baddies",
  description: "Privacy policy for Color Baddies adult coloring book app.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-full bg-[#fff0f5] px-4 py-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-pink-500 font-bold text-sm mb-6 block">
          ← Back to Color Baddies
        </Link>

        <h1 className="text-2xl font-black text-pink-600 mb-6">Privacy Policy</h1>
        <p className="text-sm text-pink-400 mb-4">Last updated: June 1, 2026</p>

        <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-pink-600 mb-2">Introduction</h2>
            <p>
              Color Baddies (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the website colorbaddies.com.
              This Privacy Policy explains how we collect, use, and protect information when you use our free online
              coloring book application.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-pink-600 mb-2">Information We Collect</h2>
            <p className="mb-2">
              <strong>Local Storage Data:</strong> Your coloring progress is saved locally on your device using
              browser localStorage. This data never leaves your device and is not transmitted to our servers.
            </p>
            <p className="mb-2">
              <strong>Analytics Data:</strong> We use Vercel Analytics to collect anonymous usage data such as page
              views, device type, and browser information. This data is aggregated and cannot be used to identify
              individual users.
            </p>
            <p>
              <strong>Advertising Data:</strong> We use Google AdSense to display advertisements. Google may use
              cookies and similar technologies to serve ads based on your prior visits to our website or other
              websites. You can opt out of personalized advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" className="text-pink-500 underline" target="_blank" rel="noopener noreferrer">
                Google&apos;s Ad Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-pink-600 mb-2">How We Use Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To save and restore your coloring progress on your device</li>
              <li>To understand how our app is used and improve the experience</li>
              <li>To display relevant advertisements that support our free service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-pink-600 mb-2">Cookies</h2>
            <p>
              Our site uses cookies for analytics and advertising purposes. Third-party vendors, including Google,
              use cookies to serve ads based on your prior visits. You can manage cookie preferences in your browser
              settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-pink-600 mb-2">Third-Party Services</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Google AdSense</strong> — advertising platform</li>
              <li><strong>Vercel Analytics</strong> — anonymous website analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-pink-600 mb-2">Children&apos;s Privacy</h2>
            <p>
              Color Baddies is intended for adult users (18+). We do not knowingly collect information from
              children under 13. If you believe a child has provided us with personal information, please
              contact us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-pink-600 mb-2">Data Retention</h2>
            <p>
              All coloring data is stored locally on your device. You can clear this data at any time by
              clearing your browser&apos;s localStorage or using the Clear All button within the app.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-pink-600 mb-2">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page
              with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-pink-600 mb-2">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please visit our{" "}
              <Link href="/contact" className="text-pink-500 underline">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
