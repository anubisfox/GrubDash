const dishes = require("../../data/dishes-data");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex.raw("TRUNCATE TABLE dishes RESTART IDENTITY CASCADE").then(function () {
    // Inserts seed entries
    return knex("dishes").insert(dishes);
  });
};