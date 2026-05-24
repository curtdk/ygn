import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260524000001 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "service_provider" (
        "id" text not null,
        "customer_id" text not null,
        "status" text check ("status" in ('pending', 'approved', 'rejected')) not null default 'pending',
        "phone" text null,
        "id_card_front" text null,
        "id_card_back" text null,
        "work_certificate" text null,
        "honor_certificate" text null,
        "approved_at" timestamptz null,
        "rejected_at" timestamptz null,
        "rejection_reason" text null,
        "approved_by" text null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "service_provider_pkey" primary key ("id")
      );
    `)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_provider_customer_id" ON "service_provider" ("customer_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_provider_status" ON "service_provider" ("status");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_provider_deleted_at" ON "service_provider" ("deleted_at") WHERE deleted_at IS NULL;`)

    this.addSql(`
      create table if not exists "service_provider_application" (
        "id" text not null,
        "customer_id" text not null,
        "phone" text not null,
        "id_card_front" text not null,
        "id_card_back" text not null,
        "work_certificate" text null,
        "honor_certificate" text null,
        "status" text check ("status" in ('pending', 'approved', 'rejected')) not null default 'pending',
        "rejection_reason" text null,
        "reviewed_at" timestamptz null,
        "reviewed_by" text null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "service_provider_application_pkey" primary key ("id")
      );
    `)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_provider_application_customer_id" ON "service_provider_application" ("customer_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_provider_application_status" ON "service_provider_application" ("status");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_provider_application_deleted_at" ON "service_provider_application" ("deleted_at") WHERE deleted_at IS NULL;`)

    this.addSql(`
      create table if not exists "customer_referral" (
        "id" text not null,
        "customer_id" text not null,
        "referrer_id" text null,
        "level" integer not null default 1,
        "referral_code" text null,
        "created_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "customer_referral_pkey" primary key ("id")
      );
    `)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_referral_customer_id" ON "customer_referral" ("customer_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_referral_referrer_id" ON "customer_referral" ("referrer_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_referral_referral_code" ON "customer_referral" ("referral_code");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_referral_deleted_at" ON "customer_referral" ("deleted_at") WHERE deleted_at IS NULL;`)

    // Add referrer_id and referral_code to customer table
    this.addSql(`ALTER TABLE "customer" ADD COLUMN IF NOT EXISTS "referrer_id" text null;`)
    this.addSql(`ALTER TABLE "customer" ADD COLUMN IF NOT EXISTS "referral_code" text null;`)
    
    // Add product_type to product table
    this.addSql(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "product_type" text default 'product';`)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "customer_referral" cascade;`)
    this.addSql(`drop table if exists "service_provider_application" cascade;`)
    this.addSql(`drop table if exists "service_provider" cascade;`)
    this.addSql(`ALTER TABLE "customer" DROP COLUMN IF EXISTS "referrer_id";`)
    this.addSql(`ALTER TABLE "customer" DROP COLUMN IF EXISTS "referral_code";`)
    this.addSql(`ALTER TABLE "product" DROP COLUMN IF EXISTS "product_type";`)
  }
}