/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable("board_spaces", {
    game_id: {
      type: "integer",
      notNull: true,
      primaryKey: true,
    },
    board_position: {
      type: "integer",
      notNull: true,
    },
    property_name: {
      type: "varchar(255)",
      notNull: true,
    },
    property_owned: {
      type: "boolean",
      default: false,
    },
    property_owner: {
      type: "integer",
      notNull: true,
    },
    space_type: {
      type: "varchar(255)",
      notNull: true,
      primaryKey: false,
    },
    house_count: {
      type: "integer",
      notNull: true,
    },
    mortgaged: {
      type: "boolean",
      default: false,
    },
  });
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable("board_spaces");
};
