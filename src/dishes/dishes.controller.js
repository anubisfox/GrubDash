const path = require("path");
const dishesService = require("./dishes.service");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// Validations

function validateDishExists(request, response, next) {
    const { dishId } = request.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        response.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish id is not found: ${dishId}`,
    })
};
function validateDishBody(request, response, next) {
    const { data: { name, description, price, image_url } = {} } = request.body;
    if (!name || name === "") {
        next({
            status: 400,
            message: "A name property is required",
        });
    }
    if (!description || description === "") {
        next({
            status: 400,
            message: "A description property is required",
        });
    }
    if (!price) {
        next({
            status: 400,
            message: "A price property is required",
        });
    }
    if (price <= 0 || !Number.isInteger(price)) {
        next({
            status: 400,
            message: "price must be an integer above 0",
        });
    }
    if (!image_url || image_url === "") {
        next({
            status: 400,
            message: "An image_url property is required",
        });
    }
    next();
};

function validateDishId(request, response, next) {
    const { dishId } = request.params;
    const { data: { id } = {} } = request.body;
    if (!id || id === dishId ) {
        response.locals.dishId = dishId;
        return next();
    }
    next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}. Route: ${dishId}.`
    });
};

// Routes

async function list(req, res) {
    const data = await dishesService.list();
    res.json({ data });
}

async function read(req, res) {
    const data = await dishesService(res.locals.foundDish);
    res.json({ data });
}

async function create(req, res) {
    const data = await dishesService.create(res.locals.newDish);
    res.status(201).json({ data });
}

async function update(req, res) {
    const { dishId } = req.params;
    const data = await dishesService.update(req.body.data, Number(dishId));
    res.json({ data });
}

module.exports = {
    list,
    read: [validateDishExists, read],
    create: [validateDishBody, create],
    update: [validateDishExists, validateDishBody, validateDishId, update],
}
