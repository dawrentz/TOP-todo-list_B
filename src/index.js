//index.js

import "./style.css";
import * as taskModule from "./taskModule.js";
import * as projectModule from "./projectModule.js";
import * as renderModule from "./renderModule.js";
import * as eventListenerModule from "./eventListenerModuel.js";

//declarations
const addProjectBtn = document.querySelector("#add-project-btn");

//init
eventListenerModule.addELtoSidebarAddProjBtn(addProjectBtn);

//testing
projectModule.addProjectToProjectList("project 3");
projectModule.addProjectToProjectList("project 1");
projectModule.addProjectToProjectList("project 2");

const task1 = new taskModule.Task("task1", "project 1", "descripton1", "dueDateToday", "high priority");
taskModule.addTasktoTaskList(task1);
const task2 = new taskModule.Task("task2", "project 2", "descripton2", "dueDateTomorrow", "low priority");
taskModule.addTasktoTaskList(task2);
const task3 = new taskModule.Task("task3", "project 2", "descripton3", "dueDateYesterday", "med priority");
taskModule.addTasktoTaskList(task3);

renderModule.renderAll();


//test
// const bodyElm = document.querySelector("body");

// function addELtoElm(elm, callback) {
//     elm.addEventListener("click", callback);
// }

// function clickBodyFunc(event, text) {
//     innerEventFunc(event);
//     console.log(text);
// }

// function innerEventFunc(event) {
//     console.log(event.target);

// }

// addELtoElm(bodyElm, (event) => clickBodyFunc(event, "textTest"));


