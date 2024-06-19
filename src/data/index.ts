import Knex from 'knex';
import config from './knexfile';

type Env = 'local' | 'development' | 'production' | 'test';

const knex = Knex(config[(process.env.NODE_ENV as Env) || 'production']);

export async function initDb() {
  await knex.migrate.latest().catch((err) => {
    console.error(err);
    throw err;
  });
}

export default knex;
