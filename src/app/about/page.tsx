import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About — Color Baddies | Free Online Adult Coloring Book",
  description:
    "Color Baddies is a free online adult coloring book featuring bold, beautiful baddie illustrations. Learn about our mission and features.",
};

export default function AboutPage() {
  return (
    <div className="min-h-full bg-[#fff0f5] px-4 py-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-pink-500 font-bold text-sm mb-6 block">
          ← Back to Color Baddies
        </Link>

        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Color Baddies Logo"
            width={180}
            height={180}
            className="object-contain"
          />
        </div>

        <h1 className="text-2xl font-black text-pink-600 mb-4 text-center">About Color Baddies</h1>

        <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
          <p>
            Color Baddies is a free online adult coloring book designed for women who love bold, beautiful art
            and a relaxing creative escape. Every coloring page features hand-curated baddie illustrations —
            from VIP nights and nail salon vibes to graffiti queens, shopping sprees, and beach days.
          </p>

          <h2 className="text-lg font-bold text-pink-600">Why We Built This</h2>
          <p>
            Coloring is one of the most effective ways to reduce stress and anxiety. Studies show that
            adult coloring activates the same relaxation response as meditation. We wanted to create a
            coloring experience that feels personal, fun, and accessible — no app download required,
            no expensive supplies, just your phone and your creativity.
          </p>

          <h2 className="text-lg font-bold text-pink-600">What Makes Us Different</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Representation matters.</strong> Our illustrations feature Black and Brown women
              in empowering, stylish, and fun scenarios. Every page is designed to celebrate and uplift.
            </li>
            <li>
              <strong>Professional-grade tools.</strong> Solid fills, gradient fills with 100+ presets
              (including skin tones, hair colors, lip shades, denim washes, and nail polish), a color
              picker, and undo/redo — all free.
            </li>
            <li>
              <strong>Works everywhere.</strong> iPhone, Android, iPad, laptop, desktop — any device
              with a browser. Add to your home screen for an app-like experience.
            </li>
            <li>
              <strong>Your progress saves automatically.</strong> Pick up where you left off anytime.
              Save finished art to your camera roll or share with friends.
            </li>
          </ul>

          <h2 className="text-lg font-bold text-pink-600">New Pages Added Regularly</h2>
          <p>
            We continuously add new coloring pages across categories like Baddie, Lifestyle, and Fashion.
            Check back often for fresh designs to color.
          </p>

          <h2 className="text-lg font-bold text-pink-600">Free Forever</h2>
          <p>
            Color Baddies is completely free to use. No account needed, no sign-up, no paywalls.
            We support the app through non-intrusive advertising. Thank you for coloring with us!
          </p>
        </div>
      </div>
    </div>
  );
}
