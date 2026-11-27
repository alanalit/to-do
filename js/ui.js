export function renderTasks(taskList, taskCount, filterCounts, tasks, activeFilter, editingTaskId) {
  taskList.replaceChildren();

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  let visibleTasks = tasks;

  if (activeFilter === "pending") {
    visibleTasks = pendingTasks;
  } else if (activeFilter === "completed") {
    visibleTasks = completedTasks;
  }

  filterCounts.all.textContent = String(tasks.length).padStart(2, "0");
  filterCounts.pending.textContent = String(pendingTasks.length).padStart(2, "0");
  filterCounts.completed.textContent = String(completedTasks.length).padStart(2, "0");

  if (visibleTasks.length === 0 && tasks.length === 0) {
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
  } else if (visibleTasks.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state filtered-empty-state";

    const emptyTitle = document.createElement("p");
    emptyTitle.className = "empty-title";
    emptyTitle.textContent = activeFilter === "pending" ? "Nenhuma tarefa pendente." : "Nenhuma tarefa concluída.";

    const emptyCopy = document.createElement("p");
    emptyCopy.className = "empty-copy";
    emptyCopy.textContent = "Escolha outro filtro para ver sua lista.";

    emptyState.append(emptyTitle, emptyCopy);
    taskList.append(emptyState);
  } else {
    visibleTasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.className = "task-item";
      listItem.classList.toggle("is-completed", task.completed);

      if (task.id === editingTaskId) {
        const editForm = document.createElement("form");
        editForm.className = "edit-task-form";
        editForm.dataset.taskEditForm = task.id;
        editForm.noValidate = true;

        const editLabel = document.createElement("label");
        editLabel.className = "visually-hidden";
        editLabel.htmlFor = `edit-task-${task.id}`;
        editLabel.textContent = `Editar tarefa: ${task.title}`;

        const editInput = document.createElement("input");
        editInput.className = "edit-task-input";
        editInput.id = `edit-task-${task.id}`;
        editInput.type = "text";
        editInput.value = task.title;
        editInput.dataset.taskEditInput = task.id;
        editInput.autocomplete = "off";
        editInput.required = true;
        editInput.setAttribute("aria-describedby", "form-feedback");

        const saveButton = document.createElement("button");
        saveButton.className = "edit-save";
        saveButton.type = "submit";
        saveButton.textContent = "Salvar";

        const cancelButton = document.createElement("button");
        cancelButton.className = "edit-cancel";
        cancelButton.type = "button";
        cancelButton.textContent = "Cancelar";
        cancelButton.dataset.taskEditCancel = task.id;

        editForm.append(editLabel, editInput, saveButton, cancelButton);
        listItem.append(editForm);
        taskList.append(listItem);
        return;
      }

      const taskToggle = document.createElement("input");
      taskToggle.className = "task-check";
      taskToggle.type = "checkbox";
      taskToggle.checked = task.completed;
      taskToggle.disabled = editingTaskId !== null;
      taskToggle.dataset.taskToggle = task.id;
      taskToggle.setAttribute(
        "aria-label",
        task.completed ? `Reabrir tarefa: ${task.title}` : `Marcar como concluída: ${task.title}`,
      );

      const taskTitle = document.createElement("span");
      taskTitle.className = "task-title";
      taskTitle.textContent = task.title;
      taskTitle.classList.toggle("task-title-completed", task.completed);

      const editButton = document.createElement("button");
      editButton.className = "edit-task";
      editButton.type = "button";
      editButton.textContent = "Editar";
      editButton.dataset.taskEdit = task.id;
      editButton.disabled = editingTaskId !== null;
      editButton.setAttribute("aria-label", `Editar tarefa: ${task.title}`);

      const removeButton = document.createElement("button");
      removeButton.className = "remove-task";
      removeButton.type = "button";
      removeButton.textContent = "Remover";
      removeButton.dataset.taskRemove = task.id;
      removeButton.disabled = editingTaskId !== null;
      removeButton.setAttribute("aria-label", `Remover tarefa: ${task.title}`);

      listItem.append(taskToggle, taskTitle, editButton, removeButton);
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

export function clearFeedback(element) {
  element.textContent = "";
  delete element.dataset.type;
}
