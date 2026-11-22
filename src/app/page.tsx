import { Hero } from "@/components/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Products } from "@/components/sections/Products";
import { Roadmap } from "@/components/sections/Roadmap";
import { EarlyAccessBand } from "@/components/sections/EarlyAccessBand";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Products />
      <Roadmap />
      <EarlyAccessBand />
      <Contact />
      <Faq />
    </>
  );
}
