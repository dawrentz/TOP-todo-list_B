//localStorageModule.js

import * as projectModule from "./projectModule.js";
import * as taskModule from "./taskModule.js";

//============================================ Major Functions ============================================//

export function updateLocalStorageAllInfo() {
    const allTasks = taskModule.getTaskList();
    const allProjects = projectModule.getOrganizeProjectsList();
    allProjects.shift(); //returns proj list without "all"
    updateLocalStorage("allTasks", allTasks);
    updateLocalStorage("allProjects", allProjects);
}

export function retrieveLocalStorageAllTasks() {
    return retrieveLocalStorage("allTasks");
}

export function retrieveLocalStorageAllProjs() {
    return retrieveLocalStorage("allProjects");
}

function updateLocalStorage(key, data) {
    const data_serialized = stringifyDataForStorage(data); //convert
    localStorage.setItem(key, data_serialized); //data stored
}

function stringifyDataForStorage(data) {
    const data_serialized = JSON.stringify(data); //data converted to storable format
    return data_serialized;
}

function retrieveLocalStorage(key) {
    const data = localStorage.getItem(key);  //retrieve data
    const data_converted = convertDataFromStorage(data); //converted into usable format
    return data_converted;
}

function convertDataFromStorage(data) {
    const data_converted = JSON.parse(data); //obj converted into usable format
    return data_converted;
}

//============================================ App Init Functions ============================================//

export function loadLocalStorageToApp() {
    //grab localStorage data
    const allProjs = retrieveLocalStorageAllProjs();
    const allTasks = retrieveLocalStorageAllTasks(); //grab LS tasks here, addProjectToProjectList() was reseting allTasks in Local (local list is blank);

    loadLocalStorageProjsToApp(allProjs);
    loadLocalStorageTasksToApp(allTasks);
}

function loadLocalStorageProjsToApp(allLSProjs) {
    //if exists, loop through localStorage projects and add to local projectsList
    if (allLSProjs !== null) {
        allLSProjs.forEach((proj) => {
            projectModule.addProjectToProjectList(proj);
        });
    }
}

function loadLocalStorageTasksToApp(allLSTasks) {
    //if exists, loop through localStorage tasks, create tasks and add to local tasksList
    if (allLSTasks !== null) {
        allLSTasks.forEach((task) => {
            const newTask = new taskModule.Task(
                task.title,
                task.project, 
                task.description, 
                task.dueDate, 
                task.priority
            );
            taskModule.addTasktoTaskList(newTask);
        });
    }
}

//============================================ Testing Functions ============================================//

//for testing (in index.js)
export function runLocalStorageTest() {
    localStorage.clear(); //reset localStorage
    addDemoData(); //add demo data
    
    //log
    document.addEventListener("click", () => {
        console.table(localStorage);
    });
}

function addDemoData() {
    const testProjList = [
        "project 1",
        "project 2",
        "project 3",
    ];
    updateLocalStorage("allProjects", testProjList);
    
    const testTaskList = [
        new taskModule.Task("task1", "project 1", "descripton1", "2024-10-01", "high"),
        new taskModule.Task("task2", "project 2", "descripton2", "2024-10-02", "low"),
        new taskModule.Task("task3", "project 2", "descripton3", "2024-10-03", "med"),
        new taskModule.Task("task4", "project 3", "descripton4", "2024-10-04", "done"),
    ];
    
    updateLocalStorage("allTasks", testTaskList);
}