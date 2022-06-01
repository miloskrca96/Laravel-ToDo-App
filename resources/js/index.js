// DOM Elements
let list = document.querySelectorAll(".content-container__list")[0];
let listItems = document.querySelectorAll(".content-container__list__item");
let listWrapper = document.querySelectorAll(".content-container__list__wrapper")[0];
let taskAddForm = document.querySelectorAll(".task-add-form")[0];
let numOfTaskLeftParent = document.querySelectorAll(".content-container__list_footer__left-part > p")[0];
let noTaskMessage = document.querySelectorAll(".content-container__no-tasks")[0];
let iconClose = document.querySelectorAll(".icon__close");
let clearAllDone = document.querySelectorAll(".clear__all__done")[0];
let setTaskDone = document.querySelectorAll(".set__task_done");
let filterForm = document.querySelectorAll('.filter__tasks')[0];
let currentFilterValue = document.querySelectorAll('.current__filter-value')[0];
let updateFormMethod = document.querySelectorAll('.update__method')[0];
let updateFormId = document.querySelectorAll('.update__id')[0];

// Adding behavior for circle, on click, task is marked as done, CSS
for (let i = 0; i < listItems.length; i++) {
    // Helper function
    markTaskAsDone(listItems[i]);
    // Helper function
    setDoubleClickListener(listItems[i]);
}

// Adding behavior for circle, on click, task is marked as done, database
for (let i = 0; i < setTaskDone.length; i++) {
    setTaskDoneFormUpdate(setTaskDone[i]);
}

// Adding behavior for cross, deleting, on click, task is removed
for (let i = 0; i < iconClose.length; i++) {
    addCloseFunction(iconClose[i]);
}

// Adding behavior for filtering tasks
for(let i=0; i < filterForm.childElementCount; i++) {
    filterTasks(filterForm[i]);
}

// Set value for csrf token for forms
$.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    },
});

// Update task in database, on click, field done is set to true or false,
// depending on the previous value
function setTaskDoneFormUpdate(elem) {
    elem.addEventListener("submit", (event) => {
        event.preventDefault();

        // URL
        const url = "{{ url(" / ") }}";
        // Parent element, which contain child input element with ID value
        const parentElement = elem.parentElement;
        // Child element
        const id = parentElement.querySelectorAll("#task__id")[0].value;

        // AJAX call
        $.ajax({
            url: url,
            method: "PUT",
            data: {
                id: id,
            },
            success: function (response) {
                //console.log(response);
            },
            error: function (error) {
                console.log(error);
            },
        });
    });
}

// Double-clicking offers the ability to change the task name
function setDoubleClickListener(elem) {
    let elemText = elem.querySelectorAll("p")[0];
    let elemID = elem.querySelectorAll("#task__id")[0]

    elemText.addEventListener('dblclick', () => {
        if(!elem.classList.contains('task_done')) {
            let nameTaskEl = document.querySelectorAll(".task-add-form__input")[0];
            nameTaskEl.value = elemText.innerText;
    
            updateFormMethod.value = 'PUT';
            updateFormId.value = elemID.value;
        }
    });
}

// Set behavior for filter form
filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
});

// Function that filter tasks 
function filterTasks(elem) {
    elem.addEventListener('click', (event) => {
        // Filter only if user choose some other filter
        if(!elem.classList.contains('filter__active')) {
            event.preventDefault();

            // Remove active state from other filter
            let activeElement = document.querySelectorAll('.filter__active')[0];
            activeElement.classList.remove('filter__active');

            // Add active state to current filter
            elem.classList.add('filter__active');
            let filterVal; 

            // Set value of hidden input
            currentFilterValue.value = elem.innerText;

            switch (elem.innerText) {
                case "Active":
                    filterVal = 1
                    break;
                case "Completed":
                    filterVal = 0
                    break;
                default:
                    filterVal = 2
                    break;
            }
        
            // URL
            const url = "{{ url(" / ") }}";

            // AJAX Call
            $.ajax({
                url: url,
                method: "POST",
                data: {
                    filterData : "Filter Data",
                    filterVal : filterVal
                },
                success: function (response) {
                    clearAll();
        
                    for(let i=0; i < response.filteredTasks.length; i++) {
                        let elem = document.querySelectorAll(`#id-${response.filteredTasks[i].id}`)[0];
                        elem.classList.add('display-no');
                    }            
                },
                error: function (error) {
                    console.log(error);
                },
            });
        }
    });
}



