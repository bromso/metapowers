const BASE_URL = "https://api.figma.com";

// ── Response types ──────────────────────────────────────────────────

export interface FigmaNode {
	id: string;
	name: string;
	type: string;
	children?: FigmaNode[];
	[key: string]: unknown;
}

export interface FigmaComponentMeta {
	key: string;
	name: string;
	description: string;
	[key: string]: unknown;
}

export interface FigmaStyleMeta {
	key: string;
	name: string;
	styleType: string;
	description: string;
	[key: string]: unknown;
}

export interface FigmaFileResponse {
	name: string;
	lastModified: string;
	editorType: string;
	thumbnailUrl: string;
	version: string;
	document: FigmaNode;
	components: Record<string, FigmaComponentMeta>;
	componentSets: Record<string, FigmaComponentMeta>;
	styles: Record<string, FigmaStyleMeta>;
}

export interface FigmaNodesResponse {
	name: string;
	lastModified: string;
	nodes: Record<string, { document: FigmaNode; components: Record<string, FigmaComponentMeta> }>;
}

export interface FigmaImagesResponse {
	err: string | null;
	images: Record<string, string>;
}

export interface FigmaVariable {
	id: string;
	name: string;
	key: string;
	variableCollectionId: string;
	resolvedType: "BOOLEAN" | "FLOAT" | "STRING" | "COLOR";
	valuesByMode: Record<string, unknown>;
	description: string;
}

export interface FigmaVariableCollection {
	id: string;
	name: string;
	key: string;
	modes: Array<{ modeId: string; name: string }>;
	defaultModeId: string;
	variableIds: string[];
}

export interface FigmaVariablesResponse {
	status: number;
	error: boolean;
	meta: {
		variables: Record<string, FigmaVariable>;
		variableCollections: Record<string, FigmaVariableCollection>;
	};
}

export interface FigmaPublishedStyle {
	key: string;
	file_key: string;
	node_id: string;
	style_type: string;
	name: string;
	description: string;
	[key: string]: unknown;
}

export interface FigmaStylesResponse {
	status: number;
	error: boolean;
	meta: {
		styles: FigmaPublishedStyle[];
	};
}

export interface FigmaPublishedComponent {
	key: string;
	file_key: string;
	node_id: string;
	name: string;
	description: string;
	[key: string]: unknown;
}

export interface FigmaComponentsResponse {
	status: number;
	error: boolean;
	meta: {
		components: FigmaPublishedComponent[];
	};
}

// ── Client ──────────────────────────────────────────────────────────

export class FigmaClient {
	private readonly token: string;

	constructor(token: string) {
		if (!token) {
			throw new Error("FIGMA_ACCESS_TOKEN is required");
		}
		this.token = token;
	}

	private async request<T>(
		path: string,
		params?: Record<string, string | number | undefined>,
	): Promise<T> {
		const url = new URL(path, BASE_URL);

		if (params) {
			for (const [key, value] of Object.entries(params)) {
				if (value !== undefined) {
					url.searchParams.set(key, String(value));
				}
			}
		}

		const response = await fetch(url.toString(), {
			headers: { "X-Figma-Token": this.token },
		});

		if (!response.ok) {
			throw new Error(
				`Figma API error: ${response.status} ${response.statusText}`,
			);
		}

		return response.json() as Promise<T>;
	}

	async getFile(
		fileKey: string,
		params?: Record<string, string | number>,
	): Promise<FigmaFileResponse> {
		return this.request<FigmaFileResponse>(`/v1/files/${fileKey}`, params);
	}

	async getNodes(
		fileKey: string,
		nodeIds: string[],
		params?: Record<string, string | number>,
	): Promise<FigmaNodesResponse> {
		return this.request<FigmaNodesResponse>(`/v1/files/${fileKey}/nodes`, {
			ids: nodeIds.join(","),
			...params,
		});
	}

	async getImages(
		fileKey: string,
		nodeIds: string[],
		options?: { format?: string; scale?: number },
	): Promise<FigmaImagesResponse> {
		return this.request<FigmaImagesResponse>(`/v1/images/${fileKey}`, {
			ids: nodeIds.join(","),
			...(options?.format ? { format: options.format } : {}),
			...(options?.scale ? { scale: options.scale } : {}),
		});
	}

	async getVariables(fileKey: string): Promise<FigmaVariablesResponse> {
		return this.request<FigmaVariablesResponse>(
			`/v1/files/${fileKey}/variables/local`,
		);
	}

	async getStyles(fileKey: string): Promise<FigmaStylesResponse> {
		return this.request<FigmaStylesResponse>(`/v1/files/${fileKey}/styles`);
	}

	async getComponents(fileKey: string): Promise<FigmaComponentsResponse> {
		return this.request<FigmaComponentsResponse>(
			`/v1/files/${fileKey}/components`,
		);
	}
}
