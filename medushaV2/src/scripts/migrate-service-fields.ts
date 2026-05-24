/**
 * Complete Database Migration Script for Service Module
 * 
 * Run with: npx ts-node src/scripts/migrate-service-fields.ts
 * 
 * This script adds all required fields and tables for service product features:
 * - service_order: address, service_date, notes, grab_records
 * - service_product: description, image_url, commission_rate, profit_sharing rates
 * - service_settings: global configuration
 * - customer_referral: referee_id, referred_at
 */

import { loadEnv } from "@medusajs/framework/utils"
import { EOL } from "os"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

async function migrate() {
  console.log("Starting complete database migration for service module...")
  console.log("=".repeat(60))

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
      const dbPath = databaseUrl.replace("sqlite://", "")
      const db = new Database(dbPath)

      // Migration 1: service_order table - add missing fields
      console.log(EOL + "[1/8] Adding fields to service_order table...")
      
      const orderTableInfo = db.prepare("PRAGMA table_info(service_order)").all() as any[]
      const existingOrderColumns = orderTableInfo.map((col) => col.name)

      const orderFields = [
        { name: "address_id", type: "TEXT" },
        { name: "service_address", type: "TEXT" },
        { name: "service_date", type: "TEXT" },
        { name: "notes", type: "TEXT" },
        { name: "grab_records", type: "TEXT" }, // JSON array of grab attempts
        { name: "assigned_provider_id", type: "TEXT" },
        { name: "auto_complete_at", type: "TEXT" },
        { name: "service_address_contact", type: "TEXT" },
        { name: "service_address_phone", type: "TEXT" },
      ]

      for (const field of orderFields) {
        if (!existingOrderColumns.includes(field.name)) {
          db.exec(`ALTER TABLE service_order ADD COLUMN ${field.name} ${field.type}`)
          console.log(`  ✓ Added '${field.name}' column`)
        } else {
          console.log(`  - '${field.name}' already exists`)
        }
      }

      // Migration 2: service_product table - add missing fields
      console.log(EOL + "[2/8] Adding fields to service_product table...")
      
      let productTableInfo: any[] = []
      try {
        productTableInfo = db.prepare("PRAGMA table_info(service_product)").all() as any[]
      } catch (e) {
        console.log("  - service_product table does not exist, will be created by module migration")
      }
      
      const existingProductColumns = productTableInfo.map((col) => col.name)

      const productFields = [
        { name: "description", type: "TEXT" },
        { name: "image_url", type: "TEXT" },
        { name: "commission_rate", type: "REAL DEFAULT 0.10" },
        { name: "profit_sharing_level1", type: "REAL DEFAULT 0.10" },
        { name: "profit_sharing_level2", type: "REAL DEFAULT 0.05" },
        { name: "profit_sharing_level3", type: "REAL DEFAULT 0.02" },
        { name: "is_active", type: "INTEGER DEFAULT 1" },
      ]

      for (const field of productFields) {
        if (!existingProductColumns.includes(field.name)) {
          db.exec(`ALTER TABLE service_product ADD COLUMN ${field.name} ${field.type}`)
          console.log(`  ✓ Added '${field.name}' column`)
        } else {
          console.log(`  - '${field.name}' already exists`)
        }
      }

      // Migration 3: customer_referral table - add missing fields
      console.log(EOL + "[3/8] Adding fields to customer_referral table...")
      
      let referralTableInfo: any[] = []
      try {
        referralTableInfo = db.prepare("PRAGMA table_info(customer_referral)").all() as any[]
      } catch (e) {
        console.log("  - customer_referral table does not exist, will be created by module migration")
      }
      
      const existingReferralColumns = referralTableInfo.map((col) => col.name)

      const referralFields = [
        { name: "referee_id", type: "TEXT" },
        { name: "referred_at", type: "TEXT" },
      ]

      for (const field of referralFields) {
        if (!existingReferralColumns.includes(field.name)) {
          db.exec(`ALTER TABLE customer_referral ADD COLUMN ${field.name} ${field.type}`)
          console.log(`  ✓ Added '${field.name}' column`)
        } else {
          console.log(`  - '${field.name}' already exists`)
        }
      }

      // Migration 4: Create service_settings table
      console.log(EOL + "[4/8] Creating service_settings table...")
      
      const settingsExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='service_settings'").all()
      
      if (settingsExists.length === 0) {
        db.exec(`
          CREATE TABLE service_settings (
            id TEXT PRIMARY KEY,
            key TEXT UNIQUE NOT NULL,
            value TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `)
        console.log("  ✓ Created 'service_settings' table")

        // Insert default settings
        const defaultSettings = [
          { key: "order_review_mode", value: "auto" }, // auto | manual
          { key: "order_dispatch_mode", value: "grab" }, // grab | assigned | auto
          { key: "commission_settlement_mode", value: "auto" }, // auto | manual
          { key: "auto_complete_hours", value: "72" },
          { key: "profit_sharing_level1_enabled", value: "true" },
          { key: "profit_sharing_level2_enabled", value: "true" },
          { key: "profit_sharing_level3_enabled", value: "true" },
          { key: "default_commission_rate", value: "0.10" },
          { key: "platform_fee_rate", value: "0.05" },
        ]

        for (const setting of defaultSettings) {
          db.prepare("INSERT INTO service_settings (id, key, value) VALUES (?, ?, ?)").run(
            `setting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            setting.key,
            setting.value
          )
        }
        console.log("  ✓ Inserted default settings")
      } else {
        console.log("  - 'service_settings' table already exists")
      }

      // Migration 5: Create profit_sharing_records table
      console.log(EOL + "[5/8] Creating profit_sharing_records table...")
      
      const profitRecordsExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='profit_sharing_record'").all()
      
      if (profitRecordsExists.length === 0) {
        db.exec(`
          CREATE TABLE profit_sharing_record (
            id TEXT PRIMARY KEY,
            order_id TEXT NOT NULL,
            customer_id TEXT NOT NULL,
            referrer_id TEXT,
            level INTEGER DEFAULT 1,
            amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            distributed_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `)
        console.log("  ✓ Created 'profit_sharing_record' table")
      } else {
        console.log("  - 'profit_sharing_record' table already exists")
      }

      // Migration 6: Add fields to service_provider table
      console.log(EOL + "[6/8] Adding fields to service_provider table...")
      
      let providerTableInfo: any[] = []
      try {
        providerTableInfo = db.prepare("PRAGMA table_info(service_provider)").all() as any[]
      } catch (e) {
        console.log("  - service_provider table does not exist, will be created by module migration")
      }
      
      const existingProviderColumns = providerTableInfo.map((col) => col.name)

      const providerFields = [
        { name: "total_orders", type: "INTEGER DEFAULT 0" },
        { name: "completed_orders", type: "INTEGER DEFAULT 0" },
        { name: "total_earnings", type: "REAL DEFAULT 0" },
        { name: "rating", type: "REAL DEFAULT 0" },
      ]

      for (const field of providerFields) {
        if (!existingProviderColumns.includes(field.name)) {
          db.exec(`ALTER TABLE service_provider ADD COLUMN ${field.name} ${field.type}`)
          console.log(`  ✓ Added '${field.name}' column`)
        } else {
          console.log(`  - '${field.name}' already exists`)
        }
      }

      // Migration 7: Add fields to commission table
      console.log(EOL + "[7/8] Adding fields to commission table...")
      
      let commissionTableInfo: any[] = []
      try {
        commissionTableInfo = db.prepare("PRAGMA table_info(commission)").all() as any[]
      } catch (e) {
        console.log("  - commission table does not exist, will be created by module migration")
      }
      
      const existingCommissionColumns = commissionTableInfo.map((col) => col.name)

      const commissionFields = [
        { name: "service_order_id", type: "TEXT" },
        { name: "paid_at", type: "TEXT" },
      ]

      for (const field of commissionFields) {
        if (!existingCommissionColumns.includes(field.name)) {
          db.exec(`ALTER TABLE commission ADD COLUMN ${field.name} ${field.type}`)
          console.log(`  ✓ Added '${field.name}' column`)
        } else {
          console.log(`  - '${field.name}' already exists`)
        }
      }

      // Migration 8: Add fields to provider_earnings table
      console.log(EOL + "[8/8] Adding fields to provider_earnings table...")
      
      let earningsTableInfo: any[] = []
      try {
        earningsTableInfo = db.prepare("PRAGMA table_info(provider_earning)").all() as any[]
      } catch (e) {
        console.log("  - provider_earning table does not exist, will be created by module migration")
      }
      
      const existingEarningsColumns = earningsTableInfo.map((col) => col.name)

      const earningsFields = [
        { name: "paid_at", type: "TEXT" },
        { name: "paid_by", type: "TEXT" },
      ]

      for (const field of earningsFields) {
        if (!existingEarningsColumns.includes(field.name)) {
          db.exec(`ALTER TABLE provider_earning ADD COLUMN ${field.name} ${field.type}`)
          console.log(`  ✓ Added '${field.name}' column`)
        } else {
          console.log(`  - '${field.name}' already exists`)
        }
      }

      db.close()
      console.log(EOL + "=".repeat(60))
      console.log("Migration completed successfully!")
      console.log("=".repeat(60))
      
    } else {
      console.log(EOL + "For PostgreSQL/MySQL, run migrations via Medusa CLI:")
      console.log("  medusa migrations run")
      console.log(EOL + "Or manually execute the following migrations:")
      console.log("  1. service_order: address_id, service_address, service_date, notes, grab_records, assigned_provider_id")
      console.log("  2. service_product: description, image_url, commission_rate, profit_sharing levels, is_active")
      console.log("  3. customer_referral: referee_id, referred_at")
      console.log("  4. Create service_settings table")
      console.log("  5. Create profit_sharing_record table")
      console.log("  6. service_provider: total_orders, completed_orders, total_earnings, rating")
      console.log("  7. commission: service_order_id, paid_at")
      console.log("  8. provider_earning: paid_at, paid_by")
    }

  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

migrate()