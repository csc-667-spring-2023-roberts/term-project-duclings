/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable("community_chest_deck", {
    deck_id: {
      type: "integer",
      notNull: true,
      primaryKey: true,
    },
    game_id: {
      type: "integer",
      notNull: true,
    },
    card_id: {
      type: "integer",
      notNull: true,
    },
    card_text: {
      type: "text",
      notNull: true,
    },
    action_type: {
      type: "varchar(255)",
      notNull: true,
    },
    action_data: {
      type: "varchar(255)",
      notNull: true,
    },
  });
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable("community_chest_deck");
};
