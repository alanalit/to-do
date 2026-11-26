import { loadTasks, saveTasks } from "./storage.js";
import { addTask, getTasks, removeTask, setTasks, toggleTask, updateTaskTitle } from "./tasks.js";
import { renderTasks, showFeedback } from "./ui.js";

const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
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
    showFeedback(formFeedback, "Digite uma tarefa antes de adicionar.", "error");
    taskTitleInput.focus();
    return;
  }

  addTask(title);
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
    showFeedback(formFeedback, "O título da tarefa não pode ficar vazio.", "error");
    editInput.focus();
    return;
  }

  const updatedTask = updateTaskTitle(editForm.dataset.taskEditForm, title);
  if (updatedTask === null) {
    return;
  }

  editingTaskId = null;
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

taskFilters.addEventListener("click", (event) => {
  const selectedFilter = event.target.closest("[data-filter]");

  if (selectedFilter === null) {
    return;
  }

  selectFilter(selectedFilter.dataset.filter);
  renderCurrentTasks();
});
