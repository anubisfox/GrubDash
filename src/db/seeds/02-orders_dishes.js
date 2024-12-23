const orders_dishes = require("../../data/orders-dishes-data");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex.raw("TRUNCATE TABLE orders_dishes RESTART IDENTITY CASCADE").then(function () {
    // Inserts seed entries
    return knex("orders_dishes").insert(orders_dishes);
  });
};