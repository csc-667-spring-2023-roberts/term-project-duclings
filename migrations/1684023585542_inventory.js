/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable("inventory", {
    user_id: {
      type: "integer",
      notNull: true,
      primaryKey: true,
    },
    balance: {
      type: "integer",
      notNull: true,
    },
    jail_turns: {
      type: "integer",
      notNull: true,
    },
    jail_free_card: {
      type: "integer",
      notNull: true,
    },
  });
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable("inventory");
};
