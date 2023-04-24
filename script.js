let listElement = document.querySelector("#app ul");
let inputElement = document.querySelector("#app input");
let buttonElement = document.querySelector("#app button");
let deleteAllButton = document.querySelector("#delete-all");
let filterButtons = document.querySelectorAll(".filter-button");

let tarefas = JSON.parse(localStorage.getItem("@listTarefas")) || [];

function renderTarefas(tasksToRender = tarefas) {
  listElement.innerHTML = "";

  tasksToRender.map((tarefa) => {
    let itemElement = document.createElement("li");
    //let itemText = document.createTextNode(tarefa.text + " (" +"" + tarefa.timestamp + ")");
    let itemText = document.createTextNode("" + tarefa.timestamp + " - " + tarefa.text);

    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", "#");

    let linkText = document.createTextNode("Excluir");
    linkElement.appendChild(linkText);

    linkElement.setAttribute("onclick", "deletarTarefa(" + tarefas.indexOf(tarefa) + ")");

    itemElement.addEventListener("click", () => toggleCompleted(tarefas.indexOf(tarefa)));
    if (tarefa.completed) {
      itemElement.classList.add("completed");
    }

    itemElement.appendChild(itemText);
    itemElement.appendChild(linkElement);
    listElement.appendChild(itemElement);
  });
}

renderTarefas();

function adicionarTarefa() {
  if (inputElement.value == "") {
    alert("Digite uma tarefa");
    return false;
  } else {
    console.log(inputElement.value);
  }
  let tarefaText = inputElement.value;
  let timestamp = new Date().toLocaleString();
  tarefas.push({ text: tarefaText, completed: false, timestamp: timestamp });
  inputElement.value = "";
  listElement.innerHTML = "";

  renderTarefas();
  salvarTarefas();
}

buttonElement.addEventListener("click", adicionarTarefa);

function deletarTarefa(index) {
  tarefas.splice(index, 1);
  renderTarefas();
  salvarTarefas();
}

function salvarTarefas() {
  localStorage.setItem("@listTarefas", JSON.stringify(tarefas));
}

function deleteAllTasks() {
  tarefas = [];
  renderTarefas();
  salvarTarefas();
}

deleteAllButton.addEventListener("click", deleteAllTasks);

function filterTasks(filter) {
  let filteredTasks = tarefas.filter((tarefa) => {
    if (filter === "all") return true;
    if (filter === "active") return !tarefa.completed;
    if (filter === "completed") return tarefa.completed;
  });

  renderTarefas(filteredTasks);
}

filterButtons.forEach((button) =>
  button.addEventListener("click", () => filterTasks(button.dataset.filter))
);

function toggleCompleted(index) {
  tarefas[index].completed = !tarefas[index].completed;
  renderTarefas();
  salvarTarefas();
}
