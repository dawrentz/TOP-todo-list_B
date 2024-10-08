//renderModule.js

//accepts filtered taskList
export function render(itemList) {
    //log in console for now
    itemList.forEach((item) => {
        console.table(item);
    });
}

export function createNewCard() {
    const card = document.createElement("div");
    card.className = "todo-card";    
    
    return card;
}

export function renderToDOM(element, location) {
    location.append(element);
}
