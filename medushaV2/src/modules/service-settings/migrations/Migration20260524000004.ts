import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260524000004 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "service_setting" (
        "id" text not null,
        "key" text not null,
        "value" text not null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "service_setting_pkey" primary key ("id"),
        constraint "service_setting_key_unique" unique ("key")
      );
    `)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_setting_deleted_at" ON "service_setting" ("deleted_at") WHERE deleted_at IS NULL;`)
    this.addSql(`
      INSERT INTO "service_setting" ("id", "key", "value") VALUES
        (gen_random_uuid()::text, 'order_review_mode', 'auto'),
        (gen_random_uuid()::text, 'order_dispatch_mode', 'grab'),
        (gen_random_uuid()::text, 'commission_settlement_mode', 'auto'),
        (gen_random_uuid()::text, 'auto_complete_hours', '72'),
        (gen_random_uuid()::text, 'profit_sharing_level1_enabled', 'true'),
        (gen_random_uuid()::text, 'profit_sharing_level2_enabled', 'true'),
        (gen_random_uuid()::text, 'profit_sharing_level3_enabled', 'true'),
        (gen_random_uuid()::text, 'default_commission_rate', '0.10'),
        (gen_random_uuid()::text, 'platform_fee_rate', '0.05')
      ON CONFLICT ("key") DO NOTHING;
    `)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "service_setting" cascade;`)
  }
}
