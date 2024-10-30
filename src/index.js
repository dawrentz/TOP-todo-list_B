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

const task1 = new taskModule.Task("task1", "project 1", "descripton1", "2024-10-07", "high");
taskModule.addTasktoTaskList(task1);
const task2 = new taskModule.Task("task2", "project 2", "descripton2", "2024-10-08", "low");
taskModule.addTasktoTaskList(task2);
const task3 = new taskModule.Task("task3", "project 2", "descripton3", "2024-10-09", "med");
taskModule.addTasktoTaskList(task3);
const task4 = new taskModule.Task("task4", "project 3", "descripton4", "2024-10-10", "done");
taskModule.addTasktoTaskList(task4);

renderModule.renderAll();
