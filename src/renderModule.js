//renderModule.js

import * as projectModule from "./projectModule.js";
import * as taskModule from "./taskModule.js";
import * as eventListenerModule from "./eventListenerModuel.js";
import * as filterModule from "./filterModule.js";
import * as helperModule from "./helper.js";
import * as errorTestModule from "./errorTestModule.js";

//declarations
const projectsListElm = document.querySelector("#projects-list");
const mainContentContainer = document.querySelector("#main-content");

//============================================ Major Functions ============================================//

export function renderAll() {
    clearDynamicDOM();
    renderProjectSidebarList();
    renderDefaultTodoCard();
    renderTodoCards();

    //test
    // console.log(taskModule.getTaskList());
}

function clearDynamicDOM() {
    projectsListElm.innerHTML = "";
    mainContentContainer.innerHTML = "";
}

//============================================ Project Functions ============================================//

function renderProjectSidebarList() {    
    const projectSidebarElms = creatProjectSidebarElms();
    renderProjectListToLocation(projectSidebarElms, projectsListElm);
}

function renderProjectListToLocation(elmList, location) { 
    elmList.forEach((elm) => {
        appendElmToLocation(elm, location, "append");
    });
}

function creatProjectSidebarElms() {
    //get sorted projects list
    const orgProjList = projectModule.getOrganizeProjectsList();

    const projectElms = [];
    //make elms
    orgProjList.forEach((project) => {
        const projectElm = createElm("li"); //each project line is a container insude an li

        addClassToElm(projectElm, "sidebar-project-li");
        
        const sidebarProjListLine = createSidebarProjListLine(project);
        appendElmToLocation(sidebarProjListLine, projectElm, "append");
        
        projectElms.push(projectElm);
    });
    
    return projectElms;
}

function createSidebarProjListLine(projectName) {
    const lineWrapper = createElm("div");
    addClassToElm(lineWrapper, "sidebar-proj-list-line");

    //add name elm
    const projNameElm = createSidebarProjListName(projectName);
    appendElmToLocation(projNameElm, lineWrapper, "append");

    //add del/edit btns
    if (projectName !== "all") { //"all" doesn't get edit/del btns
        //edit Btn
        const editBtn = createEditBtn( //create edit btn 
            () => swapOutElm( //swaps out project line for edit project line on edit btn select
                lineWrapper,
                () => createNewProjInput("value", projectName), //creates new inputline for use
                () => sidebarEditProjConfirmFunc(), //edit project logic
                true //is an edit line
            ) 
        ); 
        appendElmToLocation(editBtn, lineWrapper, "append");

        //del btn
        // const delBtn = createSidebar //delBtn here?
    }

    return lineWrapper;
}

function sidebarEditProjConfirmFunc() {
    console.warn("sidebarEditProjConfirmFunc needs logic")
}

function createSidebarProjListName(projectName) {
    const projNameElm = createElm("div");
    addClassToElm(projNameElm, "sidebar-proj-list-name");
    projNameElm.textContent = projectName;
    projNameElm.style = "display: inline"; //to make stay on same line. Move to css?
    //add event listener
    eventListenerModule.addELtoSidebarProjName(projNameElm);
    return projNameElm;
}

function createNewProjInput(attToAdd, attValue) {
    const projectInputElm = createElm("input");
    addAttToElm(projectInputElm, attToAdd, attValue);
    
    return projectInputElm;
}

function createDropDownProjElms() {
    //get sorted projects list
    const orgProjList = projectModule.getOrganizeProjectsList();

    const projectElms = [];
    //make elms
    orgProjList.forEach((project) => {
        const projectElm = createElm("option"); //for <select>

        addValueToElm(projectElm, project);
        projectElm.textContent = project;

        projectElms.push(projectElm);
    });

    //remove "all" from top. User may not add projects to "all"
    projectElms.shift(); 
    
    return projectElms;    
}

//============================================ DEFAULT Todo Card Functions ============================================//

function renderDefaultTodoCard() {
    const defaultTodoCard = createDefaultTodoCard();
    appendElmToLocation(defaultTodoCard, mainContentContainer, "append");
}

function createDefaultTodoCard() {
    //create card and append template
    const defaultTodoCard = createCard("div", "todo-card", "default-todo-card");
    addClassToElm(defaultTodoCard, "def-todo-card-abridged");

    const templateClone = cloneTemplate("#default-todo-card-template");
    appendElmToLocation(templateClone, defaultTodoCard, "append");

    populateDefaultTodoCard(defaultTodoCard);
    addELsToDefaultCard(defaultTodoCard);
    
    return defaultTodoCard;
}

