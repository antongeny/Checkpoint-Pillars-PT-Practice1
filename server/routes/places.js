const router = require("express").Router();
const {
	models: { Place },
} = require("../db");

// Add your routes here:

// router.get("/unassigned", async (req, res, next) => {
// 	const unassignedCities = await Place.findCitiesWIthNoParent();
// 	res.send(unassignedCities);
// });

router.get("/unassigned", async (req, res, next) => {
	//setting the variable as the return of the class method we created earlier makes it nice and easy to send back in the route!
	const unassCities = await Place.findCitiesWithNoParent();

	res.send(unassCities);
});

router.get("/states", async (req, res, next) => {
	try {
		const states = await Place.findStatesWithCities();

		res.status(200).send(states);
	} catch (error) {
		res.status(404).send(`not found: ${error}`);
	}
});

router.delete("/:id", async (req, res, next) => {
	const placeToDelete = await Place.findByPk(+req.params.id);
	if (placeToDelete) {
		await placeToDelete.destroy();
		res.sendStatus(204);
		done();
	} else {
		res.sendStatus(404);
		done();
	}
});
//
module.exports = router;
