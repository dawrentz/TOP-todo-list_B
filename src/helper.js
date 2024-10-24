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
