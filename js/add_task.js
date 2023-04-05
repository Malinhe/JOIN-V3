let tasks = [];
let subtasks = [];
let subtaskCheck = [];
let loading = false;

async function loadArrayFromBackend() {
    // tasks = getArrayFromBackend('tasks');
     await downloadFromServer();
    tasks = await JSON.parse(backend.getItem('tasks')) || [];    
}

// Principal function made up by a set of input elements //

async function addTask() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let category = document.getElementById('categoryContent');
    let date = document.getElementById('due_date');
    let prioStat = setPrioStat();
    preventPastDates();
    if (!category) {
        alert("Select a category!");
        new_category();
        return false;
    }
    if (assignedLabelToBoard == 0) {
        alert("Select an assigned contact!");
        return false;
    }
    if (prioStat == 0) {
        alert("Select a priority button!");
        return false;
    }
    loading = true;
    if (loading) {
        document.getElementById('bo_changes_addTask').classList.add('disable');
    }
    let task = {
        "title": title.value,
        "description": description.value,
        "category": category.innerHTML,
        "categoryColor": clickedColor,
        "assignedColorToBoard": assignedColorToBoard,
        "assignedLabelToBoard": assignedLabelToBoard,
        "assignedNameToBoard": assignedNameToBoard,
        "prio": prioStat,
        "date": date.value,
        "subtasks": subtaskCheck,
        "status": "Todo",
        "id": new Date().getTime()
    }
    tasks.push(task);
    console.log(tasks);
    clearTask();
    await backend.setItem("tasks", JSON.stringify(tasks));
    alert('Task added to Board!');
    NavRenderBoard(); NavClick(2);
}

// Selection of dates in the past are not accepted as part of the form validation //

function preventPastDates() {
    let today = new Date().toISOString().split('T')[0];
    let date = document.getElementById('due_date');
    date.setAttribute('min', today);
}

// The current state (prioStat) of the priority buttons will be transmitted via addTask() //

function setPrioStat() {
    let prioStat = '';
    if (urgent_clicked) prioStat = "Urgent";
    if (medium_clicked) prioStat = "Medium";
    if (low_clicked) prioStat = "Low";
    return prioStat;
}

// Delete all tasks that are stored on the backend server //

function deleteTasks() {
    backend.deleteItem('tasks');
}

// Clears all arrays and input fields created by addTask() //

function clearTask() {
    document.removeEventListener('click', closeDropdownContacts);
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let date = document.getElementById('due_date');
    let subtask = document.getElementById('inputSubtask');
    let subtaskList = document.getElementById('list_subtask');
    let checkbox = document.getElementById('checkboxYou');
    let labels = document.getElementById('labels');
    title.value = '';
    description.value = '';
    clickedColor = [];
    categoryColor = [];
    categoryContent = [];
    categorySelected = [];
    assignedColorToBoard = [];
    assignedLabelToBoard = [];
    assignedNameToBoard = [];
    assignedColor = [];
    assignedLabel = [];
    assignedName = [];
    contactstorage = [];
    subtasks = [];
    subtaskCheck = [];
    labels.innerHTML = '';
    if (document.querySelector('#label-list')) {
        checkbox.checked = false;
    }
    date.value = '';
    subtask.value = '';
    subtaskList.innerHTML = '';
    defaultModeCategory();
    assignedDefaultState();
    urgentButtonDefault();
    mediumButtonDefault();
    lowButtonDefault();
    deleteTasks();
}

// Shows hover effect for clearTask() //

function addHover(img) {
    document.getElementById('clear-icon').src = img;
    document.getElementById('clear-icon').classList.add('clear-icon-hover');
}

function removeHover(img) {
    document.getElementById('clear-icon').src = img;
    document.getElementById('clear-icon').classList.remove('clear-icon-hover');
}

// This section is adressed to the category part //

// Dropdown menu for selecting a category is performed by showCategory() and showCategoryDefault() //

let clickedDropdown = false;

function showCategory() {
    document.getElementById("dropdown").classList.add('dropdown');
    if (clickedDropdown == false) {
        document.getElementById("content").classList.toggle("show");
        clickedDropdown = true;
    } else {
        showCategoryDefault();
    }
}

function showCategoryDefault() {
    document.getElementById("content").classList.toggle("show");
}

