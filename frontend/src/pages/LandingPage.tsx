import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Zap,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Map,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  // Parallax Effects tracking scroll position
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Hero Section with Dynamic Animation and Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background Elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-32 left-10 md:left-32 text-primary/10"
        >
          <Zap size={150} />
        </motion.div>
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 md:right-32 text-destructive/10"
        >
          <AlertTriangle size={180} />
        </motion.div>

        <div className="z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          >
            <div className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-primary/30">
              <Zap className="w-10 h-10 text-primary-foreground" />
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Outage Management <span className="text-primary">Evolved.</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Monitor, report, and resolve service disruptions in real-time. Keep
            your users informed and your technicians on track.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="text-lg px-8 h-14 rounded-full"
              onClick={() => (window.location.href = "/login")}
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 h-14 rounded-full"
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Slide/Fade In on Scroll */}
      <section className="py-24 bg-muted/30 relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to manage outages seamlessly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Activity className="w-10 h-10 text-primary" />}
              title="Real-Time Tracking"
              description="Monitor service health instantly with live dashboards and analytics."
              delay={0.1}
            />
            <FeatureCard
              icon={<Map className="w-10 h-10 text-primary" />}
              title="Interactive Maps"
              description="Pinpoint outage locations geographically for faster resolution and routing."
              delay={0.2}
            />
            <FeatureCard
              icon={<ShieldCheck className="w-10 h-10 text-primary" />}
              title="Automated Updates"
              description="Keep customers and technicians in sync with automated notifications."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Call to Action - Scale In Transition */}
      <section className="py-32 relative overflow-hidden bg-background">
        <motion.div
          className="max-w-4xl mx-auto text-center px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to upgrade your system?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of modern teams managing their infrastructure with
            our next-generation platform.
          </p>
          <Button
            size="lg"
            className="h-14 rounded-full px-10 text-lg"
            onClick={() => (window.location.href = "/login")}
          >
            Create Free Account
          </Button>
        </motion.div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      className="bg-card text-card-foreground p-8 rounded-2xl border shadow-sm"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        y: -10,
        boxShadow:
          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        transition: { duration: 0.2 },
      }}
    >
      <div className="mb-6 bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
