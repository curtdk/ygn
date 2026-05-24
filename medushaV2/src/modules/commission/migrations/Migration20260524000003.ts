import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260524000003 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "commission" (
        "id" text not null,
        "customer_id" text not null,
        "referrer_id" text not null,
        "order_id" text not null,
        "service_order_id" text null,
        "level" integer not null,
        "commission_type" text check ("commission_type" in ('order', 'service')) not null default 'order',
        "order_amount" numeric not null,
        "commission_rate" numeric not null,
        "commission_amount" numeric not null,
        "status" text check ("status" in ('pending', 'settled', 'withdrawn', 'cancelled')) not null default 'pending',
        "settled_at" timestamptz null,
        "settled_by" text null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "commission_pkey" primary key ("id")
      );
    `)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_commission_referrer_id" ON "commission" ("referrer_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_commission_customer_id" ON "commission" ("customer_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_commission_order_id" ON "commission" ("order_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_commission_status" ON "commission" ("status");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_commission_deleted_at" ON "commission" ("deleted_at") WHERE deleted_at IS NULL;`)

    this.addSql(`
      create table if not exists "commission_settlement" (
        "id" text not null,
        "referrer_id" text not null,
        "total_amount" numeric not null,
        "service_charge" numeric not null default 0,
        "actual_amount" numeric not null,
        "status" text check ("status" in ('pending', 'processing', 'completed', 'failed')) not null default 'pending',
        "payment_method" text check ("payment_method" in ('alipay', 'bank', 'wechat')) null,
        "payment_account" text null,
        "payment_proof" text null,
        "processed_at" timestamptz null,
        "processed_by" text null,
        "notes" text null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "commission_settlement_pkey" primary key ("id")
      );
    `)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_commission_settlement_referrer_id" ON "commission_settlement" ("referrer_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_commission_settlement_status" ON "commission_settlement" ("status");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_commission_settlement_deleted_at" ON "commission_settlement" ("deleted_at") WHERE deleted_at IS NULL;`)

    this.addSql(`
      create table if not exists "provider_earnings" (
        "id" text not null,
        "provider_id" text not null,
        "service_order_id" text not null,
        "order_id" text null,
        "amount" numeric not null,
        "platform_fee" numeric not null default 0,
        "net_amount" numeric not null,
        "status" text check ("status" in ('pending', 'settled', 'withdrawn')) not null default 'pending',
        "settled_at" timestamptz null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "provider_earnings_pkey" primary key ("id")
      );
    `)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_provider_earnings_provider_id" ON "provider_earnings" ("provider_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_provider_earnings_service_order_id" ON "provider_earnings" ("service_order_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_provider_earnings_status" ON "provider_earnings" ("status");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_provider_earnings_deleted_at" ON "provider_earnings" ("deleted_at") WHERE deleted_at IS NULL;`)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "provider_earnings" cascade;`)
    this.addSql(`drop table if exists "commission_settlement" cascade;`)
    this.addSql(`drop table if exists "commission" cascade;`)
  }
}