function addELsToDefaultCard(card) {
    //submit task
    const submitButton = card.querySelector("#submit-new-todo-button");
    eventListenerModule.addELToDefaultCardSubmitBtn(submitButton, card);

    //changeable priority btn
    const priorityBtn = card.querySelector("#todo-priority-input");
    eventListenerModule.addELToDefaultCardPriorityBtn(priorityBtn);

    //show/hide btn
    const showHideDetailsBtn = card.querySelector(".show-hide-details-btn");
    eventListenerModule.addELtoDefaultShowHideDetailsBtn(showHideDetailsBtn, card);
}

export function defTodoCardShowHideDetailsBtnFunc(btn, card) {
    if (btn.classList.contains("add-sign")) {
        //edit btn to up arrow
        btn.textContent = "▲";
        btn.classList.remove("add-sign");
        addClassToElm(btn, "up-arrow");
        //edit card: remove abridged view
        card.classList.remove("def-todo-card-abridged");
    }
    else if (btn.classList.contains("up-arrow")) {
        //edit btn to add sign (is like "down arrow")
        btn.textContent = "+";
        btn.classList.remove("up-arrow");
        addClassToElm(btn, "add-sign");
        //edit card to abridged view
        addClassToElm(card, "def-todo-card-abridged");
    }
}

function populateDefaultTodoCard(card) { //passing card because it's created in js, not from HTML
    const projectSelectLine = card.querySelector("#todo-project-input");
    addProjDropDownToDefaultCard(projectSelectLine);

    //add default date

}

function addProjDropDownToDefaultCard(projectSelectLineArg) {
    //createProjectElms func uses the entire project list (need to remove "all")
    const dropDownProjElms = createDropDownProjElms();
    //append
    renderProjectListToLocation(dropDownProjElms, projectSelectLineArg);
}

//============================================ Todo Card Functions ============================================//

function renderTodoCards() {
    //use filtered taskList
    const filteredTaskList = filterModule.getFilteredTaskList();
    filteredTaskList.forEach((task) => {
        const newTodoCard = createToDoCard(task);
        appendElmToLocation(newTodoCard, mainContentContainer, "append");
    });
}

function createToDoCard(task) {
    //create card and append template
    const todoCard = createCard("div", "todo-card", task.idNum); //task.id will need string
    //add in abridged class
    addClassToElm(todoCard, "todo-card-abridged");
    const templateClone = cloneTemplate("#todo-card-template");
    appendElmToLocation(templateClone, todoCard, "append");

    //populate template
    populateTodoCard(task, todoCard);
    //add Els
    addELsToTodoCard(todoCard)
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
    //set priority class here?
}

function addELsToTodoCard(card) {
    //show/hide detail btn
    const showHideDetailsBtn = card.querySelector(".show-hide-details-btn");
    eventListenerModule.addELtoTodoCardShowHideDetailsBtn(showHideDetailsBtn, card);
    
    //del task btn
    const delTaskBtn = card.querySelector(".del-task-btn");
    eventListenerModule.addELtoTodoCardDelTaskBtn(delTaskBtn, card);
}

export function todoCardShowHideDetailsBtnFunc(btn, card) {
    if (btn.classList.contains("down-arrow")) {
        //edit btn to up arrow
        btn.textContent = "▲";
        btn.classList.remove("down-arrow");
        addClassToElm(btn, "up-arrow");
        //edit card: remove abridged view
        card.classList.remove("todo-card-abridged");
    }
    else if (btn.classList.contains("up-arrow")) {
        //edit btn to down arrow
        btn.textContent = "▼";
        btn.classList.remove("up-arrow");
        addClassToElm(btn, "down-arrow");
        //edit card to abridged view
        addClassToElm(card, "todo-card-abridged");
    }
}

export function todoCardDelBtnChangeOnSelect(btn, card){
    const delTaskConfirmLine = swapOutElm( //hides button and "replaces" with confirm delete line
        btn, //elm to hide/unhide
        () => delConfirmMessageElm("delete task?"), //makes first elm in new line
        () => confirmDelTaskFunc(card) //confirm del logic
    );
    addClassToElm(delTaskConfirmLine, "del-task-confirm-line"); //additional class
}

function confirmDelTaskFunc(card) {
    taskModule.delTask(card.id);
    renderAll();
}

//============================================ Sidebar Functions ============================================//

