//accepts filtered taskList
export function render(itemList) {
    //log in console for now
    itemList.forEach((item) => {
        console.table(item);
    });
}