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
        const projectElm = createElm("li"); //each project line is a container inside an li
        addClassToElm(projectElm, "sidebar-project-li");
        
        const sidebarProjListLine = createSidebarProjListLine(project); //this is the "container" for the li. Contains name (with filter EL), edit/del btns
        appendElmToLocation(sidebarProjListLine, projectElm, "append"); //place container in li
        
        projectElms.push(projectElm); //store in list of sidebar project li's
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
                () => createNewInput("value", projectName), //creates new input line for user
                (event) => sidebarEditProjConfirmFunc(event, projectName), //edit project logic
                true //is an edit line
            ) 
        ); 
        appendElmToLocation(editBtn, lineWrapper, "append");

        //del btn
        const delBtn = createDelBtn( //create del btn
            () => swapOutElm( //swaps out project line for del project line on del btn select
                lineWrapper,
                () => delConfirmMessageElm("wipe project?"), //creates first elm: project name (del version) and confirm del message
                () => sidebarDelProjConfirmFunc(projectName), 
                false, 
                true //is delLine
            )
        ); 
        appendElmToLocation(delBtn, lineWrapper, "append");
    }

    return lineWrapper;
}

function sidebarDelProjConfirmFunc(projectName) {
    projectModule.wipeEntireProject(projectName);
    renderAll();
}

