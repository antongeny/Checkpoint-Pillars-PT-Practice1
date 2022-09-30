const Sequelize = require("sequelize");
const db = require("./db");

const Place = db.define("place", {
	place_name: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	category: {
		type: Sequelize.ENUM(["CITY", "STATE", "COUNTRY"]),
		defaultValue: "STATE",
		allowNull: false,
	},
});
//*create a function in .create

/**
 * We've created the association for you!
 *
 * A place can be related to another place:
 *       NY State (parent)
 *         |
 *       /   \
 *     NYC   Albany
 * (child)  (child)
 *
 * You can find the parent of a place and the children of a place
 */

Place.belongsTo(Place, { as: "parent" });
Place.hasMany(Place, { as: "children", foreignKey: "parentId" });

module.exports = Place;
