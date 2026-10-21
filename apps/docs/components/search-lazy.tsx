"use client";

import type { SharedProps } from "fumadocs-ui/contexts/search";
import dynamic from "next/dynamic";

/**
 * The search dialog (Fumadocs dialog + flexsearch client) only matters once a reader opens
 * it, so it is split out of the first-load JS. The chunk loads after hydration.
 */
const SearchDialog = dynamic<SharedProps>(() => import("@/components/search"), { ssr: false });

export default SearchDialog;
