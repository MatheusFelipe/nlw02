import Knex from 'knex';

export const down = async (knex: Knex) => {
  return knex.schema.dropTableIfExists('classes');
};

export const up = async (knex: Knex) => {
  await down(knex);
  return knex.schema.createTable('classes', table => {
    table.increments('id').primary();
    table.string('subject').notNullable();
    table.decimal('cost').notNullable();
    table.integer('user_id').notNullable().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
  });
};