// Define a new category //

function new_category() {
    document.getElementById('assigned-span').style = "margin-top: 60px;";
    let new_category = document.getElementById('dropdown');
    new_category.classList.add('height-default');
    new_category.classList.remove('dropdown');
    new_category.innerHTML = new_categoryTemplate();
    for (let i = 0; i < allColors.length; i++) {
        document.getElementById('img-picker').innerHTML += /*html*/`
        <img class="color" onclick="fillColor(${i})" src= ${allColors[i]['img']}>`;
    }
    document.getElementById('design').focus();
}

function new_categoryTemplate() {
    return `
    <div id="new-category" class="new_category">
        <input id="design" class="categorybox" type="text" placeholder="New category name" onfocus="this.placeholder=''" onblur="this.placeholder='New category name'">
        <div class="img_new_category">
            <img class="img-cancelSubtask" src='./img/subtask-cancel.png' onclick="clearInput()">
            <img src="./img/vertical.png">
            <img class="img-addSubtask" src='./img/addSubtask.png' onclick="fillInput()">
        </div>
    </div>
    <div class="img-color-picker" id='img-picker'></div>
    `;
}

function clearInput() {
    let input = document.getElementById('design');
    if (input.value == '') {
        defaultModeCategory();
    } else {
        input.value = '';
        input.focus();
    }
}

// Assign a color for your category //

let allColors = [
    {
        "img": './img/color-1.png',
        "bg-color": '#8AA4FF'
    },
    {
        "img": './img/color-2.png',
        "bg-color": '#FF0000'
    },
    {
        "img": './img/color-3.png',
        "bg-color": '#2AD300'
    },
    {
        "img": './img/color-4.png',
        "bg-color": '#FF8A00'
    },
    {
        "img": './img/color-5.png',
        "bg-color": '#E200BE'
    },
    {
        "img": './img/color-6.png',
        "bg-color": '#0038FF'
    },
    {
        "img": './img/sales-img.png',
        "bg-color": '#FC71FF'
    },
    {
        "img": './img/backoffice-img.png',
        "bg-color": '#1FD7C1'
    }
];

let clickedColor = [];

function pick_color(i) {
    document.getElementById('assigned-span').style = "margin-top: 34px;";
    let category = document.getElementById('design');
    clickedColor = [];
    clickedColor.push(allColors[i]['bg-color']);
    categoryColor.push(allColors[i]['img']);
    categoryContent.push(category.value);
    categorySelected.push(i);
    document.getElementById('img-picker').classList.add("d-none");
    document.getElementById('new-category').classList.remove("new_category");
    document.getElementById('new-category').innerHTML = /*html*/`
    <div onclick="renderCategoryTemplate()" class="design">
        <div class="add_changeColor">
            <div id="categoryInput" class="categorybox design-picked caret-hidden">
                <span id="categoryContent">${category.value}</span>
            </div>
            <img class="color add_setColor" src=${allColors[i]['img']}>
        </div>
        <img class="open-img" src = "./img/open.png">
    </div>
    `;
    document.getElementById('categoryInput').style = "width: unset";
}

// As part of form validation you have to combine category and color altogether //

function fillInput() {
    let input = document.getElementById('design');
    if (input.value == '') {
        input.focus();
        return 0 }
    else {
        alert("Please select a color, before you continue!")
    }
}

function fillColor(i) {
    let input = document.getElementById('design');
    if (input.value == '') {
        alert("Please declare a name for your category, before you pick a color!")
        input.focus();
        return 0;
    }
    pick_color(i)
}

// Brings you back to the dropdown menu //

function renderCategoryTemplate() {
    document.getElementById('dropdown').classList.add('dropdown');
    document.getElementById('dropdown').innerHTML = /*html*/`
    <div onclick="dropdownClear()" id="new_category" class="dropdown-container">
        <div class="categorybox">Select task category</div>
        <div><img class="open-img" src="./img/open.png"></div>
    </div>
    <div class="dropdown-content" id="content-clear">
        <div onclick="new_category()" class="dropdown-child">
            <span class="dropdown-item">New category</span>
        </div>
        <div id="renderCategory"></div>
    </div>`;
    renderCategory();
    dropdownClear();
}

