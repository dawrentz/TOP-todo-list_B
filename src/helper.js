//helper.js

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