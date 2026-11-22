import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80svh] place-items-center px-6 pb-20 pt-40 text-center">
      <div>
        <p className="label-mono">Error 404</p>
        <h1 className="mt-4 text-5xl font-bold uppercase text-white sm:text-7xl">Signal lost.</h1>
        <p className="mx-auto mt-4 max-w-md text-slate-300">That page doesn&apos;t exist, or it has moved.</p>
        <Link href="/" className="btn btn-primary mt-8">Back to Codistack</Link>
      </div>
    </section>
  );
}
