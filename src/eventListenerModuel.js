import * as taskModule from "./taskModule.js";
import * as renderModule from "./renderModule.js";
import * as filterModule from "./filterModule.js";
import * as errorTestModule from "./errorTestModule.js";
import * as localStorageModule from "./localStorageModule.js";

//============================================ Default Card EventListeners ============================================//

//creates new task and re-renders all
export function addELToDefaultCardSubmitBtn(btn, card) {
    btn.addEventListener("click", () => {
        //collect user inputs
        const userInputsObj = taskModule.getUserInputsFromDefaultCard(card);

        //check inputs
        if (errorTestModule.checkHasErrorUserDefCardInputs(userInputsObj)) {
            //put this in errorMod function
            console.warn("ERROR: user add task input error")
        }
        else { 
            //create and add new task
            const newTask = new taskModule.Task(
                userInputsObj.title,
                userInputsObj.project, 
                userInputsObj.description, 
                userInputsObj.dueDate, 
                userInputsObj.priority
            );
            taskModule.addTasktoTaskList(newTask);
            //re-render all to reflect change
            renderModule.renderAll();
        }
    });
}

export function addELToPriorityBtn(btn) {
    btn.addEventListener("click", () => {
        //priority btn click rotation. Don't feel this needs its own module
        if (btn.textContent === "done") {
            btn.textContent = "low";
            btn.removeAttribute("value");
            renderModule.addValueToElm(btn, "low");
            btn.classList.remove("done-priority");
            btn.classList.add("low-priority");
        }
        else if (btn.textContent === "low") {
            btn.textContent = "med";
            btn.removeAttribute("value");
            renderModule.addValueToElm(btn, "med");
            btn.classList.remove("low-priority");
            btn.classList.add("med-priority");
        }
        else if (btn.textContent === "med") {
            btn.textContent = "high";
            btn.removeAttribute("value");
            renderModule.addValueToElm(btn, "high");
            btn.classList.remove("med-priority");
            btn.classList.add("high-priority");
        }
        else if (btn.textContent === "high") {
            btn.textContent = "done";
            btn.removeAttribute("value");
            renderModule.addValueToElm(btn, "done");
            btn.classList.remove("high-priority");
            btn.classList.add("done-priority");

        }
    });
}

export function addELtoDefaultShowHideDetailsBtn(btn, card) {
    btn.addEventListener("click", () => {
        renderModule.defTodoCardShowHideDetailsBtnFunc(btn, card);
    });
}

//============================================ Todo Card EventListeners ============================================//

export function addELtoTodoCardShowHideDetailsBtn(btn, card) {
    btn.addEventListener("click", () => {
        renderModule.todoCardShowHideDetailsBtnFunc(btn, card);
    });
}

export function addELtoTodoCardDelTaskBtn(btn, card) {
    btn.addEventListener("click", () => {
        renderModule.todoCardDelBtnChangeOnSelect(btn, card); 
    })
}

//============================================ Sidebar EventListeners ============================================//

//filters page to selected project
export function addELtoSidebarProjName(elm) {
    elm.addEventListener("click", () => {
        //set new filter to project select and re-render
        filterModule.setFilter(elm.textContent);
        renderModule.renderAll();
    });
}

export function addELtoSidebarAddProjBtn(btn) {
    btn.addEventListener("click", () => {
        renderModule.addProjBtnChangeOnSelect(btn);
    });
}

//"add Project Confirm Btn Func" in renderModule.js under Sidebar Functions 

//============================================ Derived Functions EventListeners ============================================//

let _documentELneedsRemove = false; //for resetLineHandler 

export function updateDocumentELneedsRemoveTrue() {
    _documentELneedsRemove = true;
}

//this handles when to reset the edit line and when to remove the document EL for reseting the edit line (have to remove EL in same scope where created: JS limitation)
export function resetLineHandler(confirmCancelLine, hiddenElm, cancelBtn, confirmBtn) {

    const resetLineListener = (event) => {
        /*
        The things to consider here are "is the event a cancelBtn click (any)?" and "is the event inside or outside the edit line?" 
        
        The complication is that this EL (now the previous) can be present when another editLine (and EL) is initiated (the previous EL can click 
        the previous cancelBtn which triggers the new EL to click the new cancelBtn).
        
        But also need to allow for the current confirm/cancel btns to be clicked
        
        And also allow for bad confirm clicks to not remove EL, hence the _documentELneedsRemove variable (user can click the confirm btn with bad input 
        not causing the confirm logic to fire. Meaning the EL is still needed). This is where the updateDocumentELneedsRemoveTrue() comes in. The 
        confirmLogic calls the function and sets _documentELneedsRemove to true. The EL here checks for _documentELneedsRemove to be true. If so, it
        removes itself and resets _documentELneedsRemove to false.  
        */

        //first case is no cancelBtns and not inside current edit selection
        if (
            event.target.className !== "cancel-btn" && 
            !confirmCancelLine.contains(event.target) && //if user clicks outside of edit line, then remove reset listener reset the line
            !hiddenElm.contains(event.target) //need this because the new event on the editBtn immediately registers outside of editLine, and the EL clicks cancelBtn
        ) { 
            document.removeEventListener("click", resetLineListener);
            cancelBtn.click(); //runs cancel logic, but counts as an event (could pass the cancel logic to here as a callback?)
        }

        //case for the original cancel button being clicked        
        else if (cancelBtn.contains(event.target) ) {
            document.removeEventListener("click", resetLineListener);
        }

        //case for the original confirm button having a good click        
        else if (confirmBtn.contains(event.target) && _documentELneedsRemove) {
            document.removeEventListener("click", resetLineListener);
            _documentELneedsRemove = false; 
        }
    }

    document.addEventListener("click", resetLineListener);
}

//============================================ Header EventListeners ============================================//

export function addELtoDemoBtn(demoBtn) {
    demoBtn.addEventListener("click", () => {
        const confimrBL = confirm("This will reset all data and populate the app with demo tasks. \n\nAre you sure?");

        if (confimrBL) {
            localStorageModule.runLocalStorageTest();
            location.reload();
        }
    });
}



