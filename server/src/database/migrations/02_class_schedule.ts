import Knex from 'knex';

export const down = async (knex: Knex) => {
  return knex.schema.dropTableIfExists('class_schedule');
};

export const up = async (knex: Knex) => {
  await down(knex);
  return knex.schema.createTable('class_schedule', table => {
    table.increments('id').primary();
    table.integer('week_day').notNullable();
    table.integer('from').notNullable();
    table.integer('to').notNullable();
    table.integer('class_id').notNullable().references('id').inTable('classes').onUpdate('CASCADE').onDelete('CASCADE');
  });
};
