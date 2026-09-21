import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
let data = [];

const $ = id => document.getElementById(id);

$("today").textContent = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "full"
}).format(new Date());

$("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  $("loginMessage").textContent = "Memproses...";
  const { error } = await supabase.auth.signInWithPassword({
    email: $("email").value,
    password: $("password").value
  });
  if (error) return $("loginMessage").textContent = error.message;
  showAdmin();
});

$("logout").onclick = async () => {
  await supabase.auth.signOut();
  location.reload();
};

async function showAdmin() {
  $("loginView").classList.add("hidden");
  $("adminView").classList.remove("hidden");
  await loadData();
}

async function loadData() {
  $("tableMessage").textContent = "Memuat data...";
  let query = supabase.from("attendance").select("*").order("created_at", {ascending:false});
  const date = $("dateFilter").value;
  const status = $("statusFilter").value;
  const search = $("search").value.trim();

  if (date) {
    query = query.gte("created_at", `${date}T00:00:00`).lt("created_at", `${date}T23:59:59.999`);
  }
  if (status) query = query.eq("status", status);

  const { data: rows, error } = await query;
  if (error) {
    $("tableMessage").textContent = error.message;
    return;
  }
  data = rows || [];
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(x => [x.name,x.identity_number,x.group_name].some(v => (v||"").toLowerCase().includes(q)));
  }
  render();
}

function render() {
  $("total").textContent = data.length;
  $("present").textContent = data.filter(x=>x.status==="Hadir").length;
  $("permit").textContent = data.filter(x=>x.status==="Izin").length;
  $("sick").textContent = data.filter(x=>x.status==="Sakit").length;
  $("absent").textContent = data.filter(x=>x.status==="Alpa").length;

  $("rows").innerHTML = data.map(x => `
    <tr>
      <td>${formatDate(x.created_at)}</td>
      <td>${esc(x.name)}</td>
      <td>${esc(x.identity_number)}</td>
      <td>${esc(x.group_name)}</td>
      <td><span class="badge">${esc(x.status)}</span></td>
      <td>${esc(x.note || "-")}</td>
      <td><button class="danger" data-id="${x.id}">Hapus</button></td>
    </tr>`).join("") || `<tr><td colspan="7">Belum ada data.</td></tr>`;

  document.querySelectorAll("[data-id]").forEach(btn => btn.onclick = () => removeRow(btn.dataset.id));
  $("tableMessage").textContent = `${data.length} data ditampilkan.`;
}

async function removeRow(id) {
  if (!confirm("Hapus data absensi ini?")) return;
  const { error } = await supabase.from("attendance").delete().eq("id", id);
  if (error) return alert(error.message);
  loadData();
}

function formatDate(v) {
  return new Intl.DateTimeFormat("id-ID", {dateStyle:"short", timeStyle:"short"}).format(new Date(v));
}
function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

$("refresh").onclick = loadData;
$("dateFilter").onchange = loadData;
$("statusFilter").onchange = loadData;
$("search").oninput = loadData;

$("export").onclick = () => {
  const header = ["Waktu","Nama","NIK/NIS","Kelas/Divisi","Status","Keterangan"];
  const lines = [header, ...data.map(x => [
    x.created_at,x.name,x.identity_number,x.group_name,x.status,x.note || ""
  ])].map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(","));
  const blob = new Blob(["\ufeff"+lines.join("\n")], {type:"text/csv;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `rekap-absensi-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
};

supabase.auth.getSession().then(({data:{session}}) => {
  if (session) showAdmin();
});
