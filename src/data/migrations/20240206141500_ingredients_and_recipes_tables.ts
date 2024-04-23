import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema
    .createTable('ingredients', (table) => {
      table.bigIncrements('id', { primaryKey: true }).unsigned();
      table.string('name', 100).notNullable();
      table.unique('name');
    })
    .createTable('recipes', (table) => {
      table.bigIncrements('id', { primaryKey: true }).unsigned();
      table.string('name', 100).notNullable();
      table.tinyint('nb_people').unsigned().notNullable();
    });
  await knex.schema
    .createTable('steps', (table) => {
      table.bigIncrements('id', { primaryKey: true }).unsigned();
      table
        .bigInteger('recipe_id')
        .unsigned()
        .notNullable()
        .index()
        .references('id')
        .inTable('recipes')
        .onDelete('cascade');
      table.tinyint('ranking').unsigned().notNullable();
      table.text('text').notNullable();
      table.unique(['recipe_id', 'ranking']);
    })
    .createTable('recipes_ingredients', (table) => {
      table.bigIncrements('id', { primaryKey: true }).unsigned();
      table
        .bigInteger('recipe_id')
        .unsigned()
        .notNullable()
        .index()
        .references('id')
        .inTable('recipes')
        .onDelete('cascade');
      table
        .bigInteger('ingredient_id')
        .unsigned()
        .nullable()
        .defaultTo(null)
        .index()
        .references('id')
        .inTable('ingredients')
        .onDelete('set null');
      table.string('quantity').notNullable();
      table.unique(['recipe_id', 'ingredient_id']);
    });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('recipes_ingredients').dropTable('steps');
  await knex.schema.dropTable('ingredients').dropTable('recipes');
}
