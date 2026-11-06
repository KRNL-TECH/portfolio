import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Navbar from "@/components//Navbar";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Work />
      <About />
      <Contact />
       <Navbar />
    </main>
  );
}