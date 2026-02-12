import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260211171737 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "video_material" ("id" text not null, "product_id" text not null, "name" text not null, "material_key" text not null, "material_type" text check ("material_type" in ('image', 'audio', 'background', 'video')) not null, "default_url" text not null, "is_replaceable" boolean not null default true, "sort_order" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "video_material_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_video_material_deleted_at" ON "video_material" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "video_material" cascade;`);
  }

}