// Form which is used for clear all done tasks from database 
clearAllDone.addEventListener("submit", (event) => {
    event.preventDefault();

    // URL
    const url = "{{ url(" / ") }}";

    // AJAX call
    $.ajax({
        url: url,
        method: "DELETE",
        data: {
            clearDone: "Clear Done",
        },
        success: function (response) {
            
            // After deleting the record in the database, 
            // it is necessary to remove the appropriate elements from the DOM
            let doneTasks = document.querySelectorAll(".task_done");
            let length = doneTasks.length;

            for (let i = 0; i < length; i++) {
                doneTasks[i].remove();
            }

            // Update message, show if there is no more taks in list
            updateMsg();
        },
        error: function (error) {
            console.log(error);
        },
    });
});

// Form which is used for add new task to database 
taskAddForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // URL
    const url = "{{ url(" / ") }}";
    // Name of task
    const name = document.querySelectorAll(".task-add-form__input")[0].value;

    if(name == "") {
        alert("Task need to have name");
    } else {

        if(updateFormId.value == "" && updateFormMethod.value == "") {
            // AJAX Call
            $.ajax({
                url: url,
                method: "POST",
                data: {
                    name: name,
                    insertData : 'Insert Data',
                },
                success: function (response) {
                    // If task is successfully added, append new element to parent, and define behavior
                    response.success
                        ? appendChild(response.data.name, response.data.id, listWrapper)
                        : console.log(error);
                    // Helper function for define behavior
                    taskListBehavior("post", taskAddForm.parentElement);

                    let addInputEleem = document.querySelectorAll(".task-add-form__input")[0];
                    addInputEleem.value = "";
                },
                error: function (error) {
                    console.log(error);
                },
            });
        } else if(updateFormId.value !== "" && updateFormMethod.value !== "") {
             // AJAX Call
             $.ajax({
                url: url,
                method: "PUT",
                data: {
                    id: updateFormId.value,
                    name : name,
                    updateData : 'Update Data',
                },
                success: function (response) {
                    updateFormId.value = "";
                    updateFormMethod.value = "";
                    document.querySelectorAll(".task-add-form__input")[0].value = ""

                    let elem = document.querySelectorAll(`#id-${response.task.id}`)[0];
                    let elemText = elem.querySelectorAll("p")[0];
                    elemText.innerText = response.task.name

                },
                error: function (error) {
                    console.log(error);
                },
            });
        }

        
    }
    
});


// Form which is used for delete task from database 
function addCloseFunction(elem) {
    elem.addEventListener("submit", (event) => {
        event.preventDefault();

        // URL
        const url = "{{ url(" / ") }}";
        // Parent element, which contain child input element with ID value
        const parentElement = elem.parentElement;
        // Child element
        const id = parentElement.querySelectorAll("#task__id")[0].value;
        
        // AJAX call
        $.ajax({
            url: url,
            method: "DELETE",
            data: {
                id: id,
            },
            success: function (response) {
                // If task is successfully deleted, remove task from list
                parentElement.remove();

                // Helper function for define behavior
                taskListBehavior("delete", parentElement);
            },
            error: function (error) {
                console.log(error);
            },
        });
    });
}

// Helper function for definition of behavior when task is added or deleted
function taskListBehavior(requestType, elem) {
    // Helper functions
    updateTaskNum(requestType, elem);
    updateMsg();
}

// Helper function that update number of tasks
function updateTaskNum(requestType, elem) {
    const numOfTaskLeftParentNum = document.querySelectorAll(
        ".content-container__list_footer__left-part > p > span"
    )[0].innerText;
    
    let num;
    if (requestType == "delete") {
        num = !elem.classList.contains("task_done") ? parseInt(numOfTaskLeftParentNum) - 1 : parseInt(numOfTaskLeftParentNum);   
    } else {
        num = parseInt(numOfTaskLeftParentNum) + 1;
    }

    //Set new info about remaining tasks
    numOfTaskLeftParent.innerHTML = `<span> ${num} items left </span>`;
}

