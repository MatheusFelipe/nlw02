import Knex from 'knex';

export const down = async (knex: Knex) => {
  return knex.schema.dropTableIfExists('users');
};

export const up = async (knex: Knex) => {
  await down(knex);
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('avatar').notNullable();
    table.string('whatsapp').notNullable();
    table.string('bio').notNullable();
  });
};
