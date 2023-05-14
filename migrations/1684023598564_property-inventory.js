/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable("property_inventory", {
    user_id: {
      type: "integer",
      notNull: true,
      primaryKey: true,
    },
    railroads_owned: {
      type: "integer",
      notNull: true,
    },
    utilities_owned: {
      type: "integer",
      notNull: true,
    },
    browns_owned: {
      type: "integer",
      notNull: true,
    },
    light_blues_owned: {
      type: "integer",
      notNull: true,
    },
    magentas_owned: {
      type: "integer",
      notNull: true,
    },
    oranges_owned: {
      type: "integer",
      notNull: true,
    },
    reds_owned: {
      type: "integer",
      notNull: true,
    },
    yellows_owned: {
      type: "integer",
      notNull: true,
    },
    greens_owned: {
      type: "integer",
      notNull: true,
    },
    dark_blues_owned: {
      type: "integer",
      notNull: true,
    },
  });
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable("property_inventory");
};
