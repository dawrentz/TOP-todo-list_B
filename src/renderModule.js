//renderModule.js

import * as projectModule from "./projectModule.js";
import * as taskModule from "./taskModule.js";

//declarations
const projectsListElm = document.querySelector("#projects-list");
const mainContentContainer = document.querySelector("#main-content");

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
    //wipe all first?
    renderProjectList();
    renderDefaultTodoCard();
    renderTodoCards();
}

//generic elements creation with classname
function createElm(elm, classNameArg, optionalIDArg) {
    const newElm = document.createElement(elm);
    newElm.className = classNameArg;
    //optional id
    //test
    if (optionalIDArg !== undefined) {
        newElm.id = optionalIDArg;    
    }
    
    return newElm;
}

//generic place element on DOM
//can use location[typeAppend]???
function appendElmToLocation(element, location) {
    location.append(element);
}

//create default card with html template
function createDefaultTodoCard() {
    //create card and append template
    const defaultTodoCard = createCard("div", "todo-card", "default-todo-card");
    const templateClone = cloneTemplate("#default-todo-card-template");
    appendElmToLocation(templateClone, defaultTodoCard);
    
    return defaultTodoCard;
}

//create and append default todo card
function renderDefaultTodoCard() {
    const defaultTodoCard = createDefaultTodoCard();
    appendElmToLocation(defaultTodoCard, mainContentContainer);
}

//create todo task card
function createToDoCard(task) {
    //create card and append template
    const todoCard = createCard("div", "todo-card", task.idNum); //task.id will need string
    const templateClone = cloneTemplate("#todo-card-template");
    appendElmToLocation(templateClone, todoCard);

    //populate template
    populateTodoCard(task, todoCard);

    return todoCard;

}

//create append all todo cards from list
function renderTodoCards() {
    //may need to pass a taskListArg when introduce filtering task by project (or other)
    //make getFilteredTaskList() in taskModule?
    const taskList = taskModule.getTaskList();
    taskList.forEach((task) => {
        const newTodoCard = createToDoCard(task);
        appendElmToLocation(newTodoCard, mainContentContainer);
    });
}

function populateTodoCard(task, card) {
    //collect elms to populate
    const todoTitleElm = card.querySelector("#todo-title");
    const todoProjectElm = card.querySelector("#todo-project");
    const todoDescriptElm = card.querySelector("#todo-description");
    const todoDueDateElm = card.querySelector("#todo-dueDate");
    //priority is the card color

    //link elms to task prop to populate
    todoTitleElm.textContent = task.title;
    todoProjectElm.textContent = task.project;
    todoDescriptElm.textContent  = task.description;
    todoDueDateElm.textContent = task.dueDate;
    //set priority class?


}

function createCard(element, classNameArg, IDArg) {
    const newCard = createElm(element, classNameArg, IDArg);
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
