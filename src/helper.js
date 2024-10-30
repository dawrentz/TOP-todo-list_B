//helper.js

import { format } from "date-fns";

//sort array alphabetically
export function sortArrayAtoZ(array) {
    return array.sort((a, b) => a.localeCompare(b));
}

export function userInputFormatter(input) {
    //change to string
    const stringInput = input.toString();
    //remove bookend whitespace
    return stringInput.trim();
}

export function extractTaskPropFromTodoLineClass(className) {
    const classNameArray = className.split("-"); //task prop is the last word in the kebab case class name
    const propToExtract = classNameArray[classNameArray.length - 1];
    
    return propToExtract; 
}

export function formatDateforTodoCard(dateInput) {
    const fullDateAndSetTime = new Date(`${dateInput}T00:00:00`);
    const formatteddateValue = format(fullDateAndSetTime, "MMM do, yyyy (eee)").toLowerCase();
    return formatteddateValue;
}

export function dateSimplifier(dateValue) {
    const dateValueFormatted = format(dateValue, "yyyy-MM-dd");
    return dateValueFormatted;
}
