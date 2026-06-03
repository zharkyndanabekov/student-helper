document.addEventListener("DOMContentLoaded", () => {
    // === Регистрация Service Worker ===
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js")
            .then((reg) => console.log("SW зарегистрирован:", reg.scope))
            .catch((err) => console.error("Ошибка SW:", err));
    }


    // === Переключение экранов ===
    const navButtons = document.querySelectorAll(".bottom-nav button");
    const screens = document.querySelectorAll(".screen");
    const pageTitle = document.getElementById("page-title");

    // Названия для шапки приложения
    const titles = {
        home: "Главная",
        tasks: "Задачи",
        notes: "Заметки",
        grades: "Оценки",
        schedule: "Расписание"
    };

    function showScreen(screenId) {
        // Скрываем все экраны
        screens.forEach(s => s.classList.remove("active"));
        // Показываем выбранный
        document.getElementById(screenId).classList.add("active");

        // Обновляем активную кнопку
        navButtons.forEach(b => b.classList.remove("active"));
        document.querySelector(`.bottom-nav button[data-screen="${screenId}"]`)
            .classList.add("active");

        // Меняем заголовок в шапке
        pageTitle.textContent = titles[screenId];
    }

    // Привязываем обработчик к каждой кнопке
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const screenId = btn.dataset.screen;
            showScreen(screenId);
        });
    });

    // По умолчанию активен home
    showScreen("home");

    console.log("Навигация готова!");

    // === Раздел Задачи ===
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const taskStats = document.getElementById("task-stats");

    function loadTasks() {
        const saved = localStorage.getItem("tasks");
        if (!saved) return [];
        try { return JSON.parse(saved); }
        catch { return []; }
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Если в localStorage старые задачи в виде строк — конвертируем
    let tasks = loadTasks().map(t => {
        if (typeof t === "string") {
            return { id: Date.now() + Math.random(), title: t, done: false };
        }
        return t;
    });
    saveTasks();   // сохраняем уже в новом формате

    function renderTasks() {
        if (tasks.length === 0) {
            taskList.innerHTML = '<p style="color:#999;">Нет задач</p>';
            return;
        }
        const html = tasks.map(t => `
      <div class="card">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="${t.done ? 'text-decoration:line-through; color:#999;' : ''}">
            ${t.title}
          </span>
        </div>
        <small style="color:#999;">
          ID: ${Math.floor(t.id)} | ${t.done ? 'Выполнено' : 'Активная'}
        </small>
      </div>
    `).join("");
        taskList.innerHTML = html;
    }

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (!text) return;

        const newTask = {
            id: Date.now(),         // используем время как уникальный id
            title: text,
            done: false
        };

        tasks.push(newTask);
        saveTasks();
        taskInput.value = "";
        renderTasks();
    });

    function renderTasks() {
        if (tasks.length === 0) {
            taskList.innerHTML = '<p style="color:#999;">Нет задач</p>';
            return;
        }
        const html = tasks.map(t => `
      <div class="card" style="display:flex; align-items:center; gap:12px;">
        <input
          type="checkbox"
          data-id="${t.id}"
          class="task-check"
          ${t.done ? 'checked' : ''}
          style="width:24px; height:24px;">
        <span style="flex:1; ${t.done ? 'text-decoration:line-through; color:#999;' : ''}">
          ${t.title}
        </span>
        <button
          data-id="${t.id}"
          class="task-delete"
          style="background:#dc2626; color:white; border:none;
                 padding:6px 12px; border-radius:6px; cursor:pointer;">
          ✕
        </button>
      </div>
    `).join("");
        taskList.innerHTML = html;
    }

    // Event delegation: один обработчик на весь список
    taskList.addEventListener("click", (e) => {
        // Клик по чекбоксу
        if (e.target.classList.contains("task-check")) {
            const id = Number(e.target.dataset.id);
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.done = e.target.checked;
                saveTasks();
                renderTasks();
            }
        }

        // Клик по кнопке удаления
        if (e.target.classList.contains("task-delete")) {
            const id = Number(e.target.dataset.id);
            if (confirm("Удалить эту задачу?")) {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                renderTasks();
            }
        }
    });
    let currentFilter = "all";

    function getFilteredTasks() {
        if (currentFilter === "active") return tasks.filter(t => !t.done);
        if (currentFilter === "done") return tasks.filter(t => t.done);
        return tasks;
    }

    function renderTasks() {
        const filtered = getFilteredTasks();

        // Обновляем счётчик
        const total = tasks.length;
        const done = tasks.filter(t => t.done).length;
        taskStats.textContent =
            `Всего: ${total} | Выполнено: ${done} | Осталось: ${total - done}`;

        if (filtered.length === 0) {
            taskList.innerHTML = '<p style="color:#999;">Нет задач в этой категории</p>';
            return;
        }
        const html = filtered.map(t => `
      <div class="card" style="display:flex; align-items:center; gap:12px;">
        <input type="checkbox" data-id="${t.id}" class="task-check"
          ${t.done ? 'checked' : ''} style="width:24px; height:24px;">
        <span style="flex:1; ${t.done ? 'text-decoration:line-through; color:#999;' : ''}">
          ${t.title}
        </span>
        <button data-id="${t.id}" class="task-delete"
          style="background:#dc2626; color:white; border:none;
                 padding:6px 12px; border-radius:6px; cursor:pointer;">✕</button>
      </div>
    `).join("");
        taskList.innerHTML = html;
    }

    // Обработчики кнопок-фильтров
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn")
                .forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // === Раздел Заметки ===
    const noteForm = document.getElementById("note-form");
    const noteTitle = document.getElementById("note-title");
    const noteContent = document.getElementById("note-content");
    const noteList = document.getElementById("note-list");

    function loadNotes() {
        const saved = localStorage.getItem("notes");
        if (!saved) return [];
        try { return JSON.parse(saved); }
        catch { return []; }
    }

    function saveNotes() {
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    let notes = loadNotes();

    function formatDate(timestamp) {
        const d = new Date(timestamp);
        return d.toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function renderNotes() {
        if (notes.length === 0) {
            noteList.innerHTML = '<p style="color:#999;">Нет заметок</p>';
            return;
        }
        // Сортируем по дате — новые сверху
        const sorted = [...notes].sort((a, b) => b.createdAt - a.createdAt);

        const html = sorted.map(n => `
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:start;">
          <h3 style="font-size:1.05rem;">${n.title}</h3>
          <button
            data-id="${n.id}"
            class="note-delete"
            style="background:none; border:none; color:#dc2626;
                   font-size:1.2rem; cursor:pointer;">×</button>
        </div>
        <p style="margin:8px 0; white-space:pre-wrap;">${n.content}</p>
        <small style="color:#999;">${formatDate(n.createdAt)}</small>
      </div>
    `).join("");
        noteList.innerHTML = html;
    }

    noteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();
        if (!title || !content) return;

        notes.push({
            id: Date.now(),
            title: title,
            content: content,
            createdAt: Date.now()
        });
        saveNotes();
        noteForm.reset();
        renderNotes();
    });

    noteList.addEventListener("click", (e) => {
        if (e.target.classList.contains("note-delete")) {
            const id = Number(e.target.dataset.id);
            if (confirm("Удалить заметку?")) {
                notes = notes.filter(n => n.id !== id);
                saveNotes();
                renderNotes();
            }
        }
    });

    renderNotes();



    // === Раздел Оценки ===
    const gradeForm = document.getElementById("grade-form");
    const gradeSubject = document.getElementById("grade-subject");
    const gradeValue = document.getElementById("grade-value");
    const gradeList = document.getElementById("grade-list");
    const gradeSummary = document.getElementById("grade-summary");

    function loadGrades() {
        const saved = localStorage.getItem("grades");
        if (!saved) return [];
        try { return JSON.parse(saved); }
        catch { return []; }
    }

    function saveGrades() {
        localStorage.setItem("grades", JSON.stringify(grades));
    }

    let grades = loadGrades();

    function calculateAverages() {
        // Группируем оценки по предмету
        const grouped = {};
        grades.forEach(g => {
            if (!grouped[g.subject]) grouped[g.subject] = [];
            grouped[g.subject].push(g.value);
        });

        // Считаем средний балл по каждому предмету
        const averages = {};
        let totalSum = 0, totalCount = 0;
        for (const subject in grouped) {
            const sum = grouped[subject].reduce((a, b) => a + b, 0);
            averages[subject] = (sum / grouped[subject].length).toFixed(2);
            totalSum += sum;
            totalCount += grouped[subject].length;
        }
        const overall = totalCount > 0 ? (totalSum / totalCount).toFixed(2) : "0";

        return { grouped, averages, overall };
    }

    function renderGrades() {
        if (grades.length === 0) {
            gradeSummary.innerHTML = '';
            gradeList.innerHTML = '<p style="color:#999;">Нет оценок</p>';
            return;
        }

        const { grouped, averages, overall } = calculateAverages();

        // Общий итог
        gradeSummary.innerHTML = `
      <div class="card" style="background:var(--primary-color); color:white;">
        <div style="font-size:0.9rem; opacity:0.85;">Общий средний балл</div>
        <div style="font-size:2.2rem; font-weight:bold;">${overall}</div>
      </div>
    `;

        // Карточки по предметам
        const html = Object.keys(grouped).map(subject => {
            const valuesText = grouped[subject].join(", ");
            return `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>${subject}</h3>
            <span style="font-size:1.6rem; font-weight:bold; color:var(--primary-color);">
              ${averages[subject]}
            </span>
          </div>
          <small style="color:#999;">Оценки: ${valuesText}</small>
        </div>
      `;
        }).join("");
        gradeList.innerHTML = html;
    }

    gradeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const subject = gradeSubject.value.trim();
        const value = Number(gradeValue.value);
        if (!subject || !value) return;

        grades.push({
            id: Date.now(),
            subject: subject,
            value: value
        });
        saveGrades();
        gradeForm.reset();
        renderGrades();
    });

    renderGrades();



    // === Раздел Расписание ===
    const dayTabs = document.getElementById("day-tabs");
    const lessonForm = document.getElementById("lesson-form");
    const lessonTime = document.getElementById("lesson-time");
    const lessonSubject = document.getElementById("lesson-subject");
    const lessonRoom = document.getElementById("lesson-room");
    const lessonList = document.getElementById("lesson-list");

    const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    // JS: getDay() возвращает 0 для воскресенья
    const todayIndex = (new Date().getDay() + 6) % 7;  // переводим в 0=Пн
    let selectedDay = Math.min(todayIndex, 5);   // если воскресенье — Сб

    function loadSchedule() {
        const saved = localStorage.getItem("schedule");
        if (!saved) return {};
        try { return JSON.parse(saved); }
        catch { return {}; }
    }

    function saveSchedule() {
        localStorage.setItem("schedule", JSON.stringify(schedule));
    }

    let schedule = loadSchedule();   // объект: ключ — день, значение — массив пар

    function renderDayTabs() {
        dayTabs.innerHTML = days.map((d, i) => {
            const classes = ["day-tab"];
            if (i === selectedDay) classes.push("active");
            if (i === todayIndex) classes.push("today");
            return `<button class="${classes.join(" ")}" data-day="${i}">${d}</button>`;
        }).join("");
    }

    function renderLessons() {
        const dayKey = days[selectedDay];
        const lessons = schedule[dayKey] || [];

        if (lessons.length === 0) {
            lessonList.innerHTML = '<p style="color:#999;">Пар нет</p>';
            return;
        }

        // Сортируем по времени
        const sorted = [...lessons].sort((a, b) => a.time.localeCompare(b.time));

        lessonList.innerHTML = sorted.map(l => `
      <div class="card" style="display:flex; align-items:center; gap:12px;">
        <div style="background:var(--primary-color); color:white;
                    padding:8px 12px; border-radius:8px;
                    font-weight:bold; font-size:1rem;">
          ${l.time}
        </div>
        <div style="flex:1;">
          <div style="font-weight:600;">${l.subject}</div>
          ${l.room ? `<small style="color:#999;">Ауд. ${l.room}</small>` : ''}
        </div>
        <button data-id="${l.id}" class="lesson-delete"
          style="background:none; border:none; color:#dc2626;
                 font-size:1.4rem; cursor:pointer;">×</button>
      </div>
    `).join("");
    }

    dayTabs.addEventListener("click", (e) => {
        if (e.target.classList.contains("day-tab")) {
            selectedDay = Number(e.target.dataset.day);
            renderDayTabs();
            renderLessons();
        }
    });

    lessonForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const time = lessonTime.value;
        const subject = lessonSubject.value.trim();
        const room = lessonRoom.value.trim();
        if (!time || !subject) return;

        const dayKey = days[selectedDay];
        if (!schedule[dayKey]) schedule[dayKey] = [];
        schedule[dayKey].push({
            id: Date.now(),
            time: time,
            subject: subject,
            room: room
        });
        saveSchedule();
        lessonForm.reset();
        renderLessons();
    });

    lessonList.addEventListener("click", (e) => {
        if (e.target.classList.contains("lesson-delete")) {
            const id = Number(e.target.dataset.id);
            const dayKey = days[selectedDay];
            schedule[dayKey] = schedule[dayKey].filter(l => l.id !== id);
            saveSchedule();
            renderLessons();
        }
    });

    renderDayTabs();
    renderLessons();



    // === Раздел Главная ===
    const themeToggle = document.getElementById("theme-toggle");
    const homeStats = document.getElementById("home-stats");
    const resetBtn = document.getElementById("reset-btn");

    // Загрузка темы при старте
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeToggle.checked = true;
    }

    themeToggle.addEventListener("change", () => {
        if (themeToggle.checked) {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    });

    function updateHomeStats() {
        const tasksData = JSON.parse(localStorage.getItem("tasks") || "[]");
        const notesData = JSON.parse(localStorage.getItem("notes") || "[]");
        const gradesData = JSON.parse(localStorage.getItem("grades") || "[]");

        const activeTasks = tasksData.filter(t => !t.done).length;
        const doneTasks = tasksData.filter(t => t.done).length;

        homeStats.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <div style="color:var(--text-muted);">Активных задач</div>
          <div style="font-size:1.5rem; font-weight:bold;">${activeTasks}</div>
        </div>
        <div>
          <div style="color:var(--text-muted);">Выполнено</div>
          <div style="font-size:1.5rem; font-weight:bold;">${doneTasks}</div>
        </div>
        <div>
          <div style="color:var(--text-muted);">Заметок</div>
          <div style="font-size:1.5rem; font-weight:bold;">${notesData.length}</div>
        </div>
        <div>
          <div style="color:var(--text-muted);">Оценок</div>
          <div style="font-size:1.5rem; font-weight:bold;">${gradesData.length}</div>
        </div>
      </div>
    `;
    }

    resetBtn.addEventListener("click", () => {
        if (confirm("Удалить ВСЕ данные приложения? Это нельзя отменить.")) {
            localStorage.clear();
            location.reload();
        }
    });

    // Обновляем сводку при переключении на главную
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.dataset.screen === "home") updateHomeStats();
        });
    });

    updateHomeStats();

});
