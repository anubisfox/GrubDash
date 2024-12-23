
exports.up = function(knex) {
    return knex.schema.createTable("orders_dishes", (table) => {
        table.integer("order_id");
        table.foreign("order_id").references("order_id").inTable("orders").onDelete("cascade");
        table.integer("dish_id");
        table.foreign("dish_id").references("dish_id").inTable("dishes").onDelete("cascade");
        table.integer("quantity").unsigned();
        table.timestamps(true, true);
      });
};


exports.down = function(knex) {
    return knex.schema.dropTable("orders_dishes");
};
