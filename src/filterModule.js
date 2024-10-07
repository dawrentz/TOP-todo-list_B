import * as taskModule from "./taskModule.js";

//init to "all" so user sees all tasks on start. Don't store filter in localStorage
let _currentFilter = "all";

export function setFilter(filter) {
    _currentFilter = filter;
}

export function getFilteredTaskList() {
    let filteredTaskList = [];
    const completeTaskList = taskModule.getTaskList();

    if (_currentFilter === "all") {
        filteredTaskList = completeTaskList;
    }
    else {
        completeTaskList.forEach((task) => {
            if (task.project === _currentFilter) {
                filteredTaskList.push(task);
            }
        });
    }

    return filteredTaskList;
}
