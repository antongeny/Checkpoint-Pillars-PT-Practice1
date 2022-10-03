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
	//* makes data an object Virtual field, not a class method (contrived, usually do in class method)
	isState: {
		type: Sequelize.VIRTUAL,
		get() {
			// return this.getDataValue("category") === "STATE";
			return this.category === "STATE";
			// alternatively fill in true: false with messages in where true or false is.
			// return this.category === "STATE" ? true : false;
		},
	},
	//place name is 'new york city', instead display 'NYC'
	nickname: {
		type: Sequelize.VIRTUAL,
		get() {
			//NEW YORK CITY
			const wordsArray = this.place_name.split(" ");
			//['NEW', 'YORK', 'CITY']
			const capitalFirstLetterArray = wordsArray.map((word) => {
				const firstLetter = word[0];
				const capitalFirstLetter = firstLetter.toUpperCase();
				return capitalFirstLetter;
			});
			return capitalFirstLetterArray.join("");
		},
	},
});
//*create a function in

Place.findCitiesWithNoParent = async () => {
	return await Place.findAll({
		where: {
			category: "CITY",
			parentId: null,
		},
	});
};

Place.findStatesWithCities = async () => {
	return await Place.findAll({
		where: {
			category: "STATE",
		},
		include: [
			{
				model: Place,
				as: "children",
			},
		],
		// include: "CITY", // 	category: "STATE",
	});
};

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
