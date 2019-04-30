const environments = ["development", "production", "test"];
const NODE_ENV = process.env.NODE_ENV || "development";

if (environments.indexOf(NODE_ENV) < 0)
  throw new Error(`NODE_ENV must be one of ${environments}; Got: ${NODE_ENV}`);

module.exports = {
  NODE_ENV,
  environments,
  PRODUCTION: NODE_ENV === "production",
  DEVELOPMENT: NODE_ENV === "development",
  TEST: NODE_ENV === "test",
};
