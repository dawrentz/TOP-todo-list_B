//renderModule.js

import * as projectModule from "./projectModule.js";

//declarations
const projectsListElm = document.querySelector("#projects-list");
const mainContentContainer = document.querySelector("#main-content");

// //console testing
// //accepts filtered taskList
// export function render(itemList) {
//     //log in console for now
//     itemList.forEach((item) => {
//         console.table(item);
//     });
// }

export function renderProjectList() {
    //get sorted projects list
    const organizedProjectsList = projectModule.organizeProjectsList(projectModule.getProjectList());
    //make li's
    const projectLIs = makeProjectElms("li", "project-li", organizedProjectsList);
    //append li's
    projectLIs.forEach((li) => {
        appendElmToLocation(li, projectsListElm);
    });
}

export function renderAll() {
    const defaultTodoCard = createDefaultTodoCard();
    appendElmToLocation(defaultTodoCard, mainContentContainer);

    //test
    const testTodoCard = createTodoCard("div", "todo-card");
    testTodoCard.textContent = "testTodoCard";
    appendElmToLocation(testTodoCard, mainContentContainer);
}

//generic elements creation with classname
function createElm(elm, classNameArg) {
    const newElm = document.createElement(elm);
    newElm.className = classNameArg;    
    
    return newElm;
}

//generic place element on DOM
//can use location[typeAppend]???
function appendElmToLocation(element, location) {
    location.append(element);
}

//create default card with html template
function createDefaultTodoCard() {
    const defaultTodoCard = createTodoCard("div", "todo-card default-todo-card");
    // const defaultTodoCard;
    const templateClone = cloneTemplate("#default-todo-card-template");
    appendElmToLocation(templateClone, defaultTodoCard);
    return defaultTodoCard;
}

function createTodoCard(element, classNameArg) {
    const newCard = createElm(element, classNameArg);
    return newCard;
}

function cloneTemplate(templateIDselector) {
    const template = document.querySelector(templateIDselector);

    // Clone the template content
    const clone = document.importNode(template.content, true);
    return clone;
}

//generically create elms for all projects 
function makeProjectElms(element, classNameArg, organizedProjectsListArg) {
    //store the project li's in an array
    const projectElms = [];
    //loop through projects, create LI, push to array
    organizedProjectsListArg.forEach((project) => {
        const tempElm = createElm(element, classNameArg);
        tempElm.textContent = project;
        projectElms.push(tempElm);
    });

    return  projectElms;
}
