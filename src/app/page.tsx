import LandingNav from "@/components/landing/nav";
import HeroSection from "@/components/landing/sections/hero-section";
import TrustedSection from "@/components/landing/sections/trusted-section";
import FeaturesSection from "@/components/landing/sections/features-section";
import ArchitectureSection from "@/components/landing/sections/architecture-section";
import LiveDemoSection from "@/components/landing/sections/live-demo-section";
import ProvidersSection from "@/components/landing/sections/providers-section";
import EnterpriseSection from "@/components/landing/sections/enterprise-section";
import MetricsSection from "@/components/landing/sections/metrics-section";
import TestimonialsSection from "@/components/landing/sections/testimonials-section";
import FAQSection from "@/components/landing/sections/faq-section";
import Footer from "@/components/landing/footer";
import { AnimatedBackground } from "@/components/landing/ui/animated-background";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <LandingNav />
      <main>
        <HeroSection />
        <TrustedSection />
        <FeaturesSection />
        <ArchitectureSection />
        <LiveDemoSection />
        <ProvidersSection />
        <EnterpriseSection />
        <MetricsSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
