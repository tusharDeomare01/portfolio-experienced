/**
 * Central GSAP Configuration
 *
 * All GSAP imports should come from this file to ensure plugins
 * are registered once and defaults are consistent.
 *
 * Premium plugins (SplitText, Flip, CustomEase) are now free
 * after Webflow's acquisition of GSAP.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

// Register all plugins once
gsap.registerPlugin(
  ScrollTrigger,
  Observer,
  Flip,
  SplitText,
  CustomEase,
  ScrollToPlugin,
  useGSAP
);

// ─── Custom Eases ───────────────────────────────────────────────────────────
// Inspired by award-winning sites (Apple, Linear, Locomotive)
CustomEase.create("smooth.out", "0.16, 1, 0.3, 1");
CustomEase.create("smooth.inOut", "0.83, 0, 0.17, 1");
CustomEase.create("reveal", "0.77, 0, 0.175, 1");
CustomEase.create("spring", "0.34, 1.56, 0.64, 1");

// Global defaults — scrub-first philosophy
gsap.defaults({
  duration: 0.8,
  ease: "smooth.out",
});

// Global config
gsap.config({
  force3D: true,
  nullTargetWarn: false,
});

// ScrollTrigger defaults for consistent behavior
ScrollTrigger.defaults({
  toggleActions: "play none none reverse",
});

export { gsap, ScrollTrigger, Observer, Flip, SplitText, CustomEase, ScrollToPlugin, useGSAP };
