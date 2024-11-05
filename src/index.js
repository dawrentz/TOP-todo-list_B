//index.js

import "./style.css";
import * as renderModule from "./renderModule.js";
import * as eventListenerModule from "./eventListenerModuel.js";
import * as localStorageModule from "./localStorageModule.js";

//declarations
const addProjectBtn = document.querySelector("#add-project-btn");
const demoBtn = document.querySelector("#demo-btn");

//============================================ init ============================================//

//optional for testing
// localStorage.clear();
// console.table(localStorage);
// localStorageModule.runLocalStorageTest();

//add EL to HTML btn
eventListenerModule.addELtoSidebarAddProjBtn(addProjectBtn);
eventListenerModule.addELtoDemoBtn(demoBtn);

//load localStorage data
localStorageModule.loadLocalStorageToApp();

//run
renderModule.renderAll();