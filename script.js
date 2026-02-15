// 1. Sambungkan ke Supabase menggunakan URL dan Key dari Vercel
const supabaseUrl = "https://reqwsqmlneizoyuetopn.supabase.co"; // API URL anda
const supabaseKey = "sb_publishable_YVEKfGzAsgyGPHgrUhuM-A_UQ8PfKh0"; // Anon Key anda (Publishable key)
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

const addBtn = document.getElementById("addBtn");
const modal = document.getElementById("modal");
const container = document.querySelector(".card-container");
const mainDateFilter = document.getElementById("date");

const subjectLibrary = {
  arudh: "gambar/arudh.png",
  fiqah: "gambar/fiqah.png",
  tauhid: "gambar/tauhid.png",
  nahu: "gambar/nahu.png",
  sorof: "gambar/sorof.png",
  hadis: "gambar/hadis.png",
  tafsir: "gambar/tafsir.png",
  insyak: "gambar/insyak.png",
  mantiq: "gambar/mantiq.png",
  ulum: "gambar/ulum.png",
  balaghah: "gambar/balaghah.png",
  "adab nusus": "gambar/adabnusus.png",
  tajwid: "gambar/tajwid.png",
  mutolaah: "gambar/mutolaah.png",
  faraid: "gambar/faraid.png",
  firaq: "gambar/firaq.png",
};

window.onload = () => loadTasks();
mainDateFilter.onchange = () => loadTasks();
addBtn.onclick = () => (modal.style.display = "block");

function closeModal() {
  modal.style.display = "none";
}
function closeInfoModal() {
  document.getElementById("infoModal").style.display = "none";
  document.body.style.overflow = "auto";
}

function openInfo(name, info, page, notes, date, bookImg, taskImg) {
  document.getElementById("displayBookImage").src = bookImg;
  document.getElementById("displayTaskImage").src = taskImg;
  document.getElementById("displaySubjek").innerText = name;
  document.getElementById("displayInfo").innerText = info || "-";
  document.getElementById("displayPage").innerText = page || "-";
  document.getElementById("displayNotes").innerText = notes || "Tiada nota.";
  document.getElementById("displayDate").innerText = date;
  document.getElementById("infoModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

// 2. Fungsi Ambil Data dari Database (Bukan localStorage)
async function loadTasks() {
  container.innerHTML = "<p style='text-align:center;'>Memuatkan data...</p>";

  const selectedDate = mainDateFilter.value;
  let query = _supabase.from("tasks").select("*");

  if (selectedDate) {
    query = query.eq("date", selectedDate);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Ralat database:", error);
    return;
  }

  container.innerHTML = "";
  data.forEach((task) => renderCard(task));
}

// 3. Fungsi Simpan Data ke Database
async function saveTask() {
  const nameInput = document.getElementById("subjekName").value;
  const taskDate = document.getElementById("taskDateInput").value;

  if (!nameInput || !taskDate) {
    alert("Sila isi Nama Subjek dan Tarikh!");
    return;
  }

  const imageInput = document.getElementById("imageInput");
  let uploadedImageUrl = "";

  if (imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.readAsDataURL(imageInput.files[0]);
    reader.onload = async (e) => {
      uploadedImageUrl = e.target.result;
      await sendToSupabase(nameInput, taskDate, uploadedImageUrl);
    };
  } else {
    await sendToSupabase(nameInput, taskDate, "");
  }
}

async function sendToSupabase(name, date, img) {
  const newTask = {
    name: name,
    info: document.getElementById("homeworkInfo").value || "",
    page: document.getElementById("pageNumber").value || "",
    notes: document.getElementById("extraNotes").value || "",
    date: date,
    status: document.getElementById("statusSelect").value,
    image: img,
  };

  const { error } = await _supabase.from("tasks").insert([newTask]);

  if (error) {
    alert("Gagal simpan: " + error.message);
  } else {
    closeModal();
    loadTasks();
  }
}

function renderCard(task) {
  const nameLower = task.name.toLowerCase().trim();
  const bookImg =
    subjectLibrary[nameLower] ||
    "https://via.placeholder.com/150x100?text=Subjek";
  const taskImg =
    task.image || "https://via.placeholder.com/150x100?text=Tiada+Gambar";

  const cardHTML = `
    <div class="subject-card" onclick="openInfo('${task.name}', '${task.info}', '${task.page}', '${task.notes}', '${task.date}', '${bookImg}', '${taskImg}')">
        <img src="${bookImg}" class="subject-img">
        <div class="card-info">
            <h3>${task.name}</h3>
            <select class="status-select ${task.status}" onclick="event.stopPropagation()" onchange="updateStatus(${task.id}, this.value)">
                <option value="pending" ${task.status === "pending" ? "selected" : ""}>! Kena Siapkan</option>
                <option value="done" ${task.status === "done" ? "selected" : ""}>Sudah Siap</option>
                <option value="presentation" ${task.status === "presentation" ? "selected" : ""}>Presentation</option>
            </select>
            <br>
            <button onclick="event.stopPropagation(); deleteTask(${task.id})" style="color:red; border:none; background:none; cursor:pointer; font-size:11px; margin-top:5px;">Hapus</button>
        </div>
    </div>`;
  container.innerHTML += cardHTML;
}

async function updateStatus(id, newStatus) {
  const { error } = await _supabase
    .from("tasks")
    .update({ status: newStatus })
    .eq("id", id);
  if (!error) loadTasks();
}

async function deleteTask(id) {
  if (confirm("Padam tugasan ini?")) {
    const { error } = await _supabase.from("tasks").delete().eq("id", id);
    if (!error) loadTasks();
  }
}
