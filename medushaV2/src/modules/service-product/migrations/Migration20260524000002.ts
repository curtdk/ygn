import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260524000002 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "service_product" (
        "id" text not null,
        "product_id" text not null,
        "service_type" text not null,
        "description" text null,
        "estimated_duration" integer null,
        "requirements" jsonb null,
        "provider_id" text null,
        "is_active" boolean not null default true,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "service_product_pkey" primary key ("id")
      );
    `)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_product_product_id" ON "service_product" ("product_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_product_deleted_at" ON "service_product" ("deleted_at") WHERE deleted_at IS NULL;`)

    this.addSql(`
      create table if not exists "service_order" (
        "id" text not null,
        "order_id" text not null,
        "customer_id" text not null,
        "provider_id" text null,
        "service_product_id" text not null,
        "status" text check ("status" in ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed')) not null default 'pending',
        "requirements" jsonb null,
        "result_url" text null,
        "result_thumbnail" text null,
        "completion_note" text null,
        "provider_earnings" numeric null,
        "platform_fee" numeric null,
        "started_at" timestamptz null,
        "completed_at" timestamptz null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "service_order_pkey" primary key ("id")
      );
    `)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_order_order_id" ON "service_order" ("order_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_order_provider_id" ON "service_order" ("provider_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_order_customer_id" ON "service_order" ("customer_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_order_status" ON "service_order" ("status");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_order_deleted_at" ON "service_order" ("deleted_at") WHERE deleted_at IS NULL;`)

    this.addSql(`
      create table if not exists "service_pricing" (
        "id" text not null,
        "product_id" text not null,
        "provider_id" text null,
        "price_type" text check ("price_type" in ('fixed', 'percentage', 'tiered')) not null default 'fixed',
        "base_price" numeric not null,
        "provider_rate" numeric not null default 0.7,
        "min_order_value" numeric null,
        "max_discount" numeric null,
        "is_active" boolean not null default true,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "service_pricing_pkey" primary key ("id")
      );
    `)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_pricing_product_id" ON "service_pricing" ("product_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_pricing_provider_id" ON "service_pricing" ("provider_id");`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_pricing_deleted_at" ON "service_pricing" ("deleted_at") WHERE deleted_at IS NULL;`)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "service_pricing" cascade;`)
    this.addSql(`drop table if exists "service_order" cascade;`)
    this.addSql(`drop table if exists "service_product" cascade;`)
  }
}