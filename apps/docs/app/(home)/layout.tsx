import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteNav } from "@/components/home/SiteNav";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="bg-mp-ground text-mp-ink">
			<SiteNav />
			<main>{children}</main>
			<SiteFooter />
		</div>
	);
}
