let todoItems = [];
const todoInput = document.querySelector("[data-todo-input]");
const addBtn = document.querySelector("[data-todo-add]");
const completedTodosList = document.querySelector("[data-completed-todos]");
const uncompletedTodosList = document.querySelector("[data-uncompleted-todos]");

window.addEventListener("DOMContentLoaded", () => {
    let storageTodoItems = localStorage.getItem("todoItems");
    if (storageTodoItems !== null) {
        todoItems = JSON.parse(storageTodoItems);
    }
    render();
})

todoInput.addEventListener("keyup", (e) => {
    let value = e.target.value.replace(/^\s+/, "");
    if (e.keyCode === 13 && value !== "") {
        addTodo(value);
        todoInput.value = "";
        todoInput.focus();
    }
})

addBtn.addEventListener("click", () => {
    if (todoInput.value !== "") {
        addTodo(todoInput.value);
    }
    todoInput.value = "";
    todoInput.focus();
})

function addTodo(text) {
    todoItems.push({
        id: Date.now(),
        text: text,
        completed: false
    });
    saveAndRender();
}

function removeTodo(id) {
    todoItems = todoItems.filter(item => item.id !== id);
    saveAndRender();
}

function markAsDone(id) {
    todoItems = todoItems.map(item => {
        if (item.id === id) {
            item.completed = true;
        }
        return item;
    });
    saveAndRender();
}

function markAsUncompleted(id) {
    todoItems = todoItems.map(item => {
        if (item.id === id) {
            item.completed = false;
        }
        return item;
    });
    saveAndRender();
}

function save() {
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

function render() {
    let uncompletedTodos = todoItems.filter(todo => !todo.completed);
    let completedTodos = todoItems.filter(todo => todo.completed);
    uncompletedTodosList.innerHTML = "";
    completedTodosList.innerHTML = "";
    if (uncompletedTodos.length > 0) {
        uncompletedTodos.forEach(todo => {
            uncompletedTodosList.appendChild(createTodoItem(todo));
        })
    } else {
        uncompletedTodosList.innerHTML = `<div>No uncompleted todos</div>`;
    }
    if (completedTodos.length > 0) {
        completedTodos.forEach(todo => {
            completedTodosList.innerHTML = `<div>Completed (${completedTodos.length} / ${todoItems.length})</div>`;
            completedTodos.forEach(todo => {
                completedTodosList.appendChild(createTodoItem(todo));
            })
        })
    } else {
        completedTodosList.innerHTML = `<div>No completed todos</div>`;
    }
}

function saveAndRender() {
    save();
    render();
}

function createTodoItem(todo) {
    const todoItem = document.createElement("li");
    todoItem.className = "flex items-center bg-white rounded-md mt-2 py-3 pl-2 pr-3 gap-1 transition-all";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "w-5 h-5 accent-green-500 cursor-pointer";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("click", (e) => {
        todo.completed = e.target.checked;
        saveAndRender();
    })
    const span = document.createElement("span");
    span.className = "mr-auto max-w-[420px] text-black text-lg overflow-hidden whitespace-nowrap text-ellipsis";
    span.textContent = todo.text;
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "text-red-500 hover:scale-110 transition-transform group";
    deleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentcolor" class="w-6 aspect-square"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>
    `;
    deleteBtn.addEventListener("click", () => {
        removeTodo(todo.id);
    })
    todoItem.append(checkbox);
    todoItem.append(span);
    todoItem.append(deleteBtn);
    return todoItem;
}