"use client";

import { domainForDocsUrl } from "@/lib/domains";
import type * as PageTree from "fumadocs-core/page-tree";
import {
	SidebarFolder,
	SidebarFolderContent,
	SidebarFolderLink,
	SidebarFolderTrigger,
	SidebarItem,
	SidebarSeparator,
	useFolder,
	useFolderDepth,
} from "fumadocs-ui/components/sidebar/base";
import type { SidebarPageTreeComponents } from "fumadocs-ui/components/sidebar/page-tree";
import { useTreePath } from "fumadocs-ui/contexts/tree";
// next/navigation rather than fumadocs-core/framework: the workspace resolves two
// fumadocs-core copies, so the app's import would miss fumadocs-ui's FrameworkProvider.
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

/*
 * Page-tree overrides for the docs sidebar. They reproduce Fumadocs' default renderer
 * (layouts/docs/slots/sidebar: collapsible folders, active state, folder index links,
 * depth offsets) and only add the domain swatch and the eyebrow separators. Colours come
 * from the `#nd-sidebar` token scope in app/global.css.
 */

const itemBase =
	"relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0";
const itemLink =
	"transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors";
const itemButton =
	"transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none";
const itemHighlight =
	"data-[active=true]:before:content-[''] data-[active=true]:before:bg-fd-primary data-[active=true]:before:absolute data-[active=true]:before:w-px data-[active=true]:before:inset-y-2.5 data-[active=true]:before:inset-s-2.5";

function cx(...parts: (string | false | undefined)[]): string {
	return parts.filter(Boolean).join(" ");
}

function itemOffset(depth: number): CSSProperties {
	return { paddingInlineStart: `calc(${2 + 3 * depth} * var(--spacing))` };
}

function normalize(url: string): string {
	return url.length > 1 && url.endsWith("/") ? url.slice(0, -1) : url;
}

function isActive(href: string, pathname: string): boolean {
	return normalize(href) === normalize(pathname);
}

/** 10 px rounded square in the domain's colour token. */
export function DomainSwatch({ colour }: { colour: string }) {
	return (
		<span
			aria-hidden="true"
			data-domain-swatch=""
			className="inline-block size-2.5 shrink-0 rounded-[3px]"
			style={{ background: `var(--domain-${colour})` }}
		/>
	);
}

function folderUrl(item: PageTree.Folder): string | undefined {
	return item.index?.url ?? item.children.find((c) => c.type === "page")?.url;
}

function FolderHead({ item, label }: { item: PageTree.Folder; label: ReactNode }) {
	const folder = useFolder();
	const depth = folder?.depth ?? 1;
	const collapsible = folder?.collapsible ?? true;
	const pathname = usePathname();

	if (item.index) {
		return (
			<SidebarFolderLink
				href={item.index.url}
				external={item.index.external}
				active={isActive(item.index.url, pathname)}
				className={cx(itemBase, itemLink, depth > 1 && itemHighlight, "w-full")}
				style={itemOffset(depth - 1)}
			>
				{label}
			</SidebarFolderLink>
		);
	}
	return (
		<SidebarFolderTrigger
			className={cx(itemBase, collapsible && itemButton, "w-full")}
			style={itemOffset(depth - 1)}
		>
			{label}
		</SidebarFolderTrigger>
	);
}

function FolderBody({ children }: { children: ReactNode }) {
	const depth = useFolderDepth();
	return (
		<SidebarFolderContent
			className={cx(
				"relative",
				depth === 1 &&
					"before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-fd-border before:inset-s-2.5",
			)}
		>
			<div className="flex flex-col gap-0.5 pt-0.5">{children}</div>
		</SidebarFolderContent>
	);
}

const Folder: SidebarPageTreeComponents["Folder"] = ({ item, children }) => {
	const path = useTreePath();
	const domain = item.root ? domainForDocsUrl(folderUrl(item)) : undefined;
	const label = (
		<>
			{domain ? <DomainSwatch colour={domain.colour} /> : item.icon}
			{item.name}
		</>
	);
	return (
		<SidebarFolder
			collapsible={item.collapsible}
			active={path.includes(item)}
			defaultOpen={item.defaultOpen}
		>
			<FolderHead item={item} label={label} />
			<FolderBody>{children}</FolderBody>
		</SidebarFolder>
	);
};

const Item: SidebarPageTreeComponents["Item"] = ({ item }) => {
	const depth = useFolderDepth();
	const pathname = usePathname();
	return (
		<SidebarItem
			href={item.url}
			external={item.external}
			active={isActive(item.url, pathname)}
			icon={item.icon}
			className={cx(itemBase, itemLink, depth >= 1 && itemHighlight)}
			style={itemOffset(depth)}
		>
			{item.name}
		</SidebarItem>
	);
};

const Separator: SidebarPageTreeComponents["Separator"] = ({ item }) => {
	const depth = useFolderDepth();
	return (
		<SidebarSeparator
			className={cx(
				"mp-eyebrow inline-flex items-center gap-2 mb-1 px-2 mt-6 empty:mb-0 [&_svg]:size-4 [&_svg]:shrink-0",
				depth === 0 && "first:mt-0",
			)}
			style={itemOffset(depth)}
		>
			{item.icon}
			{item.name}
		</SidebarSeparator>
	);
};

export const sidebarComponents: Partial<SidebarPageTreeComponents> = { Folder, Item, Separator };
