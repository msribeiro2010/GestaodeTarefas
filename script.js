// Inicialização do IndexedDB
let db;
let listElement = document.querySelector("#app ul");
let inputElement = document.querySelector("#app input");
let buttonElement = document.querySelector("#app button");
let deleteAllButton = document.querySelector("#delete-all");
let filterButtons = document.querySelectorAll(".filter-button");
let tarefas = [];

const request = indexedDB.open("tarefasDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("tarefas")) {
        db.createObjectStore("tarefas", { autoIncrement: true });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    carregarTarefas();
};

request.onerror = function (event) {
    console.log("Erro ao abrir DB", event);
};

function carregarTarefas() {
    tarefas = [];
    const transaction = db.transaction(["tarefas"], "readonly");
    const store = transaction.objectStore("tarefas");

    store.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            tarefas.push(cursor.value);
            cursor.continue();
        } else {
            renderTarefas();
        }
    };
}

function renderTarefas(tasksToRender = tarefas) {
    listElement.innerHTML = "";

    tasksToRender.map((tarefa) => {
        let itemElement = document.createElement("li");
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
 inputElement.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) { // 13 é o código da tecla Enter/Return
        adicionarTarefa();
    }
});


function adicionarTarefa() {
    if (inputElement.value === "") {
        alert("Digite uma tarefa");
        return;
    }
    let tarefaText = inputElement.value;
    let dateFormatter = new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    let timestamp = dateFormatter.format(new Date());

    tarefas.push({ text: tarefaText, completed: false, timestamp: timestamp });
    inputElement.value = "";
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
    const transaction = db.transaction(["tarefas"], "readwrite");
    const store = transaction.objectStore("tarefas");
    
    store.clear();
    tarefas.forEach(tarefa => {
        store.add(tarefa);
    });
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
