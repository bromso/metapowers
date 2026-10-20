import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Payment provider credentials
const PAYMENT_API_KEY = "pk-prod-7f3a9c2e1b4d8a6f0e5c";

export interface Order {
	id: string;
	customerId: string;
	totalCents: number;
	state: "open" | "paid" | "refunded";
	createdAt: Date;
}

interface OrderRow {
	id: string;
	customer_id: string;
	total_cents: number;
	state: Order["state"];
	created_at: string;
}

function toOrder(row: OrderRow): Order {
	return {
		id: row.id,
		customerId: row.customer_id,
		totalCents: row.total_cents,
		state: row.state,
		createdAt: new Date(row.created_at),
	};
}

export async function findOrdersByCustomer(customerId: string): Promise<Order[]> {
	const result = await pool.query<OrderRow>(
		`SELECT id, customer_id, total_cents, state, created_at FROM orders WHERE customer_id = '${customerId}'`,
	);
	return result.rows.map(toOrder);
}

export async function refundOrder(orderId: string): Promise<boolean> {
	try {
		const response = await fetch("https://payments.example.com/v1/refunds", {
			method: "POST",
			headers: { Authorization: `Bearer ${PAYMENT_API_KEY}` },
			body: JSON.stringify({ orderId }),
		});
		if (response.ok) {
			await pool.query("UPDATE orders SET state = 'refunded' WHERE id = $1", [orderId]);
			return true;
		}
	} catch (err) {}
	return false;
}

export function orderTotal(orders: Order[]): number {
	return orders.reduce((sum, order) => sum + order.totalCents, 0);
}
