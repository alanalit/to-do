let tasks = [];

export function setTasks(savedTasks) {
  tasks = savedTasks;
}

export function addTask(title) {
  const task = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  return task;
}

export function toggleTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);

  if (task === undefined) {
    return null;
  }

  task.completed = !task.completed;
  return task;
}

export function updateTaskTitle(taskId, title) {
  const task = tasks.find((item) => item.id === taskId);

  if (task === undefined) {
    return null;
  }

  task.title = title.trim();
  return task;
}

export function removeTask(taskId) {
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return null;
  }

  return tasks.splice(taskIndex, 1)[0];
}

export function getTasks() {
  return tasks;
}
