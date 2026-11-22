import { Reveal, SplitHeading } from "../Motion";

const PRINCIPLES = [
  {
    n: "01",
    title: "Useful before impressive",
    body: "Billing registers, scattered stock counts, credit kept in notebooks, tools that don't talk to each other. These are the everyday problems we aim our engineering at.",
  },
  {
    n: "02",
    title: "Reliable by construction",
    body: "Clear data models, proper access control, and honest error handling are decisions made at the start, not patched in after something breaks.",
  },
  {
    n: "03",
    title: "Product-first thinking",
    body: "We are building our own software alongside client work. Living with a product keeps our standards grounded in how software behaves after launch.",
  },
  {
    n: "04",
    title: "Scalable on purpose",
    body: "Systems shaped so that one shop can become many, and one tool can grow into a platform, without a rewrite.",
  },
];

export function About() {
  return (
    <section id="about" className="surface-light relative isolate overflow-hidden section-y">
      <div className="tech-grid-light absolute inset-0 -z-10" aria-hidden />
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="label-mono">{"// 01 — About Codistack"}</p>
            </Reveal>
            <SplitHeading text="Built to think beyond code." className="h-section mt-5 text-deep" />
            <Reveal delay={0.15}>
              <p className="mt-7 text-lg leading-relaxed text-deep/85">
                Codistack is an independent technology brand from India, building modern digital solutions, scalable
                business software, SaaS platforms, and intelligent technologies.
              </p>
              <p className="mt-4 leading-relaxed text-deep/75">
                It exists to engineer reliable software that solves real-world business problems, starting with the
                unglamorous ones that businesses depend on every single day.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="glass-light mt-8 rounded-2xl p-5">
                <p className="label-mono">Current journey</p>
                <ol className="mt-4 space-y-3 text-sm text-deep">
                  <li className="flex gap-3"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-electric" /><span><strong>Now:</strong> custom software for clients, and building BILLINGHACKS Business OS, our first product.</span></li>
                  <li className="flex gap-3"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-electric/50" /><span><strong>Next:</strong> beta testing and refinement of BILLINGHACKS with real businesses.</span></li>
                  <li className="flex gap-3"><span className="mt-1.5 size-2 shrink-0 rounded-full border border-electric" /><span><strong>Later:</strong> broader software and AI products, once the foundation is stable.</span></li>
                </ol>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-deep/65">
                Transparency note: Codistack is an emerging brand under development and is not yet a registered company.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul className="border-t border-deep/15">
            {PRINCIPLES.map((p, i) => (
              <li key={p.n} className="border-b border-deep/15">
                <Reveal delay={i * 0.06}>
                  <div className="group grid grid-cols-[3.2rem_1fr] gap-4 py-8 sm:grid-cols-[5rem_1fr] sm:py-10">
                    <span className="font-mono text-sm tracking-widest text-electric sm:text-base">{p.n}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-deep transition-colors group-hover:text-[#0b6bbd] sm:text-3xl">{p.title}</h3>
                      <p className="mt-3 max-w-xl leading-relaxed text-deep/75">{p.body}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
