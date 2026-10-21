// src/db/seed.js
// Run with: node src/db/seed.js
// Clears existing data and inserts fresh seed data.

import "dotenv/config";
import { db } from "./index.js";
import { trainers, classes, pricing } from "./schema.js";
import { trainersData } from "./trainers.data.js";
import { classesData } from "./classes.data.js";
import { pricingData } from "./pricing.data.js";

async function seed() {
  try {
    console.log("Clearing existing data...");
    await db.delete(classes);
    await db.delete(trainers);
    await db.delete(pricing);

    console.log("Seeding trainers...");
    const insertedTrainers = await db
      .insert(trainers)
      .values(trainersData)
      .returning();
    console.log(`✓ Inserted ${insertedTrainers.length} trainers`);

    console.log("Seeding classes...");
    const insertedClasses = await db
      .insert(classes)
      .values(classesData)
      .returning();
    console.log(`✓ Inserted ${insertedClasses.length} classes`);

    console.log("Seeding pricing plans...");
    const insertedPricing = await db
      .insert(pricing)
      .values(pricingData)
      .returning();
    console.log(`✓ Inserted ${insertedPricing.length} pricing plans`);

    console.log("\n✅ Seed complete.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
