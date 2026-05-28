const express = require("express");
const router = express.Router();
const { getAllLeads, createLeads, updateLead, deleteLead, deleteAllLeads } = require("../controllers/leadController");

router.get("/",       getAllLeads);
router.post("/",      createLeads);
router.put("/:id",    updateLead);
router.delete("/:id", deleteLead);
router.delete("/",    deleteAllLeads);

module.exports = router;
