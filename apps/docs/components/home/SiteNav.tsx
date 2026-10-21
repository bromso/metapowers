"use client";

import { MoonIcon, SunIcon } from "@/components/ui/Icons";
import { Pill } from "@/components/ui/Pill";
import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch";
import { useTheme } from "fumadocs-ui/provider/base";
import Link from "next/link";
import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 80;

const linkClass =
	"rounded-full px-2 py-1 text-sm text-mp-ink/80 transition-colors hover:text-mp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent";

/**
 * Icon-only theme toggle for phones, where the two-icon `ThemeSwitch` does not fit. The icon
 * is chosen by CSS (`.dark`), so server and client markup match without a mounted flag.
 */
function CompactThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	return (
		<button
			type="button"
			aria-label="Toggle theme"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className="inline-flex size-8 items-center justify-center rounded-full text-mp-ink/80 hover:text-mp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent sm:hidden"
		>
			<MoonIcon className="size-4 [.dark_&]:hidden" />
			<SunIcon className="hidden size-4 [.dark_&]:block" />
		</button>
	);
}

/**
 * Site chrome for the homepage and other non-docs pages. Fixed and transparent over the
 * hero; gains a blurred ground-coloured background after 80 px of scroll.
 * Hash links are root-relative so the nav also works on pages other than `/`.
 */
export function SiteNav() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const update = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	return (
		<header
			className={[
				"fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
				scrolled
					? "border-b border-mp-ink/10 bg-mp-ground/80 backdrop-blur-md"
					: "border-b border-transparent bg-transparent",
			].join(" ")}
		>
			<nav
				aria-label="Main"
				className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:px-6"
			>
				<Link
					href="/"
					className="justify-self-start rounded-full text-base font-medium tracking-tight text-mp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent"
				>
					Metapowers
				</Link>
				<ul className="flex items-center gap-1 sm:gap-3">
					<li>
						<Link href="/docs/overview" className={linkClass}>
							Docs
						</Link>
					</li>
					<li>
						<Link href="/#domains" className={linkClass}>
							Domains
						</Link>
					</li>
					<li className="hidden sm:block">
						<a
							href="https://github.com/bromso/metapowers"
							target="_blank"
							rel="noopener noreferrer"
							className={linkClass}
						>
							GitHub
						</a>
					</li>
				</ul>
				<div className="flex items-center justify-self-end gap-1 sm:gap-2">
					<CompactThemeToggle />
					<ThemeSwitch className="hidden border-mp-ink/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent sm:inline-flex" />
					<Pill href="/#install" variant="primary" size="sm">
						Install
					</Pill>
				</div>
			</nav>
		</header>
	);
}
