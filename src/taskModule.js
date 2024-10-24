//taskModule.js

import * as helperModule from "./helper.js";

const _taskList = [];

let _idNum = 0;

function getNewIDnum() {
    const newID = _idNum++;
    return newID.toString(); //need convert id to string for edit task funcs
}

//task creation
export class Task{
    constructor(title, project, description, dueDate, priority) {
        this.title = title;
        this.project = project;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.idNum = getNewIDnum();
    }

    getProp(prop) {
        return this[prop];
    }

    setProp(prop, newVal) {
        this[prop] = newVal;
    }
}

//update localStorage
//make own module
function updateLocalStorage(data) {
    //logic
}

export function getTaskList() {
    // Return a shallow copy of the array, but deep copy the objects within. This is to protect the task data. (I guess... that's what Chat GBT said)
    return _taskList.map(task => ({ ...task }));
} 

//push new task. Needs to be in Task class and run automatically?
//add local storage
export function addTasktoTaskList(task) {
    _taskList.push(task);
}

//delete a task
//add local storage

export function delTask(idNum) {
    _taskList.forEach((task, index) => {
        if (task.idNum === idNum) {
            _taskList.splice(index, 1);
        }
    });
} 

//find all tasks IDs in a project
export function findTaskIDsInProject(projectName) {
    const tasksIDsInProject = [];
    _taskList.forEach((task) => {
        if (task.project === projectName) {
            tasksIDsInProject.push(task.idNum);
        }        
    });

    return tasksIDsInProject;
}

export function getUserInputsFromDefaultCard(card) {
    const inputData = collectTaskInfoFromDefaultCardInputs(card);
    const formattedInputData = formatTaskInfoFromDefaultCardInputs(inputData);
    return formattedInputData;
}

//collect task info from default card form
 function collectTaskInfoFromDefaultCardInputs(card) {
    const titleInput = card.querySelector("#todo-title-input").value;
    const projectInput = card.querySelector("#todo-project-input").value;
    const descriptionInput = card.querySelector("#todo-description-input").value;
    const dueDateInput = card.querySelector("#todo-dueDate-input").value;
    const priorityInput = card.querySelector("#todo-priority-input").textContent; //is btn

    const inputData = {
        title:  titleInput,
        project: projectInput,
        description: descriptionInput,
        dueDate: dueDateInput,
        priority: priorityInput,        
    }

    return inputData;
}

//format user inputs from default card
function formatTaskInfoFromDefaultCardInputs(inputDataArg) {
    const formattedInputData = Object.keys(inputDataArg).reduce((formattedData, key) => {
        formattedData[key] = helperModule.userInputFormatter(inputDataArg[key]);
        return formattedData;
    },{});

    return formattedInputData;
}
