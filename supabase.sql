-- Hapus policy lama jika sudah ada
drop policy if exists "public can insert attendance" on public.attendance;
drop policy if exists "authenticated can read attendance" on public.attendance;
drop policy if exists "authenticated can delete attendance" on public.attendance;

-- Pastikan RLS aktif
alter table public.attendance enable row level security;

-- Pengunjung boleh mengirim absensi
create policy "public can insert attendance"
on public.attendance
for insert
to anon, authenticated
with check (true);

-- Admin/user yang login boleh melihat data
create policy "authenticated can read attendance"
on public.attendance
for select
to authenticated
using (true);

-- Admin/user yang login boleh menghapus data
create policy "authenticated can delete attendance"
on public.attendance
for delete
to authenticated
using (true);