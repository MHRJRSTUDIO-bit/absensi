async function submitAttendance(e) {
  e.preventDefault();
  const msg = document.getElementById("message");
  msg.textContent = "Menyimpan...";
  try {
    const res = await fetch(`${window.SUPABASE_URL}/rest/v1/attendance`, {
      method: "POST",
      headers: {
        "apikey": window.SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${window.SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        name: document.getElementById("name").value.trim(),
        identity_number: document.getElementById("identity").value.trim(),
        group_name: document.getElementById("group").value.trim(),
        status: document.getElementById("status").value,
        note: document.getElementById("note").value.trim()
      })
    });
    if (!res.ok) throw new Error(await res.text());
    document.getElementById("attendanceForm").reset();
    msg.textContent = "Absensi berhasil disimpan.";
  } catch (err) {
    console.error(err);
    msg.textContent = "Gagal menyimpan. Periksa konfigurasi Supabase.";
  }
}
document.getElementById("attendanceForm").addEventListener("submit", submitAttendance);
