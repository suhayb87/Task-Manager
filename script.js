document.addEventListener("DOMContentLoaded", () => {
    // Load tasks from tasks from localStorage on page load
    loadTasks();

    document.querySelector("form").onsubmit = () => {
        const task = document.getElementById('task').value;
        addTaskToDom(task);
        saveTaskToLOcalStorage(task);
        document.getElementById('task').value = "";
        //    document.getElementById('tasks').innerHTML = `<li> ${task} <span><button id="done">Done</button> <button id="delete">Delete</button></span`;
        return false;
    }

    // Function to add task  to the DOM
    function addTaskToDom(task, isDone = false) {
        const taskList = document.getElementById("tasks");
        const li = document.createElement('li');
        li.classList.toggle('done', isDone); // Add 'done' class if teh task is marked as done
        li.innerHTML = ` ${task} <span><button id="done">Done</button> <button id="delete">Delete</button></span`;

        li.querySelector("#done").addEventListener('click', () => {
            li.classList.toggle('done');
            updateTaskInLocalStorage(task, li.classList.contains('done'));
        });

        li.querySelector("#delete").addEventListener('click', () => {
            li.remove();
            deleteTaskFromLocalStorage(task);
        });

        taskList.append(li);
    }

    // Save task to localstorage
    function saveTaskToLOcalStorage(task){
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ task, isDone: false});
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load task form localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(({task, isDone}) => {
            addTaskToDom(task, isDone)// 
        })
    }

    // Delete tast from localStorage
    function deleteTaskFromLocalStorage(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(t => task !== task);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    // Remove the "done" class after 24 hours
    setInterval(() => {
        const now = Date.now();
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.map(({ task, isDone, time, timestamp }) => {
            if (isDone && (now - timestamp) > 24 * 60 * 60 * 1000){
                isDone = false;
            }
            return {task, isDone };
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        // Reload tasks to reflect changes
        document.getElementById('tasks').innerHTML = ''// clear the current taks list
        loadTasks(); // Reload tasks from localstorage
    }, 1000 * 60 * 60);

});




