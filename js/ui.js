export function renderTasks(taskList, taskCount, tasks) {
  taskList.replaceChildren();

  if (tasks.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
      <span class="empty-illustration" aria-hidden="true">
        <span class="sun"></span><span class="empty-paper"><i></i><i></i><i></i></span><span class="empty-spark">✦</span>
      </span>
      <p class="empty-title">Tudo começa com organização.</p>
      <p class="empty-copy">Adicione sua primeira tarefa.</p>
    `;
    taskList.append(emptyState);
  } else {
    tasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.className = "task-item";
      listItem.classList.toggle("is-completed", task.completed);

      const taskToggle = document.createElement("input");
      taskToggle.className = "task-check";
      taskToggle.type = "checkbox";
      taskToggle.checked = task.completed;
      taskToggle.dataset.taskToggle = task.id;
      taskToggle.setAttribute(
        "aria-label",
        task.completed ? `Reabrir tarefa: ${task.title}` : `Marcar como concluída: ${task.title}`,
      );

      const taskTitle = document.createElement("span");
      taskTitle.className = "task-title";
      taskTitle.textContent = task.title;
      taskTitle.classList.toggle("task-title-completed", task.completed);

      listItem.append(taskToggle, taskTitle);
      taskList.append(listItem);
    });
  }

  taskCount.textContent = String(tasks.length).padStart(2, "0");
  taskCount.setAttribute("aria-label", `${tasks.length} ${tasks.length === 1 ? "tarefa" : "tarefas"}`);
}

export function showFeedback(element, message, type) {
  element.textContent = message;
  element.dataset.type = type;
}
