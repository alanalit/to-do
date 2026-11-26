const STORAGE_KEY = "todo.tasks.v1";

function isValidTask(task) {
  return (
    task !== null &&
    typeof task === "object" &&
    !Array.isArray(task) &&
    typeof task.id === "string" &&
    task.id.trim() !== "" &&
    typeof task.title === "string" &&
    task.title.trim() !== "" &&
    typeof task.completed === "boolean" &&
    typeof task.createdAt === "string" &&
    !Number.isNaN(Date.parse(task.createdAt)) &&
    new Date(task.createdAt).toISOString() === task.createdAt
  );
}

export function loadTasks() {
  let savedData;

  try {
    savedData = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return { tasks: [], message: "Não foi possível acessar o armazenamento deste navegador." };
  }

  if (savedData === null) {
    return { tasks: [], message: "" };
  }

  let parsedData;

  try {
    // O JSON salvo é convertido em dados e validado antes de entrar no estado do app.
    parsedData = JSON.parse(savedData);
  } catch {
    return { tasks: [], message: "Os dados salvos estavam inválidos e foram ignorados." };
  }

  if (!Array.isArray(parsedData)) {
    return { tasks: [], message: "Os dados salvos estavam em um formato inesperado e foram ignorados." };
  }

  const tasks = [];
  const usedIds = new Set();
  let ignoredInvalidTask = false;

  parsedData.forEach((task) => {
    if (!isValidTask(task) || usedIds.has(task.id)) {
      ignoredInvalidTask = true;
      return;
    }

    usedIds.add(task.id);
    tasks.push({ ...task, title: task.title.trim() });
  });

  return {
    tasks,
    message: ignoredInvalidTask ? "Algumas tarefas salvas estavam inválidas e foram ignoradas." : "",
  };
}

export function saveTasks(tasks) {
  try {
    // A coleção é serializada como JSON para ser armazenada no navegador.
    const serializedTasks = JSON.stringify(tasks);
    window.localStorage.setItem(STORAGE_KEY, serializedTasks);
    return { success: true, message: "" };
  } catch {
    return {
      success: false,
      message: "Não foi possível salvar as tarefas. O armazenamento pode estar indisponível ou cheio.",
    };
  }
}
