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
    .createTable('staffs', (table) => {
      table.bigIncrements('id', { primaryKey: true }).unsigned();
      table.string('name', 100).notNullable();
      table.string('email', 255).notNullable();
      table.dateTime('created_at').notNullable().defaultTo(knex.raw('NOW()'));
      table.dateTime('updated_at').notNullable().defaultTo(knex.raw('NOW()'));
    })
    .createTable('stocks', (table) => {
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
      table.unique(['shop_id', 'ingredient_id']);
      table.integer('quantity').notNullable();
      table.integer('unit_price').notNullable();
      table.dateTime('created_at').notNullable().defaultTo(knex.raw('NOW()'));
      table.dateTime('updated_at').notNullable().defaultTo(knex.raw('NOW()'));
    });

  await knex.schema.createTable('shops_staffs', (table) => {
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
      .bigInteger('staff_id')
      .unsigned()
      .notNullable()
      .index()
      .references('id')
      .inTable('staffs')
      .onDelete('cascade');
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('shops_staffs');
  await knex.schema.dropTable('staffs').dropTable('shops_stocks');
  await knex.schema.dropTable('shops');
}