let categoryColor = [];
let categoryContent = [];
let categorySelected = [];

function renderCategory() {
    for (let j = 0; j < categoryContent.length; j++) {
     document.getElementById('renderCategory').innerHTML += /*html*/`
     <div onclick="showSelectedCategory(${categorySelected[j]})" class="dropdown-child">
        <span id="selectedCategory" class="dropdown-item">${categoryContent[j]}</span>
        <img class="color add_setColor" src=${categoryColor[j]}>
     </div>`;   
    }
}

// Opens the dropdown menu //

function dropdownClear() {
    document.getElementById("content-clear").classList.toggle("show");
}

// Select your prefered category displayed within the dropdown menu //

function showSelectedCategory(i) {
    clickedColor = [];
    clickedColor.push(allColors[i]['bg-color']);
    let category = document.getElementById('selectedCategory').innerHTML;
    document.getElementById('dropdown').classList.remove('dropdown');
    document.getElementById('dropdown').innerHTML = /*html*/`
    <div onclick="renderCategoryTemplate()" class="design">
        <div class="add_changeColor">
            <div id="categoryInput" class="categorybox design-picked caret-hidden">
                <span id="categoryContent">${category}</span>
            </div>
            <img class="color add_setColor" src=${allColors[i]['img']}>
        </div>
        <img class="open-img" src = "./img/open.png">
    </div>`;
    document.getElementById('categoryInput').style = "width: unset";
}

// Set dropdown menu on default //

function defaultModeCategory() {
    document.getElementById('dropdownArea').innerHTML = /*html*/`
    <div id="dropdown" class="category-selection">
        <div onclick="showCategory()" id="new-category" class="dropdown-container">
            <div class="categorybox">Select task category</div>
            <img class="open-img" src="./img/open.png">
        </div>
        <div class="dropdown-content" id="content">
            <div onclick="new_category()" class="dropdown-child">
                <span class="dropdown-item">New category</span>
            </div>
            <div id="renderCategory"></div>
        </div>
    </div>`;
    renderCategory();
}

// This section is adressed to the assigned part //

let selection_clicked = false;
let dropdown_clicked = false;

// Dropdown menu for selecting contacts is performed by showAssigned() and showAssignedDefault() //

function showAssigned() {
    editLabelColors();
    document.addEventListener('click', closeDropdownContacts);
    document.getElementById('dropdownAssigned').classList.add('height');
    checkboxDropdown();
    if (dropdown_clicked == false) {
        document.getElementById('labels').classList.add('d-none');
        document.getElementById("content-assigned").classList.toggle("show");
        document.getElementById("dropdownAssigned").classList.add("dropdown");
        dropdown_clicked = true;
    } else {
        showAssignedDefault();
    }
    if (selection_clicked) {
        document.getElementById('dropdownAssigned').classList.remove("height-default");
    }
}

// Close dropdown menu clicking outside of it //

function closeDropdownContacts(event) {
    let dropdown = document.getElementById('dropdownAssigned');
    if (!dropdown.contains(event.target)) {
        showAssignedDefault();
        document.removeEventListener('click', closeDropdownContacts);
    }
}

// Makes checkboxes round, if clicked //

function checkboxDropdown() {
    let labelYou = document.getElementById('label-list');
    let checkYou = document.getElementById('checkboxYou');
    if (labelYou) {
        checkYou.checked = true
        document.getElementById('checkbox-round').classList.add('border-radius-round');
    } else {
        checkYou.checked = false;
        document.getElementById('checkbox-round').classList.remove('border-radius-round');
    }
    for (let j = 0; j < assignedName.length; j++) {
        let labelContacts = document.getElementById(`label-list${contactstorage[j]}`);
        if (!labelContacts.classList.contains('d-none')) {
            document.getElementById(`checkbox-round-contact${j}`).classList.add('border-radius-round');
        } else {
            labelContacts.classList.contains('d-none');
            document.getElementById(`checkbox-round-contact${j}`).classList.remove('border-radius-round');
        }
    }
}

// In editLabelColors() all the colors are assigned to the corresponding contacts from contactsbook.js //

let colorBox = [];
let colorBoxTotal = [];
let filterpush = true;

