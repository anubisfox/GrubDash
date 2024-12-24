const path = require("path");
const ordersService = require("./orders.service");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// Validators

function validateOrderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
      res.locals.order = foundOrder;
      return next();
    }
    next({
      status: 404,
      message: `Order id does not exist: ${orderId}`,
    });
}

function validateOrderBody(req, res, next) {
    const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
    if (!deliverTo || deliverTo === "") {
        return next({status: 400, message: "Order must include a deliverTo"});
    }
    if (!mobileNumber || mobileNumber === "") {
        return next({ status: 400, message: "Order must include a mobileNumber" });
      }
    if (!dishes) {
        return next({ status: 400, message: "Order must include at least one dish" });
    }
    if(!Array.isArray(dishes) || dishes.length === 0) {
        return next({ status: 400, message: "Order must include at least one dish"});
    }
    dishes.map((dish, index) => {
        if (
            !dish.quantity ||
            !Number.isInteger(dish.quantity) ||
            !dish.quantity > 0
          ) {
          return next({
            status: 400,
            message: `Dish ${index} must have a quantity that is an integer greater than 0.`,
          });
        }
      });
      res.locals.order = req.body.data;
      next();
}

function validateDestroyCheck(req, res, next) {
    if(res.locals.order.status !== "pending") {
        return next({
            status: 400,
            message: "An order cannot be deleted unless it is pending",
        });
    }
    next();
};

function validateStatusCheck(req, res, next) {
    const { orderId } = req.params;
    const { data: { id, status } = {} } = req.body;

    if (id !== undefined && id !== null && id !== "" && id !== orderId) {
        return next({
            status: 400,
            message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
        });
    }

    const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered"];
    if (!status || !validStatuses.includes(status)) {
        return next({
            status: 400,
            message: `Order must have a status of pending, preparing, out-for-delivery, delivered`,
        });
    }

    if (res.locals.order.status === "delivered") {
        return next({
            status: 400,
            message: "A delivered order cannot be changed",
        });
    }

    next();
}

// Routes

async function list(req, res) {
    const data = await ordersService.list();
    res.json({ data });
}

async function read(req, res) {
    const data = await ordersService(res.locals.foundOrder);
    res.json({ data });
}

async function create(req, res) {
    const data = await ordersService.create(req.body.data);
    res.status(201).json({ data });
}

async function update(req, res) {
    const foundOrder = req.locals.foundOrder;
    const { data: { deliverTo, mobileNumber, dishes, status } = {} } = req.body;

    // Update the existing order with new values
    foundOrder.deliverTo = deliverTo;
    foundOrder.mobileNumber = mobileNumber;
    foundOrder.dishes = dishes;
    foundOrder.status = status;

    const data = await ordersService.update(foundOrder);

    res.json({ data });
}

async function destroy( req, res) {
    const { orderId } = req.params;

    await ordersService.destroy(Number(orderId));
    res.sendStatus(204);
}

module.exports = {
    list,
    read: [validateOrderExists, read],
    create: [validateOrderBody, create],
    update: [validateOrderExists, validateOrderBody, validateStatusCheck, update],
    delete: [validateOrderExists, validateDestroyCheck, destroy],
}