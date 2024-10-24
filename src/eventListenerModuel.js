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
        }
        else if (btn.textContent === "low") {
            btn.textContent = "med";
        }
        else if (btn.textContent === "med") {
            btn.textContent = "high";
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


