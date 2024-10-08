//renderModule.js

import * as projectModule from "./projectModule.js";

//declarations
const projectsListElm = document.querySelector("#projects-list");

//accepts filtered taskList
export function render(itemList) {
    //log in console for now
    itemList.forEach((item) => {
        console.table(item);
    });
}

//generic elements creation with classname
export function createElm(elm, classNameArg) {
    const newElm = document.createElement(elm);
    newElm.className = classNameArg;    
    
    return newElm;
}

//generic place element on DOM
//can use location[typeAppend]???
export function renderToDOM(element, location) {
    location.append(element);
}

export function renderProjectList() {
    //get sorted projects list
    const organizedProjectsList = projectModule.organizeProjectsList(projectModule.getProjectList());
    //store the project li's in an array
    const projectLIs = [];
    //loop through projects, create LI, push to array
    organizedProjectsList.forEach((project) => {
        const tempLi = createElm("li", "project-li");
        tempLi.textContent = project;
        projectLIs.push(tempLi);
    });
    projectLIs.forEach((li) => {
        renderToDOM(li, projectsListElm);
    });


}
