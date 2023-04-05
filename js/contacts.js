// setURL("https://gruppe-375.developerakademie.net/backend");

let alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

let contacts; // from ./contactsbook.js
let contactToEdit;
let labelColors;
let currentLabelColor;
let last_id;
let selectedContact;

// variables to get the current width of an element
let navigation_left;
let navigation_left_width;
let navTopBar;
// variables for HTML elements
let contactsListContainer;
let contactListContainerWidth;
let navTopBarHeight;
let contactsPage;
// let contactToEditIndex;

function initGlobalVariables() {
  contacts = book;
  labelColors = [
    BG_COLOR_SUPERNOVA,
    BG_COLOR_TABASCO,
    BG_COLOR_WEBORANGE,
    BG_COLOR_BLAZEORANGE,
    BG_COLOR_MALACHITE,
    BG_COLOR_APPLE,
    BG_COLOR_CYAN_AQUA,
    BG_COLOR_CERULEAN,
    BG_COLOR_BLUE_RIBBON,
    BG_COLOR_JAVA,
    BG_COLOR_PURPLE_PIZZAZZ,
    BG_COLOR_HELIOTROPE,
    BG_COLOR_ELECTRIC_VIOLET,
  ];

  currentLabelColor = 0;

  last_id = "XX";
}

function initContacts() {
  // console.log("initContacts()");
  initGlobalVariables();

  navigation_left = document.getElementById("navigation-bar-left");
  navigation_left_width = navigation_left.offsetWidth;

  contactsListContainer = document.getElementById("contacts-list-container");
  contactListContainerWidth = contactsListContainer.offsetWidth;

  contactsPage = document.getElementById("contacts-id");

  // trying to fix bug after adding new contact
  document.getElementById("contact-list").innerHTML = "";

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    insertContactToContactList(contact);
  }
  // console.log("Contacts to add:");
  // console.log(contacts);

  // save contactsToDatabase
  saveContactsToDataBase();

  // render contactInformation container according to width of nav_left and contactListContainer
  let contactInformation = document.getElementById("contact-information");
  contactInformation.style = `width: calc(100vw - ${navigation_left_width}px - ${contactListContainerWidth}px`;

  // render contact list height according to height of nav top bar
  navTopBar = document.getElementById("nav-top-bar");
  navTopBarHeight = navTopBar.offsetHeight;
}

function saveContactsToDataBase() {
  // console.log("saveContactsToDataBase()");
  for (let index = 0; index < contacts.length; index++) {
    const element = contacts[index];
    localStorage.setItem(
      `contacts_${contacts[index]}_firstName`,
      contacts[index]["name"]
    );
    localStorage.setItem(
      `contacts_${contacts[index]}_lastName`,
      contacts[index]["lastName"]
    );
    localStorage.setItem(
      `contacts_${contacts[index]}_phonenumber`,
      contacts[index]["phonenumber"]
    );
    localStorage.setItem(
      `contacts_${contacts[index]}_mailaddress`,
      contacts[index]["mail"]
    );
  }

  backend.setItem("contactsBook", contacts);
  // console.log("Alright. Successfully saved contacts to backend.");
  // backend.setItem(`contacts_${contacts[index]['letter']}_firstNames`, JSON.stringify(contacts[index]['names']));
  // backend.setItem(`contacts_${contacts[index]['letter']}_lastNames`, JSON.stringify(contacts[index]['lastNames']));
  // backend.setItem(`contacts_${contacts[index]['letter']}_phonenumbers`, JSON.stringify(contacts[index]['phonenumbers']));
  // backend.setItem(`contacts_${contacts[index]['letter']}_mailaddresses`, JSON.stringify(contacts[index]['mail']));
  // }
}

function insertContactToContactList(contact) {
  // console.log("insertContactToContactList");
  // console.log("contacts.length: ", contacts.length);
  const name = contact["name"];
  const lastName = contact["lastName"];
  const emailAddress = contact["mail"];
  const fName = name.charAt(0);
  const lName = lastName.charAt(0);

  if (currentLabelColor == labelColors.length) {
    currentLabelColor = 0;
  }

  let bgColor = labelColors[currentLabelColor];
  // console.log('bgColor: ', bgColor);
  currentLabelColor++;

  document.getElementById(
    "contact-list"
  ).innerHTML += `<div id="${name}-${lastName}" class="con_contactListElement hoverEffect" onclick="contactClicked(id)">
      <span id="label-${name}-${lastName}" class="con_contactListElementLabel">${fName}${lName}</span>  
      <div>
        <span>${name} ${lastName}</span>
        <span class="con_contactListElementEmail">${emailAddress}</span>
      </div>
      
    </div>`;
  document.getElementById(`label-${name}-${lastName}`).style.backgroundColor =
    bgColor;
}

