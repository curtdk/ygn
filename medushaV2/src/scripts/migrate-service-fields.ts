/**
 * Database Migration Script
 * 
 * Run with: npx ts-node src/scripts/migrate-service-fields.ts
 * 
 * This script adds the new fields required for service product features:
 * - service_order: rating, review_comment, reviewed_at
 * - customer_referral: referee_id
 */

import { loadEnv } from "@medusajs/framework/utils"
import { EOL } from "os"
import type { DbType } from "@medusajs/framework"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

async function migrate() {
  console.log("Starting database migration...")

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error("DATABASE_URL not found in environment")
    process.exit(1)
  }

  try {
    // For SQLite, use direct SQL
    if (databaseUrl.includes("sqlite") || databaseUrl.includes(".db")) {
      console.log("Detected SQLite database, running migrations...")
      
      const { default: Database } = await import("better-sqlite3")
      const db = new Database(databaseUrl.replace("sqlite://", ""))

      // Migration 1: Add review fields to service_order
      console.log("Adding review fields to service_order table...")
      
      const orderTableInfo = db.prepare("PRAGMA table_info(service_order)").all() as any[]
      const existingOrderColumns = orderTableInfo.map((col) => col.name)

      if (!existingOrderColumns.includes("rating")) {
        db.exec("ALTER TABLE service_order ADD COLUMN rating INTEGER")
        console.log("  ✓ Added 'rating' column")
      }

      if (!existingOrderColumns.includes("review_comment")) {
        db.exec("ALTER TABLE service_order ADD COLUMN review_comment TEXT")
        console.log("  ✓ Added 'review_comment' column")
      }

      if (!existingOrderColumns.includes("reviewed_at")) {
        db.exec("ALTER TABLE service_order ADD COLUMN reviewed_at DATETIME")
        console.log("  ✓ Added 'reviewed_at' column")
      }

      // Migration 2: Add referee_id to customer_referral
      console.log("Adding referee_id to customer_referral table...")
      
      const referralTableInfo = db.prepare("PRAGMA table_info(customer_referral)").all() as any[]
      const existingReferralColumns = referralTableInfo.map((col) => col.name)

      if (!existingReferralColumns.includes("referee_id")) {
        db.exec("ALTER TABLE customer_referral ADD COLUMN referee_id TEXT")
        console.log("  ✓ Added 'referee_id' column")
      }

      db.close()
    } else {
      console.log("For PostgreSQL/MySQL, run migrations via Medusa CLI:")
      console.log("  medusa migrations run")
    }

    console.log(EOL + "Migration completed successfully!")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

migrate()