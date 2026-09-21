# Sistem Absensi + Admin

## 1. Buat database
1. Buat project di Supabase.
2. Buka SQL Editor.
3. Jalankan isi `supabase.sql`.

## 2. Buat akun admin
Di Supabase buka Authentication > Users > Add user.
Buat email dan password admin.

## 3. Hubungkan website
Buka Project Settings > API.
Salin Project URL dan Publishable/anon key.
Masukkan ke `config.js`.

Contoh:
window.SUPABASE_URL = "https://xxxx.supabase.co";
window.SUPABASE_ANON_KEY = "eyJ...";

## 4. Jalankan
Bisa di-upload ke GitHub Pages atau hosting statis.
- Halaman absensi: `/index.html`
- Halaman admin: `/admin.html`

## Catatan keamanan
Versi awal ini menggunakan semua akun Supabase Auth sebagai admin.
Untuk penggunaan serius dengan banyak admin, tambahkan role admin pada tabel profiles dan policy RLS berbasis role.
Jangan pernah memasukkan service_role key ke HTML/JavaScript frontend.

## Data yang tersimpan
Nama, NIK/NIS, kelas/divisi, status, keterangan, waktu input, dan ID unik.