export function addProjBtnChangeOnSelect(btn) {
    const btnAreaWrapper = btn.parentElement; //wrapper to hide

    const addProjSidebarLine = swapOutElm( //hides wrapper and "swaps it out" with this new line
        btnAreaWrapper, //element to hide/unhide
        () => createNewProjInput("placeholder", "new project"), //creates/appends input for user
        () => confirmAddProjFunc(btnAreaWrapper, addProjSidebarLine), //confirm add project logic
        true
    );
}

//add new project function
function confirmAddProjFunc(wrapper, newInputLine) {
    //collect and format user input
    const rawProjInputVal = newInputLine.querySelector("input").value;
    const newProjInputVal = helperModule.userInputFormatter(rawProjInputVal);
    
    //check user input
    if (errorTestModule.checkHasErrorUserAddProjInputs(newProjInputVal)) {
        
        //make error function
        
        console.warn("ERROR: user project input error");
    }
    else {
        projectModule.addProjectToProjectList(newProjInputVal);
        
        resetHiddenElm(wrapper, newInputLine);
        renderAll();
    }
}

//============================================ Derived Functions ============================================//

function swapOutElm(elmToHide, firstElmFunc, confirmFunc, isForEditLine) {
    hideElm(elmToHide);

    const newLineWrapper = createConfirmCancelLine(
        elmToHide,
        () => firstElmFunc(), 
        confirmFunc
    );

    appendElmToLocation(newLineWrapper, elmToHide, "after"); //need make "after" a parameter in swapOutElm()?
    newLineWrapper.style = "display: inline"; //to make stay on same line. Move to css?

    //special case for edit lines. Needs extra class and to focus/select on input
    if (isForEditLine) {
        swapOutIsForEditLine (newLineWrapper);
    }
    
    return newLineWrapper;    
}

function swapOutIsForEditLine (newWrapper) {
    addClassToElm(newWrapper, "edit-line");
    const newWrapperInput = newWrapper.querySelector("input");
    newWrapperInput.select();
}

function createConfirmCancelLine(hiddenElm, firstElmFunc, confirmFunc) {
    const confirmCancelLine = createElm("div");
    addClassToElm(confirmCancelLine, "confirm-cancel-line");

    const firstElm = firstElmFunc();
    firstElm.style = "display: inline"; //to make stay on same line. Move to css?
    const confirmBtn = createConfirmBtn(() => confirmFunc());
    const cancelBtn = createCancelBtn(hiddenElm, confirmCancelLine);

    appendElmToLocation(firstElm, confirmCancelLine, "append");
    appendElmToLocation(confirmBtn, confirmCancelLine, "append");
    appendElmToLocation(cancelBtn, confirmCancelLine, "append");

    return confirmCancelLine;    
}

function delConfirmMessageElm(message) {
    //create stylized confirm del task message  
    const delTaskConfirmMessage = createElm("div");
    addClassToElm(delTaskConfirmMessage, "del-confirm-message");
    delTaskConfirmMessage.textContent = message;
    delTaskConfirmMessage.style = "font-style: italic"; //needs css instead
    return delTaskConfirmMessage;
}

function createEditBtn(selectBtnFunc) {
    const newEditBtn = createBtn("✎", "edit-btn", selectBtnFunc);
    return newEditBtn;
}

function createCancelBtn(hiddenElm, newElmToDel) {
    const newCancelBtn = createBtn("↺", "cancel-btn", () => resetHiddenElm(hiddenElm, newElmToDel));
    return newCancelBtn;
}

function createConfirmBtn(callbackConfirm) {
    const newConfirmBtn = createBtn("✓", "confirm-btn", callbackConfirm);
    return newConfirmBtn;
}

//============================================ Generic Functions ============================================//

{} //spacer
//could you do all this with Classes? like, const newCard = new Card. then call newCard.addClass(className)

function hideElm(elmToHide) {
    elmToHide.style = "display: none";
}

function createBtn(textContentArg, classNameArg, callbackFunc) {
    const newBtn = createElm("button");
    addClassToElm(newBtn, classNameArg);
    newBtn.textContent = textContentArg;
    
    newBtn.addEventListener("click", () => {
        callbackFunc();
    });
    
    return newBtn;
}

function resetHiddenElm(hiddenElm, newElmToDel) {
    hiddenElm.style = "display: initial" //reset to inline-block?
    
    newElmToDel.remove();
}

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

function addAttToElm(elm, attName, attValue) {
    elm.setAttribute(attName, attValue);
}

function addValueToElm(elm, value) {
    elm.value = value;
}

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

//generic place element on DOM
function appendElmToLocation(element, location, typeAppend) {
    location[typeAppend](element);
}