function editLabelColors() {
    initGlobalVariables();
    if (filterpush) {
        for (let currentLabelColor = 0; currentLabelColor < labelColors.length; currentLabelColor++) {
            colorBox.push(labelColors[currentLabelColor]);
            colorBoxTotal = colorBox.concat(colorBox, colorBox, colorBox);
        }
        filterpush = false;
    }
}

function showAssignedDefault() {
    initGlobalVariables();
    document.getElementById('labels').classList.remove('d-none');
    document.getElementById("content-assigned").classList.toggle("show");
    document.getElementById("dropdownAssigned").classList.remove("dropdown");
    dropdown_clicked = false;
}

// Within the dropdown menu you can select and invite your team members by clickinvite() //

function clickinvite() {
    dropdown_clicked = false;
    document.removeEventListener('click', closeDropdownContacts);
    document.getElementById('labels').classList.remove('d-none');
    let invite = document.getElementById('dropdownAssigned');
    document.getElementById('dropdownAssigned').classList.add("assign-selection");
    invite.innerHTML = clickInviteState();
    document.getElementById('email').focus();
}

function clickInviteState() {
    return `
    <div id="contact" class="new_category">
        <input onkeyup="filterSelection()" id="email" class="categorybox" type="text" placeholder="Contact email" onfocus="this.placeholder=''" onblur="this.placeholder='Contact email'" autocomplete="off">
        <div id="initials-icon" class="img_new_category">
            <img class="img-cancelSubtask" src='./img/subtask-cancel.png' onclick="assignedDefaultState()">
            <img src="./img/vertical.png">
            <img class="img-addSubtask" src='./img/addSubtask.png' onclick="formvalidation()">
        </div>
    </div>
    <div id="searchResults"></div>
    `;
}

// Here is proofed if you type in at least one searchable character // 

function formvalidation() {
    let autosearch = document.getElementById('email').value;
    let valid = /^[a-zA-Z]+$/;
    if (autosearch == '') {
        alert('Type in at least one character!');
        document.getElementById('email').focus();
    } else if (!autosearch.match(valid)) {
        alert('Type in only characters!');
        document.getElementById('email').value = '';
        document.getElementById('email').focus();
    }
}

// Filtering all the available e-mail results from contactsbook.js for all searchable characters // 

function filterSelection() {
    initGlobalVariables();
    document.getElementById('dropdownAssigned').classList.add("height-default");
    document.getElementById('searchResults').innerHTML = '';
    for (let i = 0; i < book.length; i++) {
        let search = document.getElementById('email').value.toLowerCase().trim();
        let searchBox = book[i]['mail'];
        if (searchBox.indexOf(search) == 0 && search.length >= 1) {
            document.getElementById('searchResults').innerHTML += `<div class="autocomplete" onclick="autocomplete(${i})" id="result${i}">${searchBox}</div>`;
            document.getElementById('searchResults').classList.add('label-border');
        } else if (searchBox.indexOf(search) == 0 && search.length == 0) {
            document.getElementById('searchResults').classList.remove('label-border');
        }
    }
}

// Displaying all the results from filterSelection() //

function autocomplete(i) {
    document.getElementById('email').value = '';
    document.getElementById('email').value = document.getElementById(`result${i}`).innerHTML;
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('searchResults').classList.remove('label-border');
    document.getElementById('initials-icon').innerHTML = `
    <img class="img-cancelSubtask" src='./img/subtask-cancel.png' onclick="clickinvite()">
    <img src="./img/vertical.png">
    <img class="img-addSubtask" src='./img/addSubtask.png' onclick="showSelection(${i})">
    `;
}

// Displaying the label of the selected result from autocomplete(i) //

let assignedColorToBoard = [];
let assignedLabelToBoard = [];
let assignedNameToBoard = [];
let assignedColor = [];
let assignedLabel = [];
let assignedName = [];
let labelproof = [];
let contactstorage = [];

