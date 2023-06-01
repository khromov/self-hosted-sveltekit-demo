import { query } from '$lib/server/db.js';
import { json } from '@sveltejs/kit';

export async function GET() {
    const result = await query('SELECT random()');

    return json(result.rows[0]);
}