// Function that add new task in list
function appendChild(name, id, parent) {
    // Create div
    let div = document.createElement("div");
    
    // Create form for delete task
    let form = document.createElement("form");
    // Form parameters as class, method and name
    form.classList.add("icon__close");
    form.method = "POST";
    form.name = "delete-task";


    // Create form for delete task
    let form1 = document.createElement("form");
    // Form parameters as class, method and name
    form.classList.add("icon__close");
    form1.method = "POST";
    form1.name = "update-task";
    form1.classList.add("set__task_done");

    // Form1 innerHTML
    form1.innerHTML = 
                    `<input type="hidden" name="_token" value="${$('meta[name="csrf-token"]').attr("content")}">
                    <input type="hidden" name="_method" value="put">`;
    
    // Form1 button for sumbmiting               
    let buttonElement = document.createElement("button");
    buttonElement.classList.add(
        "content-container__list__item__circle",
        "circle"
    );

    // Form1 button innerHTML    
    buttonElement.innerHTML = `<div class="icon__check">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
                                        <path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/>
                                    </svg>
                                </div>`;
    
    // Appending button to form                         
    form1.append(buttonElement);
    
    // Form innerHTML
    form.innerHTML = `
                    <input type="hidden" name="_token" value="${$('meta[name="csrf-token"]').attr("content")}">
                    <input type="hidden" name="_method" value="delete">
                    <button type="submit" class="btn__close">
                        <svg width="24px" height="24px" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 01-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z"/>
                        </svg>
                    </button>`;
    
    // Adding class and id for main element
    div.setAttribute("id", `id-${id}`);
    div.classList.add("content-container__list__item");
    
    let currentFilterValue = document.querySelectorAll('.current__filter-value')[0].value;
        
    // It need to be moved to other section
    if(currentFilterValue == "Completed") {
        div.classList.add("display-no");
    }
    
    // Additional HTML
    div.innerHTML += `<p class="content-container__list__item__text"> ${name} </p>`;
    div.innerHTML += `<input type="hidden" name="id" id="task__id" value="${id}" />`;

    // Adding forms 
    div.prepend(form1);
    div.append(form);
    
    // Adding functionality for forms and buttons
    addCloseFunction(form);
    setTaskDoneFormUpdate(form1);
    markTaskAsDone(div);
    setDoubleClickListener(div)

    // Adding task in taskWrapper element
    parent.append(div);
}

// Helper function that marks task as done
function markTaskAsDone(elem) {
    elem.children[0].addEventListener("click", () => {
        elem.classList.toggle("task_done");

        if(!elem.classList.contains("task_done")) {
            setDoubleClickListener(elem);
        } 
        let currentFilterValue = document.querySelectorAll('.current__filter-value')[0].value;
        
        // It need to be moved to other section
        if(currentFilterValue == "Active" || currentFilterValue == "Completed") {
            elem.classList.add("display-no");
        }

        const numOfTaskLeftParentNum = document.querySelectorAll(
            ".content-container__list_footer__left-part > p > span"
        )[0].innerText;

        let num =
            elem.classList.contains("task_done") == true
                ? parseInt(numOfTaskLeftParentNum) - 1
                : parseInt(numOfTaskLeftParentNum) + 1;
        
        // Set new info about remaining tasks
        numOfTaskLeftParent.innerHTML = `<span> ${num} items left </span>`;
    });
}

// Update msg function, show message if there is 0 tasks
function updateMsg() {
    // Wrapper element in which all task is stored
    let listWrapper = document.querySelectorAll(
        ".content-container__list__wrapper"
    )[0];
    
    if (listWrapper.childElementCount == 0) {
         // If there is 0 task, show message and hide list
        noTaskMessage.classList.remove("display-no");
        list.classList.add("display-no");  
    } else if (listWrapper.childElementCount > 0) {
         // If there more than 0 task, show list and hide message
        noTaskMessage.classList.add("display-no");
        list.classList.remove("display-no");
    }
}

// Function clearAll which is using when user filter tasks to remove class from items
function clearAll() {
    let listWrapper = document.querySelectorAll('.content-container__list__wrapper')[0];

    for(let i=0; i < listWrapper.childElementCount; i++) {
        if(listWrapper.children[i].classList.contains('display-no')) {
            listWrapper.children[i].classList.remove('display-no')
        }
    }
}