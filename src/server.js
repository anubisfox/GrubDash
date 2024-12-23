const { PORT = 5000 } = process.env;

const path = require("path");
const app = require(path.resolve(
  `${process.env.SOLUTION_PATH || ""}`,
  "src/app"
));

const listener = () => console.log(`Listening on Port ${PORT}!`);

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
    app.listen(PORT, listener);
  })
  .catch((error) => {
    console.error(error);
    knex.destroy();
  });
