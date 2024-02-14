import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('shops', (table) => {
    table.bigIncrements('id', { primaryKey: true }).unsigned();
    table.string('name', 100).notNullable();
    table.string('address', 255).notNullable();
    table.dateTime('created_at').notNullable().defaultTo(knex.raw('NOW()'));
    table.dateTime('updated_at').notNullable().defaultTo(knex.raw('NOW()'));
  });

  await knex.schema
    .createTable('staff', (table) => {
      table.bigIncrements('id', { primaryKey: true }).unsigned();
      table
        .bigInteger('shop_id')
        .unsigned()
        .notNullable()
        .index()
        .references('id')
        .inTable('shops')
        .onDelete('cascade');
      table.string('name', 100).notNullable();
      table.string('api_key', 255).notNullable();
      table.dateTime('created_at').notNullable().defaultTo(knex.raw('NOW()'));
      table.dateTime('updated_at').notNullable().defaultTo(knex.raw('NOW()'));
    })
    .createTable('shops_stocks', (table) => {
      table.bigIncrements('id', { primaryKey: true }).unsigned();
      table
        .bigInteger('shop_id')
        .unsigned()
        .notNullable()
        .index()
        .references('id')
        .inTable('shops')
        .onDelete('cascade');
      table
        .bigInteger('ingredient_id')
        .unsigned()
        .notNullable()
        .index()
        .references('id')
        .inTable('ingredients')
        .onDelete('cascade');
      table.integer('quantity').notNullable();
      table.integer('unit_price').notNullable();
      table.dateTime('created_at').notNullable().defaultTo(knex.raw('NOW()'));
      table.dateTime('updated_at').notNullable().defaultTo(knex.raw('NOW()'));
    });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('shop_stocks').dropTable('shop_staff');
  await knex.schema.dropTable('shops');
}
