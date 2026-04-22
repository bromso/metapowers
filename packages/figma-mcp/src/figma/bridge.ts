import { WebSocketServer, type WebSocket } from "ws";

export interface BridgeOptions {
	port?: number;
	timeout?: number;
}

interface PendingRequest {
	resolve: (value: unknown) => void;
	reject: (reason: Error) => void;
	timer: ReturnType<typeof setTimeout>;
}

export class FigmaBridge {
	private wss: WebSocketServer | null = null;
	private client: WebSocket | null = null;
	private pending = new Map<string, PendingRequest>();
	private _port: number;
	private timeout: number;
	private requestCounter = 0;

	constructor(options: BridgeOptions = {}) {
		this._port = options.port ?? 9000;
		this.timeout = options.timeout ?? 15000;
	}

	get port(): number {
		return this._port;
	}

	get isConnected(): boolean {
		return this.client !== null && this.client.readyState === 1;
	}

	async start(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.wss = new WebSocketServer({ port: this._port });
			this.wss.on("listening", () => resolve());
			this.wss.on("error", (err) => reject(err));

			this.wss.on("connection", (ws) => {
				this.client = ws;

				ws.on("message", (data) => {
					const msg = JSON.parse(data.toString());
					const pending = this.pending.get(msg.id);
					if (pending) {
						clearTimeout(pending.timer);
						this.pending.delete(msg.id);
						if (msg.error) {
							pending.reject(new Error(msg.error));
						} else {
							pending.resolve(msg.result);
						}
					}
				});

				ws.on("close", () => {
					this.client = null;
					for (const [id, pending] of this.pending) {
						clearTimeout(pending.timer);
						pending.reject(new Error("Plugin disconnected"));
						this.pending.delete(id);
					}
				});
			});
		});
	}

	async execute(code: string): Promise<unknown> {
		return this.sendCommand("EXECUTE_CODE", { code });
	}

	async sendCommand(
		method: string,
		params: Record<string, unknown> = {},
	): Promise<unknown> {
		if (!this.isConnected) {
			throw new Error(
				"No Figma plugin connected. Open Figma Desktop and run the Metapowers Bridge plugin.",
			);
		}

		const id = `req_${++this.requestCounter}`;

		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				this.pending.delete(id);
				reject(new Error(`Bridge request timed out after ${this.timeout}ms`));
			}, this.timeout);

			this.pending.set(id, { resolve, reject, timer });

			this.client!.send(JSON.stringify({ id, method, params }));
		});
	}

	async close(): Promise<void> {
		for (const [id, pending] of this.pending) {
			clearTimeout(pending.timer);
			pending.reject(new Error("Bridge closing"));
			this.pending.delete(id);
		}

		if (this.client) {
			this.client.close();
			this.client = null;
		}

		return new Promise((resolve) => {
			if (this.wss) {
				this.wss.close(() => {
					this.wss = null;
					resolve();
				});
			} else {
				resolve();
			}
		});
	}
}
