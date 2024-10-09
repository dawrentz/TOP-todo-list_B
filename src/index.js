//index.js

import "./style.css";
import * as taskModule from "./taskModule.js";
import * as projectModule from "./projectModule.js";
import * as renderModule from "./renderModule.js";
import * as filterModule from "./filterModule.js";

//declarations
const mainContentArea = document.querySelector("#main-content");


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

renderModule.renderProjectList()
renderModule.renderAll();

