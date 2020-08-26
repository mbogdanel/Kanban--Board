

const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}


// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// Filter Arrays to remove empty items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl);


}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {

  // Check localStorage once
  if (!updatedOnLoad){
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if necessary, or Update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

// Add to Column List, Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';

}

// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allow arrays to reflect Drag and Drop items
function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  completeListArray = Array.from(completeList.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);
  // backlogListArray = [];
  // for (let i = 0; i < backlogList.children.length; i++) {
  //   backlogListArray.push(backlogList.children[i].textContent);
  // }
  // progressListArray = [];
  // for (let i = 0; i < progressList.children.length; i++) {
  //   progressListArray.push(progressList.children[i].textContent);
  // }
  // completeListArray = [];
  // for (let i = 0; i < completeList.children.length; i++) {
  //   completeListArray.push(completeList.children[i].textContent);
  // }
  // onHoldListArray = [];
  // for (let i = 0; i < onHoldList.children.length; i++) {
  //   onHoldListArray.push(backlogList.children[i].textContent);
  // }
  updateDOM();
}

// When Item  Starts Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// Column allows for item to drop
function allowDrop(e) {
  e.preventDefault();
}

// When Item Enters Column Area
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// Dropping Item In Column
function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];
  // Remove Background Color Padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  // Add Item To Column
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  rebuildArrays();
}

// On Load
updateDOM();



// Get the modal for ///////////////////////////////////////////////////////////////
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var motivation = document.getElementById("motivation");
var reward = document.getElementById("reward");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var text = document.getElementById("text");
// Random number function
function getRandomNumber(min, max) {
  random = Math.floor(Math.random() * (max - min)) + min;
};

quotesArray = ["Love For All, Hatred For None. – Khalifatul Masih III", "Change the world by being yourself. – Amy Poehler", "Every moment is a fresh beginning. – T.S Eliot", "Never regret anything that made you smile. – Mark Twain", "Everything you can imagine is real. – Pablo Picasso", "Simplicity is the ultimate sophistication. – Leonardo da Vinci", "Whatever you do, do it well. – Walt Disney", "What we think, we become. – Buddha", "All limitations are self-imposed. – Oliver Wendell Holmes", "Tough times never last but tough people do. – Robert H. Schiuller", "Problems are not stop signs, they are guidelines. – Robert H. Schiuller", "One day the people that don’t even believe in you will tell everyone how they met you. – Johnny Depp", "If you tell the truth you don’t have to remember anything. – Mark Twain", "Have enough courage to start and enough heart to finish. – Jessica N. S. Yourko", "I could agree with you but then we’d both be wrong. – Harvey Specter", "Oh, the things you can find, if you don’t stay behind. – Dr. Seuss", "Determine your priorities and focus on them. – Eileen McDargh", "Be so good they can’t ignore you. – Steve Martin", "Dream as if you’ll live forever, live as if you’ll die today. – James Dean", "I don’t need it to be easy, I need it to be worth it. – Lil Wayne", "What consumes your mind controls your life- Unknown", "Wanting to be someone else is a waste of who you are. – Kurt Cobain", "May your choices reflect your hopes, not your fears. – Nelson Mandela", "White is not always light and black is not always dark. – Habeeb Akande", "Life becomes easier when you learn to accept the apology you never got. – R. Brault", "Happiness depends upon ourselves. – Aristotle", "It hurt because it mattered. – John Green", "The true meaning of life is to plant trees, under whose shade you do not expect to sit. – Nelson Henderson",];

rewardArray = ["I used to think I was indecisive. But now I’m not so sure", "I went to buy some camo pants but couldn’t find any", "I failed math so many times at school, I can’t even count", "I was wondering why the frisbee kept getting bigger and bigger, but then it hit me", "I want to die peacefully in my sleep, like my grandfather… Not screaming and yelling like the passengers in his car", "Don’t you hate it when someone answers their own questions? I do", "I know they say that money talks, but all mine says is ‘Goodbye.’", "The problem with kleptomaniacs is that they always take things literally", "Most people are shocked when they find out how bad I am as an electrician", "Russian dolls are so full of themselves", "My therapist says I have a preoccupation for revenge. We’ll see about that.", "A termite walks into the bar and asks, ‘Is the bar tender here?’", "A told my girlfriend she drew her eyebrows too high. She seemed surprised", "People who use selfie sticks really need to have a good, long look at themselves. ", "Two fish are in a tank. One says, ‘How do you drive this thing?’", "I always take life with a grain of salt. And a slice of lemon. And a shot of tequila.", "Just burned 2,000 calories. That’s the last time I leave brownies in the oven while I nap.", "Always borrow money from a pessimist. They’ll never expect it back.", "Build a man a fire and he’ll be warm for a day. Set a man on fire and he’ll be warm for the rest of his life", "Today a man knocked on my door and asked for a small donation toward the local swimming pool. I gave him a glass of water.", "The future, the present, and the past walk into a bar. Things got a little tense.", "Last night my girlfriend was complaining that I never listen to her… or something like that.", "I got a new pair of gloves today, but they’re both ‘lefts,’ which on the one hand is great, but on the other, it’s just not right.", "Blunt pencils are really pointless.", "Two wifi engineers got married. The reception was fantastic.", "The rotation of Earth really makes my day.", "Well, to be Frank with you, I’d have to change my name.", "Four fonts walk into a bar. The bartender says, ‘Hey! We don’t want your type in here!’"];

// When the user clicks on the button, open the modal and display random quote
motivation.onclick = function() {
  getRandomNumber(0, quotesArray.length);
  text.innerHTML = quotesArray[random];
  modal.style.display = "block";
}
// When the user clicks on the button, open the modal and display random joke
reward.onclick = function() {
  getRandomNumber(0, rewardArray.length);
  text.innerHTML = rewardArray[random];
  modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Style button-------------------------------------------------

const styleButton = document.getElementById("style");
var contor = 0;
topButtonsList = document.getElementsByClassName('topBtn');


function switchToGrey(){
  document.body.style.backgroundImage = 'url(Background-Image3.JPG)';
  document.body.style.backgroundSize = "cover";
  for (var j = 0; j < topButtonsList.length; j++) {
    topButtonsList[j].style.backgroundColor = "#363535";
  }
};

function SwitchToColor() {
  document.body.style.backgroundImage = 'url(Background-Image2.JPG)';
  document.body.style.backgroundSize = "cover";
  for (var j = 0; j < topButtonsList.length; j++) {
    topButtonsList[j].style.backgroundColor = "#731B07";
  }
};

function changeStyle(event) {
  contor += 1;
  if (contor % 2 == 0){
    console.log(contor);
    document.documentElement.setAttribute('data-theme', 'color');
    SwitchToColor(); 
  } else {
    console.log(contor);
    document.documentElement.setAttribute('data-theme', 'grey');
    switchToGrey();
    };
  
}

styleButton.addEventListener("click", changeStyle);