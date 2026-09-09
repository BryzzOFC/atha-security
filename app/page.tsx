import Nav from "@/components/Nav";
import HeroSection from "@/components/hero/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import ArchitectureSection from "@/components/architecture/ArchitectureSection";
import AgentsSection from "@/components/agents/AgentsSection";
import HowItWorksSection from "@/components/workflow/HowItWorksSection";
import AiBuiltSection from "@/components/sections/AiBuiltSection";
import WorkflowSection from "@/components/workflow/WorkflowSection";
import WhySection from "@/components/sections/WhySection";
import TrustSection from "@/components/sections/TrustSection";
import ProductSection from "@/components/product/ProductSection";
import AudienceSection from "@/components/sections/AudienceSection";
import PlansSection from "@/components/sections/PlansSection";
import CtaBand from "@/components/sections/CtaBand";
import FAQSection from "@/components/faq/FAQSection";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/footer/Footer";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-black"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="flex-1">
        <HeroSection />
        <ProblemSection />
        <ArchitectureSection />
        <AgentsSection />
        <HowItWorksSection />
        <AiBuiltSection />
        <WorkflowSection />
        <WhySection />
        <TrustSection />
        <ProductSection />
        <AudienceSection />
        <PlansSection />
        <CtaBand />
        <FAQSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
