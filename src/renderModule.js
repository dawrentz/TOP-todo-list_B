//renderModule.js

import * as projectModule from "./projectModule.js";
import * as taskModule from "./taskModule.js";

//declarations
const projectsListElm = document.querySelector("#projects-list");
const mainContentContainer = document.querySelector("#main-content");

//============================================ Major Functions ============================================

export function renderAll() {
    //wipe all first?
    renderProjectSidebarList();
    renderDefaultTodoCard();
    renderTodoCards();
}

//============================================ Project Functions ============================================

function renderProjectSidebarList() {    
    const projectSidebarElms = createProjectElms("li");
    renderProjectListToLocation(projectSidebarElms, projectsListElm);
}

function renderProjectListToLocation(elmList, location) { 
    elmList.forEach((elm) => {
        appendElmToLocation(elm, location);
    });
}

//not sure if this follows the SOLID, but the code seem cleaner and this can update fairly easily
function createProjectElms(elmType) {
    //get sorted projects list
    const orgProjList = projectModule.getOrganizeProjectsList();
    //make elms
    const projectElms = [];
    orgProjList.forEach((project) => {
        const tempElm = createElm(elmType);


        // types of project elms to be made
        if (elmType === "option") {
            addValueToElm(tempElm, project);
        }
        else if (elmType === "li") {
            addClassToElm(tempElm, "sidebar-project-li");
        }
        else { throw new Error("ERROR: elmType must be one of the following:\n- option \n- li "); }

        tempElm.textContent = project;
        projectElms.push(tempElm);
    });
    
    return projectElms;
}

//============================================ DEFAULT Todo Card Functions ============================================

function renderDefaultTodoCard() {
    const defaultTodoCard = createDefaultTodoCard();
    appendElmToLocation(defaultTodoCard, mainContentContainer);
}

function createDefaultTodoCard() {
    //create card and append template
    const defaultTodoCard = createCard("div", "todo-card", "default-todo-card");
    const templateClone = cloneTemplate("#default-todo-card-template");
    appendElmToLocation(templateClone, defaultTodoCard);

    populateDefaultTodoCard(defaultTodoCard);
    
    return defaultTodoCard;
}

function populateDefaultTodoCard(card) { //passing card because it's created in js, not from HTML
    const projectSelectLine = card.querySelector("#todo-project-input");
    addProjDropDownToDefaultCard(projectSelectLine);
    //add date handling
}

function addProjDropDownToDefaultCard(projectSelectLineArg) {
    const dropDownProjElms = createProjectElms("option"); 
    renderProjectListToLocation(dropDownProjElms, projectSelectLineArg); 
}

//============================================ Todo Card Functions ============================================

function renderTodoCards() {
    //may need to pass a taskListArg when introduce filtering task by project (or other)
    //make getFilteredTaskList() in taskModule?
    const taskList = taskModule.getTaskList();
    taskList.forEach((task) => {
        const newTodoCard = createToDoCard(task);
        appendElmToLocation(newTodoCard, mainContentContainer);
    });
}

function createToDoCard(task) {
    //create card and append template
    const todoCard = createCard("div", "todo-card", task.idNum); //task.id will need string
    const templateClone = cloneTemplate("#todo-card-template");
    appendElmToLocation(templateClone, todoCard);

    //populate template
    populateTodoCard(task, todoCard);

    return todoCard;
}

function populateTodoCard(task, card) {
    //collect elms to populate
    const todoTitleElm = card.querySelector(".todo-title");
    const todoProjectElm = card.querySelector(".todo-project");
    const todoDescriptElm = card.querySelector(".todo-description");
    const todoDueDateElm = card.querySelector(".todo-dueDate");
    //priority is the card color

    //link elms to task prop to populate
    todoTitleElm.textContent = task.title;
    todoProjectElm.textContent = task.project;
    todoDescriptElm.textContent  = task.description;
    todoDueDateElm.textContent = task.dueDate;
    //set priority class?


}

//============================================ Generic Functions ============================================

function createElm(elm) {
    const newElm = document.createElement(elm);
    return newElm;
}

function addClassToElm(elm, classNameArg) {
    elm.classList.add(classNameArg);
}

function addIDtoElm(elm, idArg) {
    elm.id = idArg;
}

function addDataAttToElm(elm, dataName, dataValue) {
    elm.setAttribute(dataName, dataValue);
}

function addValueToElm(elm, value) {
    elm.value = value;
}

//could you do all this with Classes? like, const newCard = new Card. then call newCard.addClass(className)
function createCard(element, classNameArg, IDArg) {
    const newCard = createElm(element, classNameArg, IDArg);
    addClassToElm(newCard, classNameArg);
    addIDtoElm(newCard, IDArg);
    return newCard;
}

function cloneTemplate(templateIDselector) {
    const template = document.querySelector(templateIDselector);

    // Clone the template content
    const clone = document.importNode(template.content, true);
    return clone;
}

//generically create elms from list
//dont like this, want to choose to add class and ID and as needed when called (can make function for making specifc list that connects everything like this)
function makeElmsFromList(element, classNameArg, list) {
    //store the project li's in an array
    const listElms = [];
    //loop through projects, create LI, push to array
    list.forEach((item) => {
        const tempElm = createElm(element);
        //addClass to list elsewhere? make function or loop through list all the call?
        addClassToElm(tempElm, classNameArg);
        tempElm.textContent = item;
        listElms.push(tempElm);
    });

    return  listElms;
}

//generic place element on DOM
//can use location[typeAppend]?
function appendElmToLocation(element, location) {
    location.append(element);
}