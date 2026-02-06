import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import type { FormEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../lightswind/card";
import { Button } from "../lightswind/button";
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { ConfettiOptions } from "../lightswind/confetti-button";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

// Global declaration for confetti
declare global {
  interface Window {
    confetti?: (options?: ConfettiOptions) => void;
  }
}

// Performance tiers for device optimization
const PERFORMANCE_TIERS = {
  LOW: "low",
  MID: "mid",
  HIGH: "high",
} as const;

// Device performance detection (optimized for low-end devices)
const detectDevicePerformance =
  (): (typeof PERFORMANCE_TIERS)[keyof typeof PERFORMANCE_TIERS] => {
    if (typeof window === "undefined") return PERFORMANCE_TIERS.MID;

    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 2;

    // Check device memory (if available)
    const memory = (navigator as any).deviceMemory || 4;

    // Check if it's a mobile device
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // Low-end: mobile with <= 2 cores or <= 2GB RAM
    if (isMobileDevice && (cores <= 2 || memory <= 2)) {
      return PERFORMANCE_TIERS.LOW;
    }

    // Mid-range: 2-4 cores or 2-4GB RAM, or mobile with more resources
    if (cores <= 4 || memory <= 4 || isMobileDevice) {
      return PERFORMANCE_TIERS.MID;
    }

    // High-end: > 4 cores and > 4GB RAM
    return PERFORMANCE_TIERS.HIGH;
  };

// Extract className strings to constants
const CONTAINER_CLASSES =
  "text-foreground max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 md:py-20 min-h-screen flex flex-col justify-center";
const HEADING_CONTAINER_CLASSES = "text-center mb-6 sm:mb-8";
const HEADER_CLASSES =
  "mb-2 sm:mb-3 flex items-baseline justify-center gap-2 sm:gap-4";
const ICON_CLASSES =
  "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary flex-shrink-0 mt-1 md:mt-1.5 lg:mt-2";

// const SUBTITLE_REVEAL_PROPS = {
//   size: "sm" as const,
//   align: "center" as const,
//   variant: "muted" as const,
//   baseRotation: 0,
//   containerClassName: "px-2 sm:px-0",
// } as const;

// Initial form data constant
const INITIAL_FORM_DATA = {
  name: "",
  email: "",
  company: "",
  subject: "",
  message: "",
} as const;

const ContactSectionComponent = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Device performance detection (memoized, only runs once)
  const devicePerformance = useMemo(() => detectDevicePerformance(), []);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );
  }, []);

  // Determine if confetti should be enabled
  const shouldEnableConfetti = useMemo(() => {
    // Disable confetti on low-end devices or if reduced motion is preferred
    return devicePerformance !== PERFORMANCE_TIERS.LOW && !prefersReducedMotion;
  }, [devicePerformance, prefersReducedMotion]);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [confettiLoaded, setConfettiLoaded] = useState(false);

  // Load confetti script dynamically (only if enabled)
  useEffect(() => {
    if (!shouldEnableConfetti) {
      return;
    }

    if (!window.confetti) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js";
      script.async = true;
      script.onload = () => setConfettiLoaded(true);
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } else {
      setConfettiLoaded(true);
    }
  }, [shouldEnableConfetti]);

  // Trigger confetti on successful submission (optimized for device performance)
  useEffect(() => {
    if (
      shouldEnableConfetti &&
      confettiLoaded &&
      submitStatus.type === "success" &&
      window.confetti
    ) {
      // Reduce particle count based on device performance
      const particleCount =
        devicePerformance === PERFORMANCE_TIERS.LOW
          ? 50
          : devicePerformance === PERFORMANCE_TIERS.MID
          ? 250
          : 350;

      // Trigger confetti from the center of the screen
      window.confetti({
        particleCount,
        spread: devicePerformance === PERFORMANCE_TIERS.LOW ? 1500 : 2000,
        origin: { x: 0.5, y: 0.5 },
        zIndex: 99999,
      });
    }
  }, [
    shouldEnableConfetti,
    confettiLoaded,
    submitStatus.type,
    devicePerformance,
  ]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus({ type: null, message: "" });

      try {
        // Dynamically import EmailJS
        const emailjs = (await import("@emailjs/browser")).default;

        // Get environment variables
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

        if (!publicKey || !serviceId || !templateId) {
          throw new Error(
            "EmailJS configuration is missing. Please check your environment variables."
          );
        }

        // Initialize EmailJS with your public key
        emailjs.init(publicKey);

        // Prepare template parameters
        const now = new Date();
        const formattedTime = now.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        });

        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          name: formData.name, // Alias for template compatibility
          email: formData.email, // Alias for template compatibility
          company: formData.company || "Not specified",
          subject: formData.subject,
          message: formData.message,
          time: formattedTime,
          to_email: "tdeomare1@gmail.com",
        };

        // Send email using EmailJS
        const result = await emailjs.send(
          serviceId,
          templateId,
          templateParams
        );

        if (result.status === 200 || result.text === "OK") {
          setSubmitStatus({
            type: "success",
            message:
              "Thank you! Your message has been sent successfully. I'll get back to you soon.",
          });
          // Reset form
          setFormData(INITIAL_FORM_DATA);
        }
      } catch (error: any) {
        console.error("Email sending failed:", error);
        setSubmitStatus({
          type: "error",
          message:
            error.text ||
            "Failed to send message. Please try again or contact me directly at tdeomare1@gmail.com",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  // Optimize card backdrop blur based on device performance
  const cardBackdropBlur = useMemo(() => {
    if (devicePerformance === PERFORMANCE_TIERS.LOW) {
      return "backdrop-blur-0"; // Remove blur on low-end devices
    }
    return "backdrop-blur-xl";
  }, [devicePerformance]);

  // ─────────────────────────────────────────────────────────────────────────────
  // GSAP SCROLL-TRIGGERED ANIMATIONS
  // ─────────────────────────────────────────────────────────────────────────────
  useGSAP(
    () => {
      const section = sectionRef.current;
      const icon = iconRef.current;
      const heading = headingRef.current;
      if (!section || !icon || !heading) return;

      const mm = gsap.matchMedia();

      // ═══════════════════════════════════════════════════════════════════════
      // DESKTOP — Premium cinematic entrance
      // ═══════════════════════════════════════════════════════════════════════
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          // ─── PHASE 1: Mail Icon — Envelope fly-in with bounce ───
          gsap.set(icon, {
            scale: 0,
            rotation: -180,
            y: -60,
            opacity: 0,
            filter: "blur(20px) brightness(2)",
          });

          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            y: 0,
            opacity: 1,
            filter: "blur(0px) brightness(1)",
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play reverse play reverse",
            },
          });

          // ─── PHASE 2: Heading — SplitText chars cascade with 3D perspective ───
          const headingSplit = new SplitText(heading, {
            type: "chars",
            mask: "chars",
          });

          gsap.set(headingSplit.chars, {
            opacity: 0,
            y: 80,
            rotateX: -90,
            transformPerspective: 1000,
            transformOrigin: "center bottom",
            filter: "blur(10px)",
          });

          gsap.to(headingSplit.chars, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "back.out(1.7)",
            stagger: {
              each: 0.04,
              from: "start",
            },
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              toggleActions: "play reverse play reverse",
            },
          });

          // ─── PHASE 3: Subtitle — Blur-to-focus with letterSpacing ───
          const subtitle = section.querySelector<HTMLElement>(".contact-subtitle");
          if (subtitle) {
            gsap.set(subtitle, {
              opacity: 0,
              y: 30,
              filter: "blur(15px)",
              letterSpacing: "0.3em",
            });

            gsap.to(subtitle, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              letterSpacing: "0em",
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 68%",
                toggleActions: "play reverse play reverse",
              },
            });
          }

          // ─── PHASE 4: Card — 3D perspective lift with elegant entrance ───
          const card = section.querySelector<HTMLElement>(".contact-card");
          if (card) {
            gsap.set(card, {
              opacity: 0,
              y: 100,
              scale: 0.85,
              rotateX: 25,
              transformPerspective: 1200,
              transformOrigin: "center top",
              filter: "blur(12px)",
            });

            gsap.to(card, {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              filter: "blur(0px)",
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 65%",
                toggleActions: "play reverse play reverse",
              },
            });
          }

          // ─── PHASE 5: Form fields — Staggered reveal with slide-up ───
          const formFields = section.querySelectorAll<HTMLElement>(".contact-form-field");
          if (formFields.length > 0) {
            gsap.set(formFields, {
              opacity: 0,
              y: 40,
              filter: "blur(8px)",
            });

            gsap.to(formFields, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: section,
                start: "top 55%",
                toggleActions: "play reverse play reverse",
              },
            });
          }

          // ─── PHASE 6: Submit button — Dramatic scale bounce ───
          const submitBtn = section.querySelector<HTMLElement>(".contact-submit-btn");
          if (submitBtn) {
            gsap.set(submitBtn, {
              opacity: 0,
              scale: 0.5,
              y: 30,
            });

            gsap.to(submitBtn, {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.8,
              ease: "elastic.out(1, 0.6)",
              scrollTrigger: {
                trigger: section,
                start: "top 45%",
                toggleActions: "play reverse play reverse",
              },
            });
          }
        }
      );

      // ═══════════════════════════════════════════════════════════════════════
      // MOBILE — Simplified, performant entrance
      // ═══════════════════════════════════════════════════════════════════════
      mm.add("(max-width: 767px)", () => {
        // Icon simple fade-in
        gsap.set(icon, { opacity: 0, scale: 0.8, y: -20 });
        gsap.to(icon, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        });

        // Heading simple reveal
        gsap.set(heading, { opacity: 0, y: 30 });
        gsap.to(heading, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            toggleActions: "play reverse play reverse",
          },
        });

        // Subtitle
        const subtitle = section.querySelector<HTMLElement>(".contact-subtitle");
        if (subtitle) {
          gsap.set(subtitle, { opacity: 0, y: 20 });
          gsap.to(subtitle, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play reverse play reverse",
            },
          });
        }

        // Card
        const card = section.querySelector<HTMLElement>(".contact-card");
        if (card) {
          gsap.set(card, { opacity: 0, y: 40 });
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play reverse play reverse",
            },
          });
        }
      });

      // ═══════════════════════════════════════════════════════════════════════
      // REDUCED MOTION — Instant visibility
      // ═══════════════════════════════════════════════════════════════════════
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([icon, heading], { opacity: 1, clearProps: "all" });
        const subtitle = section.querySelector<HTMLElement>(".contact-subtitle");
        const card = section.querySelector<HTMLElement>(".contact-card");
        if (subtitle) gsap.set(subtitle, { opacity: 1, clearProps: "all" });
        if (card) gsap.set(card, { opacity: 1, clearProps: "all" });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`${CONTAINER_CLASSES} transform-gpu will-change-transform`}
    >
      <div className={`${HEADING_CONTAINER_CLASSES} contact-header`}>
        <div className={HEADER_CLASSES}>
          <div ref={iconRef} className="inline-flex">
            <Mail className={ICON_CLASSES} />
          </div>
          <h2
            ref={headingRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Get In Touch
          </h2>
        </div>
        <p className="text-lg font-bold contact-subtitle">
          Have a project in mind or want to discuss opportunities? I'd love to
          hear from you!
        </p>
      </div>

      <Card className={`${cardBackdropBlur} bg-background/80 border-2 w-full contact-card`}>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">Contact Me</CardTitle>
          <CardDescription className="text-xs sm:text-sm mt-2">
            Fill out the form below and I'll get back to you as soon as
            possible.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4">
              <div className="contact-form-field">
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Your Name"
                />
              </div>

              <div className="contact-form-field">
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="contact-form-field">
              <label
                htmlFor="company"
                className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2"
              >
                Company / Organization
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Company Name (Optional)"
              />
            </div>

            <div className="contact-form-field">
              <label
                htmlFor="subject"
                className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2"
              >
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="What's this about?"
              />
            </div>

            <div className="contact-form-field">
              <label
                htmlFor="message"
                className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder="Tell me about your project, opportunity, or just say hello..."
              />
            </div>

            {submitStatus.type && (
              <div
                className={`p-3 sm:p-4 rounded-lg flex items-start gap-2 sm:gap-3 ${
                  submitStatus.type === "success"
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                }`}
              >
                {submitStatus.type === "success" ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <p
                  className={`text-xs sm:text-sm ${
                    submitStatus.type === "success"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {submitStatus.message}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto min-w-[150px] text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 contact-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

// Memoize component to prevent unnecessary re-renders
export const ContactSection = memo(ContactSectionComponent);
