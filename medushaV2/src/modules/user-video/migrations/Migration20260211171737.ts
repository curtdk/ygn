import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260211171737 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "user_video" ("id" text not null, "user_id" text not null, "order_id" text null, "product_id" text not null, "video_url" text null, "thumbnail_url" text null, "title" text not null, "duration" integer not null default 0, "status" text check ("status" in ('pending', 'processing', 'completed', 'failed')) not null default 'pending', "materials_used" jsonb not null, "error_message" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "user_video_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_user_video_deleted_at" ON "user_video" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user_video" cascade;`);
  }

}
