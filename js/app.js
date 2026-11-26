import { loadTasks, saveTasks } from "./storage.js";
import { addTask, getTasks, setTasks } from "./tasks.js";
import { renderTasks, showFeedback } from "./ui.js";

const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const formFeedback = document.querySelector("#form-feedback");

const savedTasks = loadTasks();
setTasks(savedTasks.tasks);
renderTasks(taskList, taskCount, getTasks());

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
  renderTasks(taskList, taskCount, getTasks());
  taskForm.reset();

  const saveResult = saveTasks(getTasks());
  if (saveResult.success) {
    showFeedback(formFeedback, "Tarefa adicionada à sua lista.", "success");
  } else {
    showFeedback(formFeedback, saveResult.message, "error");
  }

  taskTitleInput.focus();
});
