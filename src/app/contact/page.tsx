import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — Color Baddies",
  description: "Get in touch with the Color Baddies team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-full bg-[#fff0f5] px-4 py-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-pink-500 font-bold text-sm mb-6 block">
          ← Back to Color Baddies
        </Link>

        <h1 className="text-2xl font-black text-pink-600 mb-6">Contact Us</h1>

        <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
          <p>
            We love hearing from our colorists! Whether you have feedback, a feature request,
            or just want to say hi, reach out anytime.
          </p>

          <div className="bg-white rounded-2xl border-2 border-pink-100 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-pink-600 mb-1">Email</h2>
              <a href="mailto:hello@colorbaddies.com" className="text-pink-500 underline font-semibold">
                hello@colorbaddies.com
              </a>
            </div>

            <div>
              <h2 className="text-base font-bold text-pink-600 mb-1">Feature Requests</h2>
              <p>
                Have an idea for a new coloring page or feature? We read every suggestion.
                Email us with &ldquo;Feature Request&rdquo; in the subject line.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-pink-600 mb-1">Bug Reports</h2>
              <p>
                Something not working right? Let us know what device and browser you&apos;re using
                and describe what happened. Screenshots help!
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-pink-600 mb-1">Business Inquiries</h2>
              <p>
                For partnerships, collaborations, or advertising inquiries, please email us
                with &ldquo;Business&rdquo; in the subject line.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-pink-400">
              Color Baddies — Free Online Adult Coloring Book
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
