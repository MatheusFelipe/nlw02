import Knex from 'knex';

export const down = async (knex: Knex) => {
  return knex.schema.dropTableIfExists('connections');
};

export const up = async (knex: Knex) => {
  await down(knex);
  return knex.schema.createTable('connections', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
};
