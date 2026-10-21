"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once, even when HMR re-evaluates this module.
const REGISTERED = Symbol.for("metapowers.gsap.registered");
const g = globalThis as typeof globalThis & { [REGISTERED]?: boolean };
if (typeof window !== "undefined" && !g[REGISTERED]) {
	gsap.registerPlugin(ScrollTrigger, useGSAP);
	g[REGISTERED] = true;
}

export { gsap, ScrollTrigger, useGSAP };