//could abstract this for todo edits
function sidebarEditProjConfirmFunc(event, projectName) {
    const newUserInput = grabUserInput(event);

    //if no error, edit project
    if (!errorTestModule.checkHasErrorUserInputEditProject(newUserInput)) {
        projectModule.updateEntireProjectProjtName(projectName, newUserInput);
        renderAll();
    }
    else {
        console.warn("ERROR: user input error");
    }
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

function createDropDownProjElms(includeDefaultOption) {
    //get sorted projects list
    const orgProjList = projectModule.getOrganizeProjectsList();

    const projectElms = [];

    //make project elms
    orgProjList.forEach((project) => {
        const projectElm = createElm("option"); //for <select>

        addValueToElm(projectElm, project);
        projectElm.textContent = project;

        projectElms.push(projectElm);
    });
    
    //remove "all" from top. User may not add projects to "all"
    projectElms.shift(); 
    
    //if "select project" option needed at top
    if (includeDefaultOption) {
        const projectElmDef = createElm("option"); //for <select>

        addValueToElm(projectElmDef, ""); //no value for default selection
        projectElmDef.textContent = "select project";

        projectElms.unshift(projectElmDef);
    }


    
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

    //add Els to HTML elements
    addELsToTodoCard(todoCard)
    //populate template
    populateTodoCardInfo(task, todoCard);

    //add edit btns
    addEditBtnsToTodoCardLines(todoCard, task.idNum);




    return todoCard;
}

function addEditBtnsToTodoCardLines(todoCardArg, taskID) {
    //grab all todo data lines (the wrappers to hide, and where the edit btns will go)
    const allTodoDataLines = todoCardArg.querySelectorAll(".todo-data-line");

    //loop through each line and add specific input types as needed
    allTodoDataLines.forEach((dataLine) => {
        //set args in if/thens and call addEditBtnToTodoLine() once at end
        
        
        //grab class name and pull out the task prop being edited
        const specificClassName = dataLine.classList[1]; //task prop in in the second array item className. May be better to assign those lines specific data attribute in the HTML template and reference here
        const propToChange = helperModule.extractTaskPropFromTodoLineClass(specificClassName);
        //grab previous data
        const dataLineOldVal = taskModule.findTaskProp(taskID, propToChange);
        
        //test
        console.log(dataLineOldVal);

        //create specific input for data line type 
        let createInputCallbackFunc; 

        //set callback func for each type of line. Each line need a specific type of input for the user edit
        //for title line
        if (propToChange === "title") {
            //create text input            
            createInputCallbackFunc = () => {
                const newInput = createNewInput("value", dataLineOldVal, "text"); //creates specific input line for user
                return newInput;
            }
        }

        //for project line
        else if (propToChange === "project") {
            //create select drop-down            
            createInputCallbackFunc = () => {
                //create outer <select>
                const newInput = createElm("select");
                addClassToElm(newInput, "edit-todo-project-input");

                //create/append <option>'s to <select>
                const dropDownElms = createDropDownProjElms(true);
                dropDownElms.forEach((option) => {
                    appendElmToLocation(option, newInput, "append");
                });

                return newInput;
            }
        }

        //for description line
        else if (propToChange === "description") {
            //create textarea input            
            createInputCallbackFunc = () => {
                const newInput = createElm("textarea");
                addClassToElm(newInput, "edit-todo-description-input");
                addValueToElm(newInput, dataLineOldVal);
                return newInput;
            }         
        }

        //for dueDate line
        else if (propToChange === "dueDate") {
            //create date input            
            createInputCallbackFunc = () => {
                const newInput = createNewInput("value", dataLineOldVal, "date"); //creates specific input line for user
                return newInput;
            }
        }

        addEditBtnToTodoLine( 
            dataLine, //pass through line to hide
            createInputCallbackFunc,
            taskID, //to find task by id
            propToChange
        );




    });
}

function addEditBtnToTodoLine(dataLine, inputTypeCallback, taskID, propToChangeArg) {
    //title editBtn and func
    const todoLineEditBtn = createEditBtn( //create edit btn 
        () => swapOutElm( //swaps out project line for edit project line on edit btn select
            dataLine, //line to hide
            inputTypeCallback, //creates new input line for user
            (event) => todoDataLineEditBtnConfirmFunc(event, taskID, propToChangeArg), //edit title logic
            true //is an edit line
        ) 
    ); 
    
    appendElmToLocation(todoLineEditBtn, dataLine, "append");
}


function todoDataLineEditBtnConfirmFunc(event, taskID, propToChangeArg) {
    const newUserInput = grabUserInput(event);
    let readyToRender = true;
    
    //run input check
    if (propToChangeArg !== "description") { //exclusions
        readyToRender = !errorTestModule.checkHasErrorUserInputEditProject(newUserInput); //hasError returns true if error, so use ! for opposite
    }
    
    //run if all is ready
    if (readyToRender) {
        taskModule.findAndUpdateTask("idNum", taskID, propToChangeArg, newUserInput);
        renderAll();//maybe not renderAll? just update that line? (better UI)
    }
    else {
        console.warn("ERROR: user input error");
    }
    
}

function populateTodoCardInfo(task, card) {
    //collect elms to populate
    const todoTitleElm = card.querySelector(".todo-title");
    const todoProjectElm = card.querySelector(".todo-project");
    const todoDescriptElm = card.querySelector(".todo-description");
    const todoDueDateElm = card.querySelector(".todo-dueDate");
    //priority is the card color

    //link elms to task prop to populate
    todoTitleElm.textContent = task.title;
    todoProjectElm.textContent = task.project;
    todoDescriptElm.textContent  = task.description === "" ? "description" : task.description; //nicer UI to see where the description line is, vs there being just an editBtn floating there after project name
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
        () => createNewInput("placeholder", "new project"), //creates/appends input for user
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

function swapOutElm(elmToHide, firstElmFunc, confirmFunc, isForEditLine, isForDelLine) {
    hideElm(elmToHide);

    const newLineWrapper = createConfirmCancelLine(
        elmToHide,
        firstElmFunc, 
        confirmFunc
    );

    appendElmToLocation(newLineWrapper, elmToHide, "after"); //need make "after" a parameter in swapOutElm()?
    newLineWrapper.style = "display: inline"; //to make stay on same line. Move to css?

    //special case for edit lines. Needs extra class and to focus/select on input
    if (isForEditLine) {
        swapOutIsForEditLine (newLineWrapper);
    }

    //special case for del lines. Needs stylize project name atop the confirmCancelLine
    if (isForDelLine) {
        swapOutIsForDelLine(newLineWrapper, elmToHide);
    }
    
    return newLineWrapper;    
}

function swapOutIsForDelLine(newWrapper, hiddenElm) {
    const elmToDelVal = hiddenElm.querySelector("* > *").textContent; //grab textContent of the original line's first child (has the data value needed)

    const delLineValElm = createElm("div");
    addClassToElm(delLineValElm, "del-val-name");
    delLineValElm.textContent = elmToDelVal;

    appendElmToLocation(delLineValElm, newWrapper, "prepend");
}

function swapOutIsForEditLine(newWrapper) {
    addClassToElm(newWrapper, "edit-line");
    const newWrapperInput = newWrapper.querySelector(":first-child");
    if (newWrapperInput.tagName !== "SELECT") {
        newWrapperInput.select(); 
    }
}

function grabUserInput(event) { //used in edit lines
    //use event to walk up to parent and down to user input
    const thisConfirmBtn = event.target;
    const thisConfirmCancelLine = thisConfirmBtn.parentElement;
    const thisUserInputElm = thisConfirmCancelLine.querySelector(":first-child"); //first child in 
    const rawUserInput = thisUserInputElm.value;
    const newUserInput = helperModule.userInputFormatter(rawUserInput);
    
    return newUserInput;
}

function createConfirmCancelLine(hiddenElm, firstElmFunc, confirmFunc) {
    const confirmCancelLine = createElm("div");
    addClassToElm(confirmCancelLine, "confirm-cancel-line");

    const firstElm = firstElmFunc();
    firstElm.style = "display: inline"; //to make stay on same line. Move to css?
    const confirmBtn = createConfirmBtn(confirmFunc);
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
    return delTaskConfirmMessage;
}

function createEditBtn(selectBtnFunc) {
    const newEditBtn = createBtn("✎", "edit-btn", selectBtnFunc);
    return newEditBtn;
}

function createDelBtn(selectBtnFunc) {
    const newDelBtn = createBtn("⨉", "del-btn", selectBtnFunc);
    return newDelBtn;
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

function createNewInput(attToAdd, attValue, inputType) {
    const projectInputElm = createElm("input");
    addAttToElm(projectInputElm, attToAdd, attValue);

    if (inputType === undefined) {
        addAttToElm(projectInputElm, "type", "text");
    }
    else {
        addAttToElm(projectInputElm, "type", inputType);
    }
    
    return projectInputElm;
}

function hideElm(elmToHide) {
    elmToHide.style = "display: none";
}

function createBtn(textContentArg, classNameArg, callbackFunc) {
    const newBtn = createElm("button");
    addClassToElm(newBtn, classNameArg);
    newBtn.textContent = textContentArg;
    
    newBtn.addEventListener("click", callbackFunc);
    
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