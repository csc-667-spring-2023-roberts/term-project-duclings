/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable("game_moves", {
    id: "id",
    game_id: {
      type: "integer",
      notNull: true,
    },
    user_id: {
      type: "integer",
      notNull: true,
    },
    x_coordinate: {
      type: "integer",
      notNull: true,
    },
    y_coordinate: {
      type: "integer",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable("game_moves");
};