function newContact() {
  // alert("You wanna add new contact?!");
  document.getElementById("new-popup").classList.remove("d-none");
  document.getElementById("new-popup").style.visibility = "visible";
  document.getElementById("new-popup").style.display = "flex";
  document.getElementById("new-popup-form").classList.remove("d-none");
}

function cancelAddNewContact() {
  document.getElementById("new-popup").classList.add("d-none");
  document.getElementById("new-popup").style.visibility = "invisible";
  document.getElementById("new-popup").style.display = "none";
  document.getElementById("new-popup-form").classList.add("d-none");
}

function cancelEditContact() {
  // console.log("cancelEditContact()");
  document.getElementById("edit-or-new-popup").classList.add("d-none");
  document.getElementById("edit-form").classList.add("d-none");
}

function addNewContact() {
  let firstName = document.getElementById("con-new-name").value.split(" ")[0];
  let lastName = document.getElementById("con-new-name").value.split(" ")[1];
  let phone = document.getElementById("con-new-phone").value;
  let mail = document.getElementById("con-new-mail").value;

  if (!firstName || !lastName || !phone || !mail) {
    alert("PLease fill in all information");
    return;
  }

  let firstCharOfName = firstName.charAt(0);
  // console.log(`firstCharOfName: ${firstCharOfName}`);

  let element = [];
  for (let index = 0; index < contacts.length; index++) {
    element.push(contacts[index]["letter"]);
  }

  let contactListIndex = element.indexOf(firstCharOfName, 0);
  // console.log(`contactListIndex: ${contactListIndex}`);

  document.getElementById("new-popup").style.visibility = "hidden";
  document.getElementById("new-popup").classList.add("d-none");
  document.getElementById("new-popup-form").classList.add("d-none");

  // reset the input fields values
  document.getElementById("con-new-name").value = "";
  document.getElementById("con-new-phone").value = "";
  document.getElementById("con-new-mail").value = "";

  contacts.push({
    contact: `${firstName} ${lastName}`,
    name: `${firstName}`,
    lastName: `${lastName}`,
    phonenumber: `${phone}`,
    mail: `${mail}`,
  });
  // sort contacts after adding new contact
  sortContacts();
  initContacts();
}

function sortContacts() {
  contacts.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  // console.log('After sorting....');
  // console.log(contacts);
}

function contactClicked(given_id) {
  // console.log("contactClicked()");
  // console.log(`last_id: ${last_id}`);
  // console.log(`given_id: ${given_id}`);

  if (given_id != last_id) {
    document.getElementById(given_id).style.backgroundColor = "#2A3647";
    document.getElementById(given_id).style.color = "#FFFFFF";
    if (last_id != "XX") {
      document.getElementById(last_id).style.backgroundColor = "#FFFFFF";
      document.getElementById(last_id).style.color = "#000000";
    }
    last_id = given_id;
    showContactInformation(given_id);
  } else if (given_id == last_id) {
    document.getElementById(given_id).style.backgroundColor = "#FFFFFF";
    document.getElementById(given_id).style.color = "#000000";
    last_id = "XX";
    hideContactDetails();
    document.getElementById("contact-information").classList.add("d-none");

    // trying to fix bug of missing hover effect after contact clicked
    document.getElementById(given_id).style.backgroundColor = "";
  }
}

