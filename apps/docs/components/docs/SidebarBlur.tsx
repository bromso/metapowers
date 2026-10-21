"use client";

import GradualBlur from "@/components/motion/GradualBlur";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Mount {
	/** Radix ScrollArea root: positioned, non-scrolling, sized to the visible viewport. */
	host: HTMLElement;
	/** Radix ScrollArea viewport: the element that actually scrolls the tree. */
	viewport: HTMLElement;
}

/**
 * Fades the bottom edge of the sidebar tree into blur.
 *
 * Fumadocs exposes no slot inside the sidebar's scroll viewport, so this is rendered from
 * `sidebar.footer` (which Fumadocs places in both `#nd-sidebar` and `#nd-sidebar-mobile`) as a
 * hidden anchor. After mount it finds its own `aside`, takes the Radix viewport
 * (`[data-radix-scroll-area-viewport]`) and portals the blur into that viewport's ScrollArea root,
 * which Radix positions `relative`. The blur therefore sits over the visible bottom edge of the
 * tree, directly above the footer, and does not scroll with it.
 *
 * `autoHide` watches the viewport through `container`: the blur reveals only while there is tree
 * left below the fold, so it is invisible on short trees and fades out at the scroll end.
 */
export function SidebarBlur() {
	const anchorRef = useRef<HTMLSpanElement>(null);
	const [mount, setMount] = useState<Mount | null>(null);

	useEffect(() => {
		const viewport = anchorRef.current
			?.closest("aside")
			?.querySelector<HTMLElement>("[data-radix-scroll-area-viewport]");
		const host = viewport?.parentElement;
		if (viewport && host) setMount({ host, viewport });
	}, []);

	return (
		<>
			<span ref={anchorRef} hidden />
			{mount &&
				createPortal(
					<GradualBlur
						position="bottom"
						target="parent"
						container={mount.viewport}
						height="56px"
						strength={1.5}
						layers={4}
						curve="bezier"
						autoHide
						tint="var(--mp-sidebar-bg)"
						zIndex={1}
					/>,
					mount.host,
				)}
		</>
	);
}
