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

window.onclick = function (event) {
  if (event.target == modal) closeModal();
  if (event.target == document.getElementById("infoModal")) closeInfoModal();
};

function saveTask() {
  const nameInput = document.getElementById("subjekName").value;
  const taskDate = document.getElementById("taskDateInput").value;
  if (!nameInput || !taskDate) {
    alert("Sila isi Nama Subjek dan Tarikh!");
    return;
  }

  const processSave = (uploadedImageUrl) => {
    const newTask = {
      id: Date.now(),
      name: nameInput,
      info: document.getElementById("homeworkInfo").value || "",
      page: document.getElementById("pageNumber").value || "",
      notes: document.getElementById("extraNotes").value || "",
      date: taskDate,
      status: document.getElementById("statusSelect").value,
      image: uploadedImageUrl,
    };
    let tasks = JSON.parse(localStorage.getItem("schoolTasks")) || [];
    tasks.push(newTask);
    localStorage.setItem("schoolTasks", JSON.stringify(tasks));
    loadTasks();
    closeModal();
    // Reset Form
    document.getElementById("subjekName").value = "";
    document.getElementById("homeworkInfo").value = "";
    document.getElementById("pageNumber").value = "";
    document.getElementById("extraNotes").value = "";
  };

  const imageInput = document.getElementById("imageInput");
  if (imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = (e) => processSave(e.target.result);
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    processSave("");
  }
}

function renderCard(task) {
  const nameLower = task.name.toLowerCase().trim();
  const bookImg =
    subjectLibrary[nameLower] ||
    "https://via.placeholder.com/150x100?text=Subjek";
  const taskImg =
    task.image ||
    "https://via.placeholder.com/150x100?text=Tiada+Gambar+Latihan";

  const safeName = (task.name || "").replace(/'/g, "\\'");
  const safeInfo = (task.info || "").replace(/'/g, "\\'");
  const safePage = (task.page || "").replace(/'/g, "\\'");
  const safeNotes = (task.notes || "").replace(/'/g, "\\'");

  const cardHTML = `
        <div class="subject-card" onclick="openInfo('${safeName}', '${safeInfo}', '${safePage}', '${safeNotes}', '${task.date}', '${bookImg}', '${taskImg}')">
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
        </div>
    `;
  container.innerHTML += cardHTML;
}

function loadTasks() {
  container.innerHTML = "";
  let tasks = JSON.parse(localStorage.getItem("schoolTasks")) || [];
  const selectedDate = mainDateFilter.value;
  const filteredTasks = tasks.filter(
    (task) => selectedDate === "" || task.date === selectedDate,
  );
  filteredTasks.forEach((task) => renderCard(task));
}

function updateStatus(id, newStatus) {
  let tasks = JSON.parse(localStorage.getItem("schoolTasks")) || [];
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex].status = newStatus;
    localStorage.setItem("schoolTasks", JSON.stringify(tasks));
    loadTasks();
  }
}

function deleteTask(id) {
  if (confirm("Padam tugasan ini?")) {
    let tasks = JSON.parse(localStorage.getItem("schoolTasks")) || [];
    tasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("schoolTasks", JSON.stringify(tasks));
    loadTasks();
  }
}
