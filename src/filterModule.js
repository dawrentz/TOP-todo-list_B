//filterModuel.js

import * as taskModule from "./taskModule.js";

//init to "all" so user sees all tasks on start. Don't store filter in localStorage, want to reset to "all" on reboot
let _currentFilter = "all";

export function setFilter(filter) {
    _currentFilter = filter;
}

export function getFilter() {
    return _currentFilter;
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
