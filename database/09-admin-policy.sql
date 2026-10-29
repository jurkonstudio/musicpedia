-- Jalankan SETELAH 01-08. Publik hanya membaca artikel terbit; user login (admin) bebas kelola.
insert into post_categories (slug,name) values
 ('berita','{"id":"Berita","en":"News"}'),('tutorial-chord','{"id":"Tutorial Chord","en":"Chord Tutorials"}'),
 ('ulasan','{"id":"Ulasan","en":"Reviews"}'),('sejarah','{"id":"Sejarah","en":"History"}')
on conflict (slug) do nothing;

alter table posts enable row level security;
drop policy if exists "baca publik" on posts;
create policy "publik baca terbit" on posts for select using (status = 'published');
create policy "admin baca semua"  on posts for select to authenticated using (true);
create policy "admin tulis"       on posts for insert to authenticated with check (true);
create policy "admin ubah"        on posts for update to authenticated using (true) with check (true);
create policy "admin hapus"       on posts for delete to authenticated using (true);
