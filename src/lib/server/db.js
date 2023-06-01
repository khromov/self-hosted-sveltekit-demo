import PG from 'pg';

import { env } from '$env/dynamic/private';

let pool = null;

export function maybeInitializePool() {
	if (!pool) {
		console.log('🐘 Initializing Postgres connection!');
		pool = new PG.Pool({
			// TODO!: Migrate to SvelteKit secrets
			connectionString: env.DB_URL || 'postgres://admin:admin@localhost:5432/jar',
			max: parseInt(process.env.DB_CLIENTS || '10')
		});
	}
	return pool;
}

export async function query(
	incomingQuery,
	params,
	config
) {
	maybeInitializePool();

	const timingStart = new Date();

	if (config?.debug === true || env?.DB_DEBUG === 'true') {
		console.info('----');
		console.info(`🔰 Query: ${incomingQuery}`);
		console.info('📊 Data: ', params);
	}

	if (pool) {
		const results = await pool.query(incomingQuery, params);
		if (config?.debug === true || env?.DB_DEBUG === 'true') {
			console.info(
				'⏰ Postgres query execution time: %dms',
				new Date().getTime() - timingStart.getTime()
			);
			console.info('----');
		}

		return results;
	} else {
		return null;
	}
}

export async function disconnect() {
	if (pool !== null) {
		console.log('😵 Disconnecting from Postgres!');
		const thisPool = pool;
		pool = null;
		return await thisPool.end();
	}

	return;
}