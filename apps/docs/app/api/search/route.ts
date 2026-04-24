import { source } from "@/lib/source";
import { flexsearchFromSource } from "fumadocs-core/search/flexsearch";

export const dynamic = "force-static";
export const revalidate = false;

const search = flexsearchFromSource(source);

export const { staticGET: GET } = search;