function showSelection(i) {
    initGlobalVariables();
    selection_clicked = true;
    document.getElementById('dropdownAssigned').classList.remove("dropdown");
    document.getElementById('dropdownAssigned').classList.remove("height");
    document.getElementById('dropdownAssigned').classList.add("height-default");
    if (assignedName.includes(book[i]['contact'])) {
        alert('Already selected! Choose a new contact!');
        document.getElementById('email').value = '';
        document.getElementById('email').focus();
        return false;
    }
    document.getElementById('labels').innerHTML +=
        `<span id="label-list${i}" class="add-assignedlabel">${book[i]['name'][0]}${book[i]['lastName'][0]}</span>`;
    document.getElementById(`label-list${i}`).style.backgroundColor = `${colorBoxTotal[i]}`;
    pushToArrays(i);
    assignedDefaultState();
}

function pushToArrays(i) {
    assignedColor.push(`${colorBoxTotal[i]}`);
    assignedLabel.push(`${book[i]['name'][0]}${book[i]['lastName'][0]}`);
    assignedName.push(`${book[i]['contact']}`);
    assignedColorToBoard.push(`${colorBoxTotal[i]}`);
    assignedLabelToBoard.push(`${book[i]['name'][0]}${book[i]['lastName'][0]}`);
    assignedNameToBoard.push(`${book[i]['contact']}`);
    labelproof.push(`label-list${i}`);
    contactstorage.push(i);
}

// Make the dropdown menu available after selecting a new contact //

function assignedDefaultState() {
    document.getElementById('dropdownAssigned').innerHTML = `
    <div onclick="showAssigned()" id="new_assigned" class="dropdown-container">
        <div class="assignedbox">Select contacts to assign</div>
        <img src="./img/open.png">
    </div>
    <div class="dropdown-content" id="content-assigned">
        <label id="assigned-you" class="dropdown-assigned dropdown-item">You
            <input id="checkboxYou" onclick="clickyou()" type="checkbox">
            <span id="checkbox-round" class="dropdown-item checkbox-assigned"></span>
        </label>
        <div id="renderContacts"></div>
        <div onclick="clickinvite()" class="dropdown-assigned">
            <span class="dropdown-item">Invite new contact</span>
            <img class="img-invite" src="./img/invite-sign.png">
        </div>
    </div>
    `;
    renderContacts();
}

// Make all the selected contacts displayed within the dropdown menu //

function renderContacts() {
    for (let j = 0; j < assignedName.length; j++) {
        document.getElementById('renderContacts').innerHTML += `
        <label id="assigned-contact${j}" class="dropdown-assigned dropdown-item">${assignedName[j]}
            <input id="checkboxContact${j}" onclick="clickcontact(${j})" type="checkbox">
            <span id="checkbox-round-contact${j}" class="dropdown-item checkbox-assigned"></span>
        </label>
        `;
    }
    for (let j = 0; j < assignedName.length; j++) {
        if (labelproof[j]) {
            document.getElementById(`checkboxContact${j}`).checked = true;
        }
        if (document.getElementById(`label-list${contactstorage[j]}`).classList.contains('d-none')) {
            document.getElementById(`checkboxContact${j}`).checked = false;
        }
    }
}

// Make yourself selectable as an assigned contact displayed within the dropdown menu as well //

function clickyou() {
    let checkYou = document.getElementById('checkboxYou');
    if (checkYou.checked == true) {
        assignedNameToBoard.push('You');
        assignedLabelToBoard.push('NN');
        assignedColorToBoard.push(`${colorBoxTotal[5]}`);
        document.getElementById('labels').innerHTML +=
            `<span id="label-list" class="add-assignedlabel">NN</span>`;
        document.getElementById('label-list').style.backgroundColor = `${colorBoxTotal[5]}`;
        document.getElementById('checkbox-round').classList.add('border-radius-round');
    } else if (checkYou.checked == false) {
        assignedNameToBoard.splice(assignedNameToBoard.indexOf('You'), 1);
        assignedLabelToBoard.splice(assignedLabelToBoard.indexOf('NN'), 1);
        assignedColorToBoard.splice(assignedColorToBoard.indexOf(`${colorBoxTotal[5]}`, 1));
        document.getElementById('label-list').remove();
        document.getElementById('checkbox-round').classList.remove('border-radius-round');
    }
}

// Make any selected contact from renderContacts() available by opt-in and opt-out choice //

