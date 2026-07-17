-- Run this in Supabase → SQL Editor → New Query

-- Safe to run more than once — every statement below skips or replaces
-- anything that already exists instead of erroring.

create table if not exists products (
  id serial primary key,
  name varchar(150) not null,
  category varchar(50) not null check (category in ('long-sleeve', 'short-sleeve')),
  subcategory varchar(50),   -- free text, e.g. "Formal", "Casual", "Business"
  subheading varchar(255),
  price decimal(10,2) not null,
  image text not null,
  sizes text not null,   -- slash-separated, e.g. "S/M/L/XL"
  colors text not null,  -- slash-separated, e.g. "White/Navy Blue"
  in_stock boolean not null default true,
  created_at timestamptz default timezone('utc', now()) not null
);

-- In case this table was created before subcategory / in_stock existed
alter table products add column if not exists subcategory varchar(50);
alter table products add column if not exists in_stock boolean not null default true;

-- Row Level Security: anyone can VIEW products (it's a public catalog).
-- Insert/update/delete also go through the same public key in this simple
-- setup — the admin page's password screen is what gates who sees the
-- controls, not the database itself. See the "A note on security" section
-- in the README for the tradeoff this makes and how to tighten it later.
alter table products enable row level security;

drop policy if exists "Public can view products" on products;
drop policy if exists "Public can manage products" on products;
create policy "Public can view products" on products for select using (true);
create policy "Public can manage products" on products for all using (true) with check (true);

-- Storage bucket for uploaded product photos (used by the "Upload a photo"
-- button in /admin). Public read so the live site can display images;
-- public write so the admin page can upload without a separate login system —
-- same tradeoff as the products table above.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
drop policy if exists "Public can upload product images" on storage.objects;
drop policy if exists "Public can update product images" on storage.objects;
drop policy if exists "Public can delete product images" on storage.objects;

create policy "Public can view product images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Public can upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images');

create policy "Public can update product images" on storage.objects
  for update using (bucket_id = 'product-images');

create policy "Public can delete product images" on storage.objects
  for delete using (bucket_id = 'product-images');

-- Sample starter data — only inserted the first time (skipped if the
-- products table already has rows in it, so re-running this won't duplicate them)
insert into products (name, category, subcategory, subheading, price, image, sizes, colors, in_stock)
select * from (values
  ('The Oxford', 'long-sleeve', 'Formal', 'Sharp tailoring, all day', 350.00,
   'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800',
   'S/M/L/XL/XXL', 'Sky Blue/White/Navy Blue', true),
  ('The Linen', 'short-sleeve', 'Casual', 'Casual comfort, redefined', 280.00,
   'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800',
   'M/L/XL', 'Olive Green/Soft Sand/White', false)
) as sample_data
where not exists (select 1 from products);
