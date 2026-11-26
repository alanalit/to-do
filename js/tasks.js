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

export function getTasks() {
  return tasks;
}
