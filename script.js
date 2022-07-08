'use strict';

const containerAllTask = document.querySelector('.all-task-list');
const containerActiveTask = document.querySelector('.active-task-list');
const containerCompletedTask = document.querySelector('.completed-task-list');
const inputBar = document.querySelector('.inputBar');
const inputBox = document.getElementById('inputBox');
const btnAdd = document.querySelector('.add');
const btnSearch = document.querySelector('.search');
const selectAction = document.getElementById('action');
const selectSort = document.getElementById('sort');
const chkAll = document.getElementById('all');
const chkActive = document.getElementById('active');
const chkCompleted = document.getElementById('completed');
const box = document.getElementsByName('editTask');
const tasks = [];
let generateId = 0;
let activeBtn;
let editTaskFlag = false;
let editTaskID = 0;
let editFromBox;
let currentOpt = 0;
let sortOpt = 0;
let selectOpt = 0;

//colors
const allTaskColor = '#cdbdf4';
const activeTaskColor = '#bdf4cd';
const completedTaskColor = '#f4cdbd';
   
const filterBtn = document.getElementById('filter-opt');
const options = document.querySelector('.more-options');
const filterBtnDone = document.getElementById('filter-done');
const filterBtnCancel = document.getElementById('filter-cancel');
const filterBtnReset = document.getElementById('filter-reset');
const showAll = document.getElementById('showAll');
const hideAll = document.getElementById('hideAll');
const showActive = document.getElementById('showActive');
const hideActive = document.getElementById('hideActive');
const showCompleted = document.getElementById('showCompleted');
const hideCompleted = document.getElementById('hideCompleted');

filterBtn.addEventListener('click', () => {
    editTaskFlag = false;
    options.style.display = 'flex';
});

showAll.addEventListener('click', () => {
    editTaskFlag = false;
    containerAllTask.style.display = 'flex';
    containerAllTask.style.flexDirection = 'column';
    hideAll.style.display = 'block';
    showAll.style.display = 'none';
});
hideAll.addEventListener('click', () => {
    editTaskFlag = false;
    containerAllTask.style.display = 'none';
    hideAll.style.display = 'none';
    showAll.style.display = 'block';
});  

showActive.addEventListener('click', () => {
    editTaskFlag = false;
    containerActiveTask.style.display = 'flex';
    containerActiveTask.style.flexDirection = 'column';
    hideActive.style.display = 'block';
    showActive.style.display = 'none';
});

hideActive.addEventListener('click', () => {
    editTaskFlag = false;
    containerActiveTask.style.display = 'none';
    hideActive.style.display = 'none';
    showActive.style.display = 'block';
}); 

showCompleted.addEventListener('click', () => {
    editTaskFlag = false;
    containerCompletedTask.style.display = 'flex';
    containerCompletedTask.style.flexDirection = 'column';
    hideCompleted.style.display = 'block';
    showCompleted.style.display = 'none';
});

hideCompleted.addEventListener('click', () => {
    editTaskFlag = false;
    containerCompletedTask.style.display = 'none';
    hideCompleted.style.display = 'none';
    showCompleted.style.display = 'block';
}); 


const displayTasks = function (tasks) {
    containerAllTask.innerHTML = containerActiveTask.innerHTML = containerCompletedTask.innerHTML = '';
    if (tasks.length === 0) {
        const html = `
        <div class="list-row">
            <div class="noData">
                No Task !
            </div>
        </div>`;
        containerAllTask.insertAdjacentHTML('afterbegin', html);
        containerActiveTask.insertAdjacentHTML('afterbegin', html);
        containerCompletedTask.insertAdjacentHTML('afterbegin', html);
    }
    else {
        tasks.forEach((task) => {
            const html = `
                    <div class="list-row" style="background-color: ${ task.completed? completedTaskColor : activeTaskColor}">
                        <div class="task-details"> 
                            <div class="task-title">
                            </div>
                            <div class="task-desc">
                                ${editTaskFlag && editTaskID === task.id ? 
                                `<textarea maxlength ="200" onkeypress="editing(event)" name="editTask" id="editTask" rows="3">${task.title}</textarea>
                                </div>
                                <div class="data-length"> 5/200 </div>`
                                : task.title + '</div>'
                                }                           
                            
                        </div>
                        <div class="list-bottom">
                            <div class="task-activation">
                                <label class="switch">
                                    <input type="checkbox" name="activechk" id="activechk" onclick="tickComplete(${task.id})" ${task.completed? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="item-controls">
                                <button onclick="editTask(${task.id},0,1)"><img src="images/edit.svg" alt="Edit" ></button>
                                <button onclick="deleteTask(${task.id})"><img src="images/del.svg" alt="Delete" ></button>
                            </div>
                        </div>
                    </div>`;

                    const html1 = `
                    <div class="list-row" style="background-color: ${ task.completed? completedTaskColor : activeTaskColor}">
                        <div class="task-details"> 
                            <div class="task-title">
                            </div>
                            <div class="task-desc">
                                ${editTaskFlag && editTaskID === task.id ? 
                                `<textarea maxlength ="200" onkeypress="editing(event)" name="editTask" id="editTask" rows="3">${task.title}</textarea>
                                </div>
                                <div class="data-length"> 5/200 </div>`
                                : task.title + '</div>'
                                }                           
                            
                        </div>
                        <div class="list-bottom">
                            <div class="task-activation">
                                <label class="switch">
                                    <input type="checkbox" name="activechk" id="activechk" onclick="tickComplete(${task.id})" ${task.completed? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="item-controls">
                                <button onclick="editTask(${task.id},1,0)"><img src="images/edit.svg" alt="Edit" ></button>
                                <button onclick="deleteTask(${task.id})"><img src="images/del.svg" alt="Delete" ></button>
                            </div>
                        </div>
                    </div>`;
            containerAllTask.insertAdjacentHTML('beforeend', html);
            task.completed ? containerCompletedTask.insertAdjacentHTML('beforeend', html1) 
            : containerActiveTask.insertAdjacentHTML('beforeend', html1);
        });        
    }
};

