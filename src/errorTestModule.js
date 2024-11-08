//errorTestModule.js

import * as projectModule from "./projectModule.js";

//============================================ Default Card Checks ============================================//

export function checkHasErrorUserDefCardInputs(userInputObj) {
    //init checker
    let hasError = false;
    // loop through user inputs, check for blanks in required fields
    Object.keys(userInputObj).forEach((prop) => {
        if (prop !== "description") { //exclusions for checkForHasBlankInput, others are required

            if (checkForHasBlankInput(userInputObj[prop])) {
                let propError = prop;
                if (prop === "dueDate") {
                    propError = "due date";
                } 

                hasError = `${propError} may not be blank`;
            }
        }
    });

    return hasError;
}

//============================================ Sidebar Checks ============================================//

export function checkHasErrorUserAddProjInputs(userInput) {
    //init checker
    let errorResult = false;
    //check for blank input
    if (checkForHasBlankInput(userInput)) {
        errorResult = "no blank inputs allowed";
    }
    //check for duplicate project
    const currentProjectList = projectModule.getProjectList();

    if (checkForHasDuplicateInList(userInput, currentProjectList)) {
        errorResult = "no repeat projects allowed";
    }

    return errorResult;
}

export function checkHasErrorUserInputEditProject(userInput) {
    let errorResult = false;
    //check for blank input
    if (checkForHasBlankInput(userInput)) {
        errorResult = "no blank inputs allowed";
    }

    return errorResult;
}

//============================================ Generic Checks ============================================//

function checkForHasBlankInput(input) {
    return input === "" ? true : false;
}

function checkForHasDuplicateInList(searchVal, list) {
    return list.includes(searchVal);
}