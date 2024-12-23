const orders = require("../../data/orders-data");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex.raw("TRUNCATE TABLE orders RESTART IDENTITY CASCADE").then(function () {
    // Inserts seed entries
    return knex("orders").insert(orders);
  });
};