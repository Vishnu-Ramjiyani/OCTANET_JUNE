// script.js
document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('button').addEventListener('click', addTask);
});

function addTask() {
    let taskInput = document.getElementById('new-task');
    let taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    let taskList = document.getElementById('task-list');

    let li = document.createElement('li');
    li.textContent = taskText;

    let removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => {
        taskList.removeChild(li);
    };

    li.appendChild(removeButton);
    taskList.appendChild(li);

    taskInput.value = '';

    // Show success message
    let message = document.getElementById('message');
    message.classList.remove('hidden');

    // Hide success message after 2 seconds
    setTimeout(() => {
        message.classList.add('hidden');
    }, 2000);
}
