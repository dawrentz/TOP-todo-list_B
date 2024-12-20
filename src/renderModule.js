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
        //spacer
        const spacerDiv = createElm("div");
        addClassToElm(spacerDiv, "spacer");
        appendElmToLocation(spacerDiv, lineWrapper, "append");


        //edit Btn
        const editBtn = createEditBtn( //create edit btn 
            () => swapOutElm( //swaps out project line for edit project line on edit btn select
                lineWrapper,
                () => createNewInput("value", projectName), //creates new input line for user
                (event) => sidebarEditProjConfirmFunc(event, projectName, lineWrapper), //edit project logic
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
function sidebarEditProjConfirmFunc(event, projectName, editLine) {
    const newUserInput = grabUserInput(event);
    const confirmCancelLine = editLine.parentElement.querySelector(".confirm-cancel-line");

    const errorTestResult = errorTestModule.checkHasErrorUserInputEditProject(newUserInput);

    //if no error, edit project
    if (!errorTestResult) {
        //if user is editing the current filter, change filter to edited project (else get no tasks to render)
        const currentFilter = filterModule.getFilter();
        if (projectName === currentFilter) {
            filterModule.setFilter(newUserInput);
        }

        projectModule.updateEntireProjectProjtName(projectName, newUserInput);
        eventListenerModule.updateDocumentELneedsRemoveTrue(); //handles line reset if user clicks confirm but has error
        renderAll();
    }
    else {
        checkReplaceAndCreateErrorMessage(confirmCancelLine, errorTestResult)
    }
}

function createSidebarProjListName(projectName) {
    const projNameElm = createElm("span");
    addClassToElm(projNameElm, "sidebar-proj-list-name");
    projNameElm.textContent = projectName;
    //add event listener
    eventListenerModule.addELtoSidebarProjName(projNameElm);

    //to style the current selected project filter
    if (projectName === filterModule.getFilter()) {
        addClassToElm(projNameElm, "current-filter");
    }

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

    //changeable priority btn input
    const priorityBtn = card.querySelector("#todo-priority-input");
    eventListenerModule.addELToPriorityBtn(priorityBtn);

    //show/hide btn
    const showHideDetailsBtn = card.querySelector(".show-hide-details-btn");
    eventListenerModule.addELtoDefaultShowHideDetailsBtn(showHideDetailsBtn, card);
}

//starting out, i was trying to be modular and only add ELs in the EL mod, but it became silly as all logic of the EL callback needed to be in renderMod. 
export function defTodoCardShowHideDetailsBtnFunc(btn, card) {
    const innerBtnText = btn.querySelector("div");

    if (btn.classList.contains("add-sign")) {
        //edit btn to up arrow
        innerBtnText.textContent = "▲";
        btn.classList.remove("add-sign");
        addClassToElm(btn, "up-arrow");
        //edit card: remove abridged view
        card.classList.remove("def-todo-card-abridged");
    }
    else if (btn.classList.contains("up-arrow")) {
        //edit btn to add sign (is like "down arrow")
        innerBtnText.textContent = "+";
        btn.classList.remove("up-arrow");
        addClassToElm(btn, "add-sign");
        //edit card to abridged view
        addClassToElm(card, "def-todo-card-abridged");
    }
}

function populateDefaultTodoCard(card) { //passing card because it's created in js, not from HTML
    const projectSelectLine = card.querySelector("#todo-project-input");
    addProjDropDownToDefaultCard(projectSelectLine);
    
    //set default date to today
    const dueDateSelectLine = card.querySelector("#todo-dueDate-input");
    const today = new Date();
    dueDateSelectLine.value = helperModule.dateSimplifier(today);
}

function addProjDropDownToDefaultCard(projectSelectLineArg) {
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
    //init as abridged
    addClassToElm(todoCard, "todo-card-abridged");
    const templateClone = cloneTemplate("#todo-card-template");
    appendElmToLocation(templateClone, todoCard, "append");

    //add Els to HTML elements
    addELsToTodoCard(todoCard)
    //populate template
    populateTodoCardInfo(task, todoCard);
    //init style
    initStyleTodoCard(todoCard);
    //add edit btns
    addEditBtnsToTodoCardLines(todoCard, task.idNum);

    return todoCard;
}

function initStyleTodoCard(card) {
    const elmsToHide = getElmToHideInAbridgedTodoCard(card);
    changeDisplayToElmList(elmsToHide, "none");

    const taskPriority = taskModule.findTaskProp(card.id, "priority") + "-priority";
    addClassToElm(card, taskPriority);
}

function addEditBtnsToTodoCardLines(todoCardArg, taskID) {
    //grab all todo data lines (the wrappers to hide, and where the edit btns will go)
    const allTodoDataLines = todoCardArg.querySelectorAll(".todo-data-line");

    //loop through each line and add specific input types as needed
    allTodoDataLines.forEach((dataLine) => {
        //grab class name and pull out the task prop being edited
        const specificClassName = dataLine.classList[1]; //task prop in in the second array item className. May be better to assign those lines specific data attribute in the HTML template and reference here
        const propToChange = helperModule.extractTaskPropFromTodoLineClass(specificClassName);
        //grab previous data
        const dataLineOldVal = taskModule.findTaskProp(taskID, propToChange);
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
                addAttToElm(newInput, "rows", "4");
                addAttToElm(newInput, "cols", "50");
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
        //for priority line
        else if (propToChange === "priority") {
            //create date input            
            createInputCallbackFunc = () => {
                const newInput = createBtn(dataLineOldVal, "todo-priority-input");
                eventListenerModule.addELToPriorityBtn(newInput);
                addValueToElm(newInput, dataLineOldVal)
                addClassToElm(newInput, dataLineOldVal + "-priority")
                return newInput;
            }
        }

        //create edit bnt with proper callback or input creation
        addEditBtnToTodoLine( 
            dataLine, //pass through line to hide
            createInputCallbackFunc,
            taskID, //to find task by id
            propToChange
        );
    });
}

function addEditBtnToTodoLine(dataLine, inputTypeCallback, taskID, propToChangeArg) {
    const todoLineEditBtn = createEditBtn( //create edit btn 
        () => swapOutElm( //swaps out project line for edit project line on edit btn select
            dataLine, //line to hide
            inputTypeCallback, //creates new input line for user
            (event) => todoDataLineEditBtnConfirmFunc(event, taskID, propToChangeArg), //edit title logic
            true //is an edit line
        ) 
    ); 
    todoLineEditBtn.style = "display: inline";
    
    appendElmToLocation(todoLineEditBtn, dataLine, "prepend");
}

function todoDataLineEditBtnConfirmFunc(event, taskID, propToChangeArg) {
    const newUserInput = grabUserInput(event);
    const confirmCancelLine = event.target.parentElement;
    const errorResult = errorTestModule.checkHasErrorUserInputEditProject(newUserInput);
    
    //run input check
    if (propToChangeArg !== "description") { //error check exclusions
        if (!errorResult) {
            taskModule.findAndUpdateTask("idNum", taskID, propToChangeArg, newUserInput);
            eventListenerModule.updateDocumentELneedsRemoveTrue(); //handles line reset if user clicks confirm but has error
            renderAll();//maybe not renderAll? just update that line? (better UI)
        }
        else {
            checkReplaceAndCreateErrorMessage(confirmCancelLine, errorResult);
        }
    }
    if (propToChangeArg === "description") { //handle exclusions confirm click
        taskModule.findAndUpdateTask("idNum", taskID, propToChangeArg, newUserInput);
        eventListenerModule.updateDocumentELneedsRemoveTrue(); //handles line reset if user clicks confirm but has error
        renderAll();//maybe not renderAll? just update that line? (better UI)
    }
}

function populateTodoCardInfo(task, card) {
    //collect elms to populate
    const todoTitleElm = card.querySelector(".todo-title");
    const todoProjectElm = card.querySelector(".todo-project");
    const todoDescriptElm = card.querySelector(".todo-description");
    const todoDueDateElm = card.querySelector(".todo-dueDate");
    const todoPriorityElm = card.querySelector(".todo-priority");

    //link elms to task prop to populate
    todoTitleElm.textContent = task.title;
    todoProjectElm.textContent = task.project;
    todoDescriptElm.textContent  = task.description === "" ? "description" : task.description; //nicer UI to see where the description line is, vs there being just an editBtn floating there after project name
    todoDueDateElm.textContent = helperModule.formatDateforTodoCard(task.dueDate);
    todoPriorityElm.textContent = task.priority;
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
    const elmsToHide = getElmToHideInAbridgedTodoCard(card);
    const innerTextDiv = btn.querySelector("div");

    if (btn.classList.contains("down-arrow")) {
        //edit btn to up arrow
        innerTextDiv.textContent = "▲";
        btn.classList.remove("down-arrow");
        addClassToElm(btn, "up-arrow");
        //edit card: remove abridged view
        card.classList.remove("todo-card-abridged");
        changeDisplayToElmList(elmsToHide, "");

    }
    else if (btn.classList.contains("up-arrow")) {
        //edit btn to down arrow
        innerTextDiv.textContent = "▼";
        btn.classList.remove("up-arrow");
        addClassToElm(btn, "down-arrow");
        //edit card to abridged view
        addClassToElm(card, "todo-card-abridged");
        changeDisplayToElmList(elmsToHide, "none");
    }
}

function changeDisplayToElmList(elmList, displaySetting) {
    elmList.forEach((elm) => {
        elm.style = `display: ${displaySetting}`;
    });
}

//made as own function to modify as needed
function getElmToHideInAbridgedTodoCard(card) {
    //list out elms to grab (for hiding)
    const elmClassNamesToHideList = [ 
        "todo-data-line-project", 
        "todo-data-line-description", 
        "todo-data-line-priority"
    ];

    //gather elms to hide
    const elmsToHide = [];

    //find the elms in card
    elmClassNamesToHideList.forEach((className) => {
        const classNameSelector = "." + className;
        const dataElm = card.querySelector(classNameSelector);
        const elmToHide = dataElm.parentElement;
        //place in array
        elmsToHide.push(elmToHide);
    });

    return elmsToHide;
}

export function todoCardDelBtnChangeOnSelect(btn, card) {
    const delTaskConfirmLine = swapOutElm( //hides button and "replaces" with confirm delete line
        btn, //elm to hide/unhide
        () => delConfirmMessageElm("delete task?"), //makes first elm in new line
        () => confirmDelTaskFunc(card), //confirm del logic
        true //technically is a del line, not edit line. But isForDelLine is more for the strikethrough styling in the projDel mechanic (has additional first element in the confirmCancelLine)
    );
    addClassToElm(delTaskConfirmLine, "del-task-confirm-line"); //additional class
}

function confirmDelTaskFunc(card) {
    taskModule.delTask(card.id);
    eventListenerModule.updateDocumentELneedsRemoveTrue(); //handles line reset if user clicks confirm but has error
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

    const confirmCancelLine = wrapper.parentElement.querySelector(".confirm-cancel-line");
    const errorTestResult = errorTestModule.checkHasErrorUserAddProjInputs(newProjInputVal);

    //check user input
    if (!errorTestResult) {
        projectModule.addProjectToProjectList(newProjInputVal);
        
        resetHiddenElm(wrapper, newInputLine);
        eventListenerModule.updateDocumentELneedsRemoveTrue(); //handles line reset if user clicks confirm but has error
        renderAll();
        
    }
    else {
        checkReplaceAndCreateErrorMessage(confirmCancelLine, errorTestResult)
    }
}

//============================================ Derived Functions ============================================//

//this feels more connected to the render module that the error testing module
export function checkReplaceAndCreateErrorMessage(locationToCheckAndAdd, errorMessage) {
    const possibleExistingErrorMessage = locationToCheckAndAdd.querySelector(".error-message");

    if (possibleExistingErrorMessage !== null) {
        possibleExistingErrorMessage.remove();
    }

    const errorMessageElm = createErrorMessageElm(errorMessage);
    appendElmToLocation(errorMessageElm, locationToCheckAndAdd, "append");
}

function createErrorMessageElm(errorMessage) {
    const errorElm = createElm("div");
    addClassToElm(errorElm, "error-message");
    errorElm.textContent = errorMessage;

    return errorElm;
}

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
    const elmToDelVal = hiddenElm.querySelector("* > *").textContent; //grab textContent of the original line's first child (has the data value needed) <- prob should just use a data attribute in the elm

    const delLineValElm = createElm("div");
    addClassToElm(delLineValElm, "del-val-name");
    delLineValElm.textContent = elmToDelVal;

    appendElmToLocation(delLineValElm, newWrapper, "prepend");
}

function swapOutIsForEditLine(newWrapper) {
    addClassToElm(newWrapper, "edit-line");
    const firstElm = newWrapper.querySelector(":first-child");
    if (
        firstElm.tagName !== "SELECT" && //exclusions. select throws error on non-selectable elms
        firstElm.tagName !== "BUTTON" &&
        firstElm.className !== "del-confirm-message" 
    ) {
        firstElm.select(); 
    }
}

function grabUserInput(event) { //used in edit lines
    //use event to walk up to parent and down to user input
    const thisConfirmBtn = event.target;
    const thisConfirmCancelLine = thisConfirmBtn.parentElement;
    const thisUserInputElm = thisConfirmCancelLine.querySelector(":first-child"); //first child has value needed
    const rawUserInput = thisUserInputElm.value;
    const newUserInput = helperModule.userInputFormatter(rawUserInput);
    
    return newUserInput;
}

function createConfirmCancelLine(hiddenElm, firstElmFunc, confirmFunc) {
    const confirmCancelLine = createElm("div");
    addClassToElm(confirmCancelLine, "confirm-cancel-line");

    const firstElm = firstElmFunc();
    firstElm.style = "display: inline"; //to make stay on same line. Move to css? <- here seems okay. it's a temporary line
    const confirmBtn = createConfirmBtn(confirmFunc);
    const cancelBtn = createCancelBtn(hiddenElm, confirmCancelLine);

    appendElmToLocation(firstElm, confirmCancelLine, "append");
    appendElmToLocation(confirmBtn, confirmCancelLine, "append");
    appendElmToLocation(cancelBtn, confirmCancelLine, "append");

    //add EL to confirmCancelLine that resets the edit line if user moves out of that process
    eventListenerModule.resetLineHandler(confirmCancelLine, hiddenElm, cancelBtn, confirmBtn);

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
    const newDelBtn = createBtn("✖", "del-btn", selectBtnFunc);
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
    
    //needed btn with callback
    if (callbackFunc) {
        newBtn.addEventListener("click", callbackFunc);
    }
    
    return newBtn;
}

function resetHiddenElm(hiddenElm, newElmToDel, resetStyle) {
    hiddenElm.style = `display: `; //found this by accident. Setting display to nothing remove js's override of css. Css can take over again.
    
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

export function addValueToElm(elm, value) {
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