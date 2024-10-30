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

const task1 = new taskModule.Task("task1", "project 1", "descripton1", "2024-10-01", "high");
taskModule.addTasktoTaskList(task1);
const task2 = new taskModule.Task("task2", "project 2", "descripton2", "2024-10-02", "low");
taskModule.addTasktoTaskList(task2);
const task3 = new taskModule.Task("task3", "project 2", "descripton3", "2024-10-03", "med");
taskModule.addTasktoTaskList(task3);
const task4 = new taskModule.Task("task4", "project 3", "descripton4", "2024-10-04", "done");
taskModule.addTasktoTaskList(task4);

renderModule.renderAll();


//test workspace
import { format, setDate } from "date-fns";

let x = "2024-10-10";

export function setDateInputToTime0000(dateInput) {
    const dateValue = new Date(dateInput);
    const utcDate = new Date(dateValue.getUTCFullYear(), dateValue.getUTCMonth(), dateValue.getUTCDate());
    //lowercase styling
    const formattedUTCdate = format(utcDate, "MMM do, yyyy (eee)").toLowerCase();
    
    return formattedUTCdate;
}

// console.log(setDateInputToTime0000(x));