function clickcontact(j) {
    let checkYou = document.getElementById('checkboxYou');
    let checkContacts = document.getElementById(`checkboxContact${j}`);
    if (checkContacts.checked == true) {
        document.getElementById(`label-list${contactstorage[j]}`).classList.remove('d-none');
        document.getElementById(`checkbox-round-contact${j}`).classList.add('border-radius-round');
    }
    else if (checkContacts.checked == false) {
        document.getElementById(`label-list${contactstorage[j]}`).classList.add('d-none');
        document.getElementById(`checkbox-round-contact${j}`).classList.remove('border-radius-round');
    }
    assignedColorToBoard = [];
    assignedLabelToBoard = [];
    assignedNameToBoard = [];
    if (checkYou.checked == true) {
        assignedNameToBoard.push('You');
        assignedLabelToBoard.push('NN');
        assignedColorToBoard.push(`${colorBoxTotal[5]}`);
    }
    for (let j = 0; j < assignedName.length; j++) {
        if (!document.getElementById(`label-list${contactstorage[j]}`).classList.contains('d-none')) {
            assignedNameToBoard.push(book[contactstorage[j]]['contact']);
            assignedLabelToBoard.push(`${book[contactstorage[j]]['name'][0]}${book[contactstorage[j]]['lastName'][0]}`);
            assignedColorToBoard.push(`${colorBoxTotal[contactstorage[j]]}`);
        }
    }
}

// This section is adressed to the priority buttons //

// Default mode of all priority buttons (unclicked) //

function urgentButtonDefault() {
    document.getElementById('prioUrgent').style.backgroundColor = "#FFFFFF";
    document.getElementById('whiteUrgent').style.color = "#000000";
    document.getElementById('img-up-white').src = "./img/up.png";
    inactiveModeRed();
    urgent_clicked = false;
}

function mediumButtonDefault() {
    document.getElementById('prioMedium').style.backgroundColor = "#FFFFFF";
    document.getElementById('whiteMedium').style.color = "#000000";
    document.getElementById('img-middle-white').src = "./img/middle.png";
    inactiveModeOrange();
    medium_clicked = false;
}

function lowButtonDefault() {
    document.getElementById('prioLow').style.backgroundColor = "#FFFFFF";
    document.getElementById('whiteLow').style.color = "#000000";
    document.getElementById('img-down-white').src = "./img/down.png";
    inactiveModeGreen();
    low_clicked = false;
}

// All priority buttons are assigned to a specific color, if clicked //

let urgent_clicked = false;
let medium_clicked = false;
let low_clicked = false;

function changeToRed() {
    activeModeRed();
    if (urgent_clicked == false) {
        document.getElementById('prioUrgent').style.backgroundColor = "#FF3D00";
        document.getElementById('whiteUrgent').style.color = "#FFFFFF";
        document.getElementById('img-up-white').src = "./img/arrowUpWhite.png";
        urgent_clicked = true;
    } else {
        urgentButtonDefault();
    }
    mediumButtonDefault();
    lowButtonDefault();
}

function changeToOrange() {
    activeModeOrange();
    if (medium_clicked == false) {
        document.getElementById('prioMedium').style.backgroundColor = "#FFA800";
        document.getElementById('whiteMedium').style.color = "#FFFFFF";
        document.getElementById('img-middle-white').src = "./img/arrowMiddleWhite.png";
        medium_clicked = true;
    } else {
        mediumButtonDefault();
    }
    urgentButtonDefault();
    lowButtonDefault();
}

function changeToGreen() {
    activeModeGreen();
    if (low_clicked == false) {
        document.getElementById('prioLow').style.backgroundColor = "#7AE229";
        document.getElementById('whiteLow').style.color = "#FFFFFF";
        document.getElementById('img-down-white').src = "./img/arrowDownWhite.png";
        low_clicked = true;
    } else {
        lowButtonDefault();
    }
    urgentButtonDefault();
    mediumButtonDefault();
}

// Shows hover effects of all priority buttons // 

function addPrioUrgentHover() {
    document.getElementById('prioUrgent').classList.add('prio-urgent-hover');
    if (medium_clicked) {
        inactiveModeOrange()
    }
    if (low_clicked) {
        inactiveModeGreen();
    }
}

function removePrioUrgentHover() {
    document.getElementById('prioUrgent').classList.remove('prio-urgent-hover');
    if (medium_clicked) {
        activeModeOrange()
    }
    if (low_clicked) {
        activeModeGreen();
    }
}

