const express = require("express");
const router = express.Router();
const { geocodeCity, searchPlaces, getPlaceDetails } = require("../controllers/mapsController");

router.get("/geocode", geocodeCity);
router.get("/search",  searchPlaces);
router.get("/details", getPlaceDetails);

module.exports = router;
