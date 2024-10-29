import * as taskModule from "./taskModule.js";
import * as renderModule from "./renderModule.js";
import * as filterModule from "./filterModule.js";
import * as errorTestModule from "./errorTestModule.js";

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

export function addELToDefaultCardPriorityBtn(btn) {
    btn.addEventListener("click", () => {
        //priority btn click rotation. Don't feel this needs its own module
        if (btn.textContent === "high") {
            btn.textContent = "low";
            btn.removeAttribute("value");
            renderModule.addValueToElm(btn, "low");
        }
        else if (btn.textContent === "low") {
            btn.textContent = "med";
            btn.removeAttribute("value");
            renderModule.addValueToElm(btn, "med");
        }
        else if (btn.textContent === "med") {
            btn.textContent = "high";
            btn.removeAttribute("value");
            renderModule.addValueToElm(btn, "high");
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

export function resetLineHandler(confirmCancelLine, hiddenElm, cancelBtn, confirmBtn) {

    const resetLineListener = (event) => {
        if (event.target.className !== "cancel-btn") { //if user clicks on another edit line, the resetlistener is applied to that line, and then this old cancelClick (a click outside of new editLine) triggers the new EL and then clicks the new cancelBtn
        
            //if use clicks outside of edit line, then reset the line and remove reset listener
            if(
                !confirmCancelLine.contains(event.target) &&
                !hiddenElm.contains(event.target)
            ) {
                document.removeEventListener("click", resetLineListener);
                cancelBtn.click(); 
            } 
            //if user selects the reset button or had confirm logic fire, remove the listener
            else if (
                cancelBtn.contains(event.target) ||
                _documentELneedsRemove
            ) {
                document.removeEventListener("click", resetLineListener);
                _documentELneedsRemove = false;
            }
        
        }
    }

    document.addEventListener("click", resetLineListener);
}

