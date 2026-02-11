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

window.onload = () => {
  loadTasks();
};
mainDateFilter.onchange = () => {
  loadTasks();
};
addBtn.onclick = () => (modal.style.display = "block");

function closeModal() {
  modal.style.display = "none";
}

function saveTask() {
  const nameInput = document.getElementById("subjekName").value;
  const nameLower = nameInput.toLowerCase().trim();
  const info = document.getElementById("homeworkInfo").value;
  const page = document.getElementById("pageNumber").value;
  const notes = document.getElementById("extraNotes").value;
  const taskDate = document.getElementById("taskDateInput").value;
  const status = document.getElementById("statusSelect").value;
  const imageInput = document.getElementById("imageInput");

  if (!nameInput || !taskDate) {
    alert("Sila isi sekurang-kurangnya Nama Subjek dan Tarikh!");
    return;
  }

  const processSave = (finalImageUrl) => {
    const newTask = {
      id: Date.now(),
      name: nameInput,
      info: info || "",
      page: page || "",
      notes: notes || "",
      date: taskDate,
      status: status,
      image: finalImageUrl,
    };

    let tasks = JSON.parse(localStorage.getItem("schoolTasks")) || [];
    tasks.push(newTask);
    localStorage.setItem("schoolTasks", JSON.stringify(tasks));
    loadTasks();
    closeModal();

    document.getElementById("subjekName").value = "";
    document.getElementById("homeworkInfo").value = "";
    document.getElementById("pageNumber").value = "";
    document.getElementById("extraNotes").value = "";
  };

  if (subjectLibrary[nameLower]) {
    processSave(subjectLibrary[nameLower]);
  } else if (imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = (e) => processSave(e.target.result);
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    processSave("https://via.placeholder.com/150x100?text=Tiada+Gambar");
  }
}

function renderCard(task) {
  const safeName = (task.name || "").replace(/'/g, "\\'");
  const safeInfo = (task.info || "").replace(/'/g, "\\'");
  const safePage = (task.page || "").replace(/'/g, "\\'");
  const safeNotes = (task.notes || "").replace(/'/g, "\\'");

  const cardHTML = `
        <div class="subject-card" onclick="openInfo('${safeName}', '${safeInfo}', '${safePage}', '${safeNotes}', '${task.date}', '${task.image}')">
            <img src="${task.image}" class="subject-img">
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
        </div>
    `;
  container.innerHTML += cardHTML;
}

function loadTasks() {
  container.innerHTML = "";
  let tasks = JSON.parse(localStorage.getItem("schoolTasks")) || [];
  const selectedDate = mainDateFilter.value;

  const filteredTasks = tasks.filter((task) => {
    if (selectedDate === "") return true;
    return task.date === selectedDate;
  });

  filteredTasks.forEach((task) => renderCard(task));
}

function deleteTask(id) {
  if (confirm("Padam tugasan ini?")) {
    let tasks = JSON.parse(localStorage.getItem("schoolTasks")) || [];
    tasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("schoolTasks", JSON.stringify(tasks));
    loadTasks();
  }
}

function openInfo(name, info, page, notes, date, image) {
  const imgElement = document.getElementById("displayImage");
  if (imgElement) imgElement.src = image;

  document.getElementById("displaySubjek").innerText = name;
  document.getElementById("displayInfo").innerText = info || "Tiada maklumat";
  document.getElementById("displayPage").innerText = page || "-";
  document.getElementById("displayNotes").innerText =
    notes || "Tiada nota tambahan.";
  document.getElementById("displayDate").innerText = date;
  document.getElementById("infoModal").style.display = "block";
}

function closeInfoModal() {
  document.getElementById("infoModal").style.display = "none";
}

// Tambah fungsi baru ini di bawah sekali dalam script.js untuk simpan status baru
function updateStatus(id, newStatus) {
  let tasks = JSON.parse(localStorage.getItem("schoolTasks")) || [];
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex !== -1) {
    tasks[taskIndex].status = newStatus;
    localStorage.setItem("schoolTasks", JSON.stringify(tasks));
    loadTasks(); // Muat semula untuk kemaskini warna
  }
}