displayTasks(tasks);

btnAdd.addEventListener('click', function () {
    inputBox.disabled = false;
    inputBox.placeholder = 'Add new Task';
    editTaskFlag = false;
    activeBtn = 0;
    btnAdd.classList.add('active-btn');
    btnSearch.classList.remove('active-btn');

    if (inputBox.value.trim()) {
        const newTask = {};
        newTask.id = ++generateId;
        newTask.title = inputBox.value;
        newTask.completed = false;
        inputBox.value = '';
        tasks.push(newTask);
    }
    displayTasks(tasks);
});

btnSearch.addEventListener('click', function () {
    inputBox.disabled = false;
    inputBox.placeholder = 'Serach Task';
    editTaskFlag = false;
    activeBtn = 1;
    btnAdd.classList.remove('active-btn');
    btnSearch.classList.add('active-btn');

    if (inputBox.value.trim()) {
        const data = inputBox.value;
        const searched = tasks.filter(t => t.title.toLowerCase().includes(data.toLowerCase()));
        displayTasks(searched);
    } else {
        displayTasks(tasks);
    }
});

inputBox.addEventListener('keyup', function (event) {
    editTaskFlag = false;
    if (activeBtn == 0) {
        if (event.key === "Enter") btnAdd.click();
    }
    else
        btnSearch.click();
});

const tickComplete = function(taskID) {
    editTaskFlag = false;
    const index = tasks.findIndex(t => t.id === taskID);
    tasks[index].completed = !tasks[index].completed;
    displayTasks(tasks);
}

const deleteTask = function (taskID) {
    editTaskFlag = false;
    const index = tasks.findIndex(t => t.id === taskID);
    tasks.splice(index,1);
    displayTasks(tasks);
}

const editTask = function(taskID,i,disable) {
    editTaskFlag = true;
    editTaskID = taskID;
    displayTasks(tasks);
    editFromBox = i;
    box[i].disabled = false;
    box[disable].disabled = true;
};

const editing = function(event){
    if (event.key === "Enter") {
        const index = tasks.findIndex(t => t.id === editTaskID);
        let data;
        if(editFromBox == 0) {
            data = box[0].value;
        } else {
            data = box[1].value;
        }
        tasks[index].title = data;
        editTaskFlag = false;
        editTaskID = 0;
        displayTasks(tasks);
    }
}


filterBtnDone.addEventListener('click', () => {
    options.style.display = 'none';

    selectOpt = selectAction.selectedIndex;
    sortOpt = selectSort.selectedIndex;

    taskAction();
    const newTasks = taskSort();
    displayTasks(newTasks);
});

filterBtnCancel.addEventListener('click', () => {
    options.style.display = 'none';

    selectAction.selectedIndex = selectOpt;
    selectSort.selectedIndex = sortOpt;

    console.log(selectOpt , sortOpt);
    taskAction();
    const newTasks = taskSort();
    displayTasks(newTasks);
});

filterBtnReset.addEventListener('click', () => {
    options.style.display = 'none';

    selectOpt = 0;
    sortOpt = 0;
    selectAction.selectedIndex = selectOpt;
    selectSort.selectedIndex = sortOpt;

    console.log(selectOpt , sortOpt);
    taskAction();
    const newTasks = taskSort();
    displayTasks(newTasks);
});

const taskAction = function () {
    const opt = selectAction.options[selectOpt].value;

    // selectAction.selectedIndex = 0;
    switch (Number(opt)) {
        case 1: {
            tasks.filter(t => t.completed === true)
                .forEach(t => {
                    const delIndex = tasks.findIndex(task => task.id === t.id);
                    tasks.splice(delIndex, 1);
                });
            break;
        }
        case 2: {
            tasks.forEach(t => t.completed = true);
            break;
        }
        case 3: {
            tasks.forEach(t => t.completed = false);
            break;
        }
        default: { };
    }
};


const taskSort = function () {
    const opt = selectSort.options[sortOpt].value;

    let sortTasks = tasks.slice();

    switch (Number(opt)) {
        case 1: {
            const newTasks = tasks.slice().sort((a, b) => a.title.toUpperCase().localeCompare(b.title.toUpperCase(), 'en', { numeric: true }));
            return newTasks;
        }
        case 2: {
            const newTasks = tasks.slice().sort((a, b) => a.title.toUpperCase().localeCompare(b.title.toUpperCase(), 'en', { numeric: true }));
            return newTasks.reverse();
        }
        case 3: {
            const newTasks = tasks.slice().sort((a, b) => a.id - b.id);
            return newTasks;
        }
        case 4: {
            const newTasks = tasks.slice().sort((a, b) => b.id - a.id);
            return newTasks;
        }
        default: return sortTasks;
    }
};