function showContactInformation(given_id) {
  console.log('given_id: ', given_id);
  // display contact details
  selectedContact = given_id;
  document.getElementById("contacts-details").classList.remove("d-none"); // testing !!!
  document.getElementById("contact-information").style = "display: flex;";
  document.getElementById("contact-information").classList.remove("d-none");

  document.getElementById("label-big-and-name").classList.remove("d-none");
  document.getElementById("edit-container").classList.remove("d-none");
  document.getElementById("mail-and-phone-container").classList.remove("d-none");

  document.getElementById('con-button-container').classList.add('d-none');

  
  let searchLetter = given_id.replace("-", " ");
  console.log('let searchLetter = given_id.replace("-", " ");');

  let element = [];
  for (let index = 0; index < contacts.length; index++) {
    element.push(contacts[index]["contact"]);
  }

  // console.log('element: ', element);

  let clickedIndex = element.indexOf(searchLetter, 0);
  // console.log('clickedIndex: ', clickedIndex);

  let chosenContactsName = contacts[clickedIndex]["name"];
  // console.log('chosenContactsName: ', chosenContactsName);
  let chosenContactsLastName = contacts[clickedIndex]["lastName"];
  let firstLetterFirstName = chosenContactsName.charAt(0);
  let firstLetterLastName = chosenContactsLastName.charAt(0);

  let phoneNumber = contacts[clickedIndex]["phonenumber"];
  let mailAddress = contacts[clickedIndex]["mail"];

  // console.log(`You selected contact ${chosenContactsName} ${chosenContactsLastName}`);

  document.getElementById("label-big-and-name").innerHTML = /*html*/ `
  <span id="big-label" class="con_bigLabel">${firstLetterFirstName}${firstLetterLastName}</span>
  <div id="first-name-last-name" class="con_firstNameLastName">
    <span>${chosenContactsName} ${chosenContactsLastName}</span>
    <div style="display: flex; margin-top: 16px;">
      <img src="./img/plus-8-32.png" style="height: 24px; width: 24px; object-fit: cover;">
      <span class="hoverEffect" style="color: #29ABE2; font-size: 24px">Add Task</span>
    </div>
  </div>`;

  document.getElementById("big-label").style.backgroundColor =
    labelColors[clickedIndex];
  document.getElementById("edit-container").innerHTML = /*html*/ `
  <span class="con_contactInformationSpan">Contact Information</span>
  <div class="hoverEffect" style="display: flex; align-items: center;" onclick="editContact(${clickedIndex})">
    <img src="./img/edit-2-32.png" style="margin-right: 6px;">
    <span>Edit Contact</span>
  </div>
  `;
  document.getElementById("mail-and-phone-container").innerHTML = /*html*/ `
  <h3>Email:</h3>
  <span>${mailAddress}</span>
  <h3>Phone:</h3>
  <span>${phoneNumber}</span>`;

  // render contactInformation container according to width of nav_left and contactListContainer
  let contactInformation = document.getElementById("contact-information");
  contactInformation.style = `width: calc(100vw - ${navigation_left_width}px - ${contactListContainerWidth}px`;
  console.log('End of showContactInformation()');
}

function hideContactDetails() {
  // console.log("hideContactDetails()");
  document.getElementById("label-big-and-name").classList.add("d-none");
  document.getElementById("edit-container").classList.add("d-none");
  document.getElementById("mail-and-phone-container").classList.add("d-none");
}

function editContact(clickedIndex) {
  // console.log(`You want to edit contact ${clickedIndex}`);
  document.getElementById('id-nav-mobile').classList.add('d-none');         // hide navigation mobile bar on bottom
  document.getElementById("edit-or-new-popup").classList.remove("d-none");
  document.getElementById("edit-form").classList.remove("d-none");
  document.getElementById("edit-or-new-popup").style.visibility = "visible";
  document.getElementById("edit-or-new-popup").style.display = "flex";
  let editName = contacts[clickedIndex];
  let f = editName['name'][0];
  let l = editName['lastName'][0];
  let chosenContact = editName['name'] + ' ' + editName['lastName'];
  let chosenPhone = contacts[clickedIndex]['phonenumber'];
  let chosenMail = editName['mail'];
  let editLabel = document.getElementById("edit-label");
  console.log(`f: ${f}    l: ${l}`);
  editLabel.innerHTML = `<span>${f}${l}</span>`;
  editLabel.style.backgroundColor = labelColors[clickedIndex];
  document.getElementById('con-edit-name').value = chosenContact;
  document.getElementById('con-edit-phone').value = chosenPhone;
  document.getElementById('con-edit-mail').value = chosenMail;

  contactToEdit = clickedIndex;
}

