import { loadTasks, saveTasks } from "./storage.js";
import { addTask, getTasks, removeTask, setTasks, toggleTask, updateTaskTitle } from "./tasks.js";
import { clearFeedback, renderTasks, showFeedback } from "./ui.js";

const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const addTaskButton = taskForm.querySelector("button[type='submit']");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const formFeedback = document.querySelector("#form-feedback");
const taskFilters = document.querySelector("#task-filters");
const filterCounts = {
  all: document.querySelector("#count-all"),
  pending: document.querySelector("#count-pending"),
  completed: document.querySelector("#count-completed"),
};
let activeFilter = "all";
let editingTaskId = null;

function renderCurrentTasks() {
  renderTasks(taskList, taskCount, filterCounts, getTasks(), activeFilter, editingTaskId);
}

function selectFilter(filterName) {
  activeFilter = filterName;
  taskFilters.querySelectorAll("[data-filter]").forEach((filterButton) => {
    filterButton.setAttribute("aria-pressed", String(filterButton.dataset.filter === activeFilter));
  });
}

function setEditorMode(isEditing) {
  taskTitleInput.disabled = isEditing;
  addTaskButton.disabled = isEditing;
  taskFilters.querySelectorAll("[data-filter]").forEach((filterButton) => {
    filterButton.disabled = isEditing;
  });
}

const savedTasks = loadTasks();
setTasks(savedTasks.tasks);
renderCurrentTasks();

if (savedTasks.message !== "") {
  showFeedback(formFeedback, savedTasks.message, "error");
}

// O envio do formulário valida o texto e atualiza a lista sem recarregar a página.
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();

  if (title === "") {
    taskTitleInput.setAttribute("aria-invalid", "true");
    showFeedback(formFeedback, "Digite uma tarefa antes de adicionar.", "error");
    taskTitleInput.focus();
    return;
  }

  taskTitleInput.removeAttribute("aria-invalid");
  const addedTask = addTask(title);
  if (addedTask === null) {
    taskTitleInput.setAttribute("aria-invalid", "true");
    showFeedback(formFeedback, "Digite uma tarefa antes de adicionar.", "error");
    taskTitleInput.focus();
    return;
  }

  selectFilter("all");
  renderCurrentTasks();
  taskForm.reset();

  const saveResult = saveTasks(getTasks());
  if (saveResult.success) {
    showFeedback(formFeedback, "Tarefa adicionada à sua lista.", "success");
  } else {
    showFeedback(formFeedback, saveResult.message, "error");
  }

  taskTitleInput.focus();
});

taskTitleInput.addEventListener("input", () => {
  if (taskTitleInput.value.trim() !== "" && taskTitleInput.getAttribute("aria-invalid") === "true") {
    taskTitleInput.removeAttribute("aria-invalid");
    clearFeedback(formFeedback);
  }
});

taskList.addEventListener("change", (event) => {
  const taskToggle = event.target.closest("[data-task-toggle]");

  if (taskToggle === null) {
    return;
  }

  const task = toggleTask(taskToggle.dataset.taskToggle);
  if (task === null) {
    return;
  }

  renderCurrentTasks();

  const saveResult = saveTasks(getTasks());
  if (saveResult.success) {
    const message = task.completed ? "Tarefa marcada como concluída." : "Tarefa reaberta.";
    showFeedback(formFeedback, message, "success");
  } else {
    showFeedback(formFeedback, saveResult.message, "error");
  }

  const visibleToggle = Array.from(taskList.querySelectorAll("[data-task-toggle]"))
    .find((toggle) => toggle.dataset.taskToggle === task.id);
  if (visibleToggle !== undefined) {
    visibleToggle.focus();
  } else {
    taskFilters.querySelector(`[data-filter="${activeFilter}"]`).focus();
  }
});

taskList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-task-edit]");
  if (editButton !== null) {
    editingTaskId = editButton.dataset.taskEdit;
    setEditorMode(true);
    clearFeedback(formFeedback);
    renderCurrentTasks();
    const editInput = Array.from(taskList.querySelectorAll("[data-task-edit-input]"))
      .find((input) => input.dataset.taskEditInput === editingTaskId);
    editInput?.focus();
    return;
  }

  const cancelButton = event.target.closest("[data-task-edit-cancel]");
  if (cancelButton !== null) {
    const canceledTaskId = cancelButton.dataset.taskEditCancel;
    editingTaskId = null;
    setEditorMode(false);
    clearFeedback(formFeedback);
    renderCurrentTasks();
    const taskEditButton = Array.from(taskList.querySelectorAll("[data-task-edit]"))
      .find((button) => button.dataset.taskEdit === canceledTaskId);
    taskEditButton?.focus();
    return;
  }

  const removeButton = event.target.closest("[data-task-remove]");

  if (removeButton === null) {
    return;
  }

  const removedTask = removeTask(removeButton.dataset.taskRemove);
  if (removedTask === null) {
    return;
  }

  renderCurrentTasks();

  const saveResult = saveTasks(getTasks());
  if (saveResult.success) {
    showFeedback(formFeedback, `Tarefa removida: ${removedTask.title}`, "success");
  } else {
    showFeedback(formFeedback, saveResult.message, "error");
  }

  taskTitleInput.focus();
});

taskList.addEventListener("submit", (event) => {
  const editForm = event.target.closest("[data-task-edit-form]");
  if (editForm === null) {
    return;
  }

  event.preventDefault();

  const editInput = editForm.querySelector("[data-task-edit-input]");
  const title = editInput.value.trim();
  if (title === "") {
    editInput.setAttribute("aria-invalid", "true");
    showFeedback(formFeedback, "O título da tarefa não pode ficar vazio.", "error");
    editInput.focus();
    return;
  }

  editInput.removeAttribute("aria-invalid");
  const updatedTask = updateTaskTitle(editForm.dataset.taskEditForm, title);
  if (updatedTask === null) {
    editingTaskId = null;
    setEditorMode(false);
    renderCurrentTasks();
    showFeedback(formFeedback, "Não foi possível localizar essa tarefa para editar.", "error");
    return;
  }

  editingTaskId = null;
  setEditorMode(false);
  renderCurrentTasks();

  const saveResult = saveTasks(getTasks());
  if (saveResult.success) {
    showFeedback(formFeedback, "Tarefa atualizada.", "success");
  } else {
    showFeedback(formFeedback, saveResult.message, "error");
  }

  const taskEditButton = Array.from(taskList.querySelectorAll("[data-task-edit]"))
    .find((button) => button.dataset.taskEdit === updatedTask.id);
  taskEditButton?.focus();
});

taskList.addEventListener("input", (event) => {
  const editInput = event.target.closest("[data-task-edit-input]");

  if (editInput !== null && editInput.value.trim() !== "" && editInput.getAttribute("aria-invalid") === "true") {
    editInput.removeAttribute("aria-invalid");
    clearFeedback(formFeedback);
  }
});

taskFilters.addEventListener("click", (event) => {
  const selectedFilter = event.target.closest("[data-filter]");

  if (selectedFilter === null) {
    return;
  }

  selectFilter(selectedFilter.dataset.filter);
  renderCurrentTasks();
});
