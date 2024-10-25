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
                hasError = true;
            }
        }
    });

    return hasError;
}

//============================================ Sidebar Checks ============================================//

export function checkHasErrorUserAddProjInputs(userInput) {
    //init checker
    let hasError = false;
    //check for blank input
    if (checkForHasBlankInput(userInput)) {
        hasError = true;
    }
    //check for duplicate project
    const currentProjectList = projectModule.getProjectList();

    if (checkForHasDuplicateInList(userInput, currentProjectList)) {
        hasError = true;
    }

    return hasError;
}

export function checkHasErrorUserInputEditProject(userInput) {
    let hasError = false;
    //check for blank input
    if (checkForHasBlankInput(userInput)) {
        hasError = true;
    }

    return hasError;
}

//============================================ Generic Checks ============================================//

function checkForHasBlankInput(input) {
    return input === "" ? true : false;
}

function checkForHasDuplicateInList(searchVal, list) {
    return list.includes(searchVal);
}