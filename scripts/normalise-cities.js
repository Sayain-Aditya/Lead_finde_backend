// Run once to fix all existing duplicate city names in MongoDB
// Usage: node scripts/normalise-cities.js
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Lead = require("../models/Lead");

const titleCase = (str) =>
  (str || "").trim().replace(/\b\w/g, (c) => c.toUpperCase());

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const leads = await Lead.find({ city: { $exists: true } });
  let updated = 0;

  for (const lead of leads) {
    const normalised = titleCase(lead.city);
    if (lead.city !== normalised) {
      await Lead.findByIdAndUpdate(lead._id, { $set: { city: normalised } });
      console.log(`  "${lead.city}" → "${normalised}"`);
      updated++;
    }
  }

  console.log(`\nDone. Updated ${updated} of ${leads.length} leads.`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
