const knex = require("../db/connection");

function list() {
    return knex("dishes").select("*");
}

function read(dishId) {
    return knex("dishes").select("*").where({ dish_id: dishId}).first();
}

function create(newDish) {
    return knex("dishes").insert(newDish).returning("*").then((dishes) => dishes[0]);
}

function update(updatedDish, dishId) {
    return knex("dishes").update(updatedDish).returning("*").where({ dish_id: dishId }).then((dishes) => dishes[0]);
}

module.exports = {
    list,
    read,
    create,
    update,
};