import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <h3 className="leading-10 text-2xl mb-10">All components</h3>

          <Link href="/draggable-images">
            <li className="underline">Draggable Images</li>
          </Link>
          <br />
          <Link href="/scroll-page">
            <li className="underline">Animated Scrolling Page</li>
          </Link>
          <br />
          <Link href="/file-upload">
            <li className="underline">File Upload</li>
          </Link>
        </ol>
      </main>
    </div>
  );
}