function submitEdit(contactToEdit) {
  console.log('begin of function submitEdit()');
  document.getElementById("edit-or-new-popup").classList.add("d-none");
  document.getElementById("edit-form").classList.add("d-none");
  let firstNameNew = document.getElementById("con-edit-name").value;
  let lastNameNew = document.getElementById("con-edit-name").value;
  firstNameNew = firstNameNew.split(" ")[0];
  lastNameNew = lastNameNew.split(" ")[1];
  let phoneNew = document.getElementById("con-edit-phone").value;
  let mailNew = document.getElementById("con-edit-mail").value;

  let editedContact = firstNameNew + '-' + lastNameNew;
  // console.log(`New contact details of contact: \nFirst name:${firstNameNew}\n
  // Last name:${lastNameNew}\nPhone number:${phoneNew}\nE-Mail:${mailNew}\n`);
  changeContact(contactToEdit, firstNameNew, lastNameNew, phoneNew, mailNew);

  // sort contacts after editing contact
  sortContacts();
  initContacts();
  showContactInformation(editedContact);  
}

function changeContact(contactToEdit, firstNameNew, lastNameNew, phoneNew, mailNew) {
  const oldContact = contacts[contactToEdit]["contact"];
  const oldName = oldContact.split(" ")[0];
  const oldLastName = oldContact.split(" ")[1];
  const element = firstNameNew;
  const element2 = lastNameNew;
  const element3 = mailNew;
  const fName = firstNameNew.charAt(0);
  const lName = lastNameNew.charAt(0);
  let editID = `label-${oldName}-${oldLastName}`;
  let bgColorLabel = document.getElementById(editID).style.backgroundColor;

  document.getElementById(`${editID}`).innerHTML = /*html*/ `
  <span id="label-${element}-${element2}" class="con_contactListElementLabel">${fName}${lName}</span>  
      <div>
        <span>${element} ${element2}</span>
        <span class="con_contactListElementEmail">${element3}</span>
      </div>
  `;
  document.getElementById(editID).style.backgroundColor = bgColorLabel;
  document.getElementById("edit-or-new-popup").style.visibility = "hidden";
  document.getElementById("edit-or-new-popup").classList.add("d-none");
  // document.getElementById("con-edit-name").classList.add("d-none");

  // reset input fields
  document.getElementById("con-edit-name").value = "";
  document.getElementById("con-edit-phone").value = "";
  document.getElementById("con-edit-mail").value = "";

  // push new contact information to JSON
  contacts[contactToEdit]["contact"] = `${firstNameNew} ${lastNameNew}`;
  contacts[contactToEdit]["name"] = firstNameNew;
  contacts[contactToEdit]["lastName"] = lastNameNew;
  contacts[contactToEdit]["mail"] = mailNew;
  contacts[contactToEdit]["phonenumber"] = phoneNew;
  // console.log(contacts);

  // re-initialize contacts after editing
  initContacts();

  let newGivenID = contacts[contactToEdit]["contact"].replace(" ", "-");
  showContactInformation(newGivenID);
  // var myJsonString = JSON.stringify(contacts);
  // console.log(myJsonString);
  // var fs = require('fs');
  // fs.writeFile('./../backend/database.json', myJsonString, function(err) {
  //   if (err) {
  //       console.log(err);
  //   }
  // });
  // console.log('OK, saved locally ne JSON file :)');
}

function closeContactInformationContainer() {
  // console.log(`You decided to close contact details of ${selectedContact}`);
  document.getElementById('con-button-container').classList.remove('d-none');
  document.getElementById("contact-information").classList.add("d-none");
  document.getElementById("contact-information").style =
    "display: none important;";

  if (selectedContact != last_id) {
    document.getElementById(selectedContact).style.backgroundColor = "#2A3647";
    document.getElementById(selectedContact).style.color = "#FFFFFF";
    if (last_id != "XX") {
      document.getElementById(last_id).style.backgroundColor = "#FFFFFF";
      document.getElementById(last_id).style.color = "#000000";
    }
    last_id = selectedContact;
    showContactInformation(selectedContact);
  } else if (selectedContact == last_id) {
    document.getElementById(selectedContact).style.backgroundColor = "#FFFFFF";
    document.getElementById(selectedContact).style.color = "#000000";
    last_id = "XX";
  }

  // document.getElementById(selectedContact).style.backgroundColor = "#FFFFFF";
  // document.getElementById(selectedContact).style.color = "#000000";
  // trying to fix bug of missing hover effect after contact clicked
  document.getElementById(selectedContact).style.backgroundColor = "";
}
