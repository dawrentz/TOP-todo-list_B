//projectsModules.js

import * as taskModule from "./taskModule.js";

//running list of projects. Ensure "all" is included
const _projectList = ["all"];

//update localStorage
function updateLocalStorage(data) {
    //logic
}

export function getProjectList() {
    // Return a copy of the array. This is to protect the project data.
    return _projectList.map((project) => project);
} 

//add project to list
export function addProjectToProjectList(project) {
    _projectList.push(project);
}

//remove project form list
export function delProjectFromProjectList(projectName) {
    _projectList.forEach((project, index) => {
        if (project === projectName) {
            _projectList.splice(index, 1);
        }
    });
}

//remove project from list and all corresponding tasks
export function wipeEntireProject(projectName) {
    //reuse delProject function
    delProjectFromProjectList(projectName);

    //extract IDs for delTask()
    const tasksToDelbyID = taskModule.findTaskIDsInProject(projectName);
        
    //loop through IDs and delete each
    tasksToDelbyID.forEach((idNum) => {
        taskModule.delTask(idNum);
    });
}
