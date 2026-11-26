const tasks = [];

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

export function getTasks() {
  return tasks;
}