function addPrioMediumHover() {
    document.getElementById('prioMedium').classList.add('prio-medium-hover');
    if (urgent_clicked) {
        inactiveModeRed();
    }
    if (low_clicked) {
        inactiveModeGreen();
    }
}

function removePrioMediumHover() {
    document.getElementById('prioMedium').classList.remove('prio-medium-hover');
    if (urgent_clicked) {
        activeModeRed();   
    }
    if (low_clicked) {
        activeModeGreen();
    }
}

function addPrioLowHover() {
    document.getElementById('prioLow').classList.add('prio-low-hover');
    if (urgent_clicked) {
        inactiveModeRed();
    }
    if (medium_clicked) {
        inactiveModeOrange();
    }

}

function removePrioLowHover() {
    document.getElementById('prioLow').classList.remove('prio-low-hover');
    if (urgent_clicked) {
        activeModeRed();   
    }
    if (medium_clicked) {
        activeModeOrange();
    }
}

// If hover effect is removed, shadow effect still keep activated as long as the button is clicked //

function activeModeRed() {
    document.getElementById('prioUrgent').classList.add('add_box-shadow');
}

function inactiveModeRed() {
    document.getElementById('prioUrgent').classList.remove('add_box-shadow');
}

function activeModeOrange() {
    document.getElementById('prioMedium').classList.add('add_box-shadow');
}

function inactiveModeOrange() {
    document.getElementById('prioMedium').classList.remove('add_box-shadow');
}

function activeModeGreen() {
    document.getElementById('prioLow').classList.add('add_box-shadow');
}

function inactiveModeGreen() {
    document.getElementById('prioLow').classList.remove('add_box-shadow');
}

// This section is adressed to the subtasks part //

// Default mode before you create a subtask //

function showDefaultSubtask() {
    let defaultSubtask = document.getElementById('img-replace');
    defaultSubtask.innerHTML = /*html*/`
    <img id="img-subtask" class="plus-icon" src="./img/plus.png">
    `;
}

// Here you can type in your subtask //

function clear_subtaskInput() {
    let typeSubtask = document.getElementById('img-replace');
    typeSubtask.innerHTML = /*html*/`
    <img class="img-cancelSubtask" src='./img/subtask-cancel.png' onclick="clearInputSubtask()">
    <img src="./img/vertical.png">
    <img id="pressEnter" class="img-addSubtask" src='./img/addSubtask.png' onclick="showSubtask()">
    `;
}

// Clears your input and take you back to the default mode //

function clearInputSubtask() {
    let input = document.getElementById('inputSubtask');
    input.value = '';
    showDefaultSubtask();
}

// Principal function that displays all your subtasks //

function showSubtask() {
    let input = document.getElementById('inputSubtask');
    let subtask = document.getElementById('list_subtask');
    if (input.value == '') { return 0 }
    else {
        subtasks.push(input.value);
        subtask.innerHTML = '';
        for (let i = 0; i < subtasks.length; i++) {
            subtask.innerHTML += `
            <li>
                <label class="subtask-wrapper">
                    <input id='subtask${i}' onclick="selectSubtask()" type="checkbox">
                    <span class="subtask-item"></span>
                    ${subtasks[i]}
                </label>
            </li>`;
        }
        checkSubtasks();
    }
    input.value = '';
    input.focus();
}

// Trigger showSubtask() click on Enter //

function showSubtaskEnter() {
    let input = document.getElementById('inputSubtask');
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById('pressEnter').click();
        }
    })
}

// Verify your checkboxes //

function checkSubtasks() {
    for (let i = 0; i < subtasks.length; i++) {
        let subtaskBox = document.getElementById(`subtask${i}`);
        if (subtaskCheck.includes(subtasks[i])) {
            subtaskBox.checked = true;
        } else {subtaskBox.checked = false}
    }
}

// Here you select your preferred subtasks //

function selectSubtask() {
    subtaskCheck = [];
    for (let i = 0; i < subtasks.length; i++) {
        let subtaskBox = document.getElementById(`subtask${i}`);
        if (subtaskBox.checked == true)
            subtaskCheck.push(subtasks[i]);
        if (subtaskBox.checked == false) {
            subtaskCheck.splice(i, 1);
        }
    }
}