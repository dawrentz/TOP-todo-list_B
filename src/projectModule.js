//projectsModules.js

import * as taskModule from "./taskModule.js";
import * as helperModule from "./helper.js";

//running list of projects. Ensure "all" is included
const _projectList = ["all"];

//update localStorage
//make own module
function updateLocalStorage(data) {
    //logic
}

//get the current projects list
export function getProjectList() {
    // Return a copy of the array. This is to protect the project data.
    return _projectList.map((project) => project);
} 

//sort projects list a-z with "all" at the top
export function organizeProjectsList(projectsListArg) {
    //remove "all" to add in later at the top
    projectsListArg.shift();
    //sort projects a-z
    const sortedProjectsList = helperModule.sortArrayAtoZ(projectsListArg);
    //add "all" to top
    sortedProjectsList.unshift("all");
    return sortedProjectsList;
}

export function getOrganizeProjectsList() {
    return organizeProjectsList(getProjectList());
}

//add project to list
//add local storage
export function addProjectToProjectList(project) {
    _projectList.push(project);
}

//remove project form list
//add local storage
export function delProjectFromProjectList(projectName) {
    _projectList.forEach((project, index) => {
        if (project === projectName) {
            _projectList.splice(index, 1);
        }
    });
}

//remove project from list and all corresponding tasks
//add local storage
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
