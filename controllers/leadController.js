const Lead = require("../models/Lead");

// GET /leads — fetch all leads sorted newest first
const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// POST /leads — save batch, skip duplicates by name+city
const createLeads = async (req, res) => {
  try {
    const { leads } = req.body;
    if (!Array.isArray(leads) || leads.length === 0)
      return res.status(400).json({ error: "leads array is required" });

    const saved = [];
    const skippedNames = [];

    for (const l of leads) {
      const exists = await Lead.findOne({ name: l.name, city: l.city });
      if (!exists) {
        const doc = await Lead.create(l);
        saved.push(doc);
      } else {
        skippedNames.push(l.name);
      }
    }

    res.status(201).json({
      saved: saved.length,
      skipped: skippedNames.length,
      data: saved,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUT /leads/:id — update any fields on a lead
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after", runValidators: true }
    );
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// DELETE /leads/:id — delete one lead
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ success: true, id: req.params.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// DELETE /leads — delete all leads
const deleteAllLeads = async (req, res) => {
  try {
    const result = await Lead.deleteMany({});
    res.json({ success: true, deleted: result.deletedCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = { getAllLeads, createLeads, updateLead, deleteLead, deleteAllLeads };
