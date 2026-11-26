import { addTask, getTasks } from "./tasks.js";
import { renderTasks, showFeedback } from "./ui.js";

const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const formFeedback = document.querySelector("#form-feedback");

renderTasks(taskList, taskCount, getTasks());

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
  showFeedback(formFeedback, "Tarefa adicionada à sua lista.", "success");
  taskTitleInput.focus();
});
