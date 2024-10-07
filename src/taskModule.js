//taskModule.js

const _taskList = [];

export function getTaskList() {
    // Return a shallow copy of the array, but deep copy the objects within. This is to protect the task data.
    return _taskList.map(task => ({ ...task }));
} 

//push new task. Needs to be in Task class and run automatically?
export function addTasktoTaskList(task) {
    _taskList.push(task);
}

let idNum = 0;

//task creation
export class Task{
    constructor(title, project, description, dueDate, priority) {
        this.title = title;
        this.project = project;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.idNum = idNum++;
    }

    getProp(prop) {
        return this[prop];
    }

    setProp(prop, newVal) {
        this[prop] = newVal;
        //need checks for data types. 
        //need check for project on list
    }
}

export function delTask(idNum) {
    _taskList.forEach((task, index) => {
        if (task.idNum === idNum) {
            _taskList.splice(index, 1);
        }
    });
} 

export function findTaskIDsInProject(projectName) {
    const tasksIDsInProject = [];
    _taskList.forEach((task) => {
        if (task.project === projectName) {
            tasksIDsInProject.push(task.idNum);
        }        
    });

    return tasksIDsInProject;
}
