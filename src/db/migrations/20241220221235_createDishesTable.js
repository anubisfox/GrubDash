exports.up = function(knex) {
  return knex.schema.createTable("dishes", (table) => {
    table.increments("dish_id").primary();
    table.string("name");
    table.text("description");
    table.integer("price");
    table.string("image_url");
    table.timestamps(true, true);
  });
};


exports.down = function(knex) {
    return knex.schema.dropTable("dishes");
};
