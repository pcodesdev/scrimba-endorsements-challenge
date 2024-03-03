const messageEl = document.getElementById("input-message")
const inputFromEl = document.getElementById("input-from")
const inputToEl = document.getElementById("input-to")
const publishEl = document.getElementById("publish-btn")
const endorsementEl = document.getElementById("endorsement")

// DB connection
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://endorsements-b3f87-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsements");

publishEl.addEventListener("click", () => {
    let messageValue = messageEl.value.trim()
    let sender = inputFromEl.value.trim()
    let reciever = inputToEl.value.trim()

    if (messageValue && sender && reciever) {
        let items = [messageValue, sender, reciever]
        
        push(endorsementsInDB, items).then(() => {
        clearInputFieldsEls();
      })
      .catch((error) => {
        console.error("Error adding item to endorsement list:", error);
      });
  } else {
    alert("Please enter all the endorsement item details: message, from and to!"); // Prompt user if empty
  }
    }
    // console.log(messageValue)
    // for (let i = 0; i < messageValue.length; i++) {
    //     appendEndorsement(messageValue[i])
    
)

onValue(endorsementsInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        // Reverse the order of items in the array from the last to the last in order of inputs
        itemsArray.reverse()
        // Clear the list before putting in anything
        clearEndorsementList()

        for (let i = 0; i < itemsArray.length; i++) { 
            let currentItem = itemsArray[i]
            // let currentItemID = currentItem[0];
            let currentItemmessage = currentItem[1][0];
            let currentItemFrom = currentItem[1][1];
            let currentItemTo = currentItem[1][2]
            // // console.log(currentItemID)
            //  console.log(currentItemFrom);
            // console.log(currentItemmessage)
           
            // console.log(currentItemTo)

            appendEndorsement(currentItemmessage, currentItemFrom, currentItemTo)


        }
    } else {
        endorsementEl.innerHTML = "There are no endorsements at this moment!"
    }
})

function clearEndorsementList() {
    endorsementEl.innerHTML = ""
}


function appendEndorsement(message, messageFrom, messageTo) {
  // Create a new div element
  let newDiv = document.createElement("div");

  // Add the endorsement class to the new div
  newDiv.classList.add("endorsement");

  // Set the HTML content of the new div
  newDiv.innerHTML = `
        <h4><span class="from">From ${messageFrom}</span></h4>
        <p>${message}</p>
        <h4><span class="to">To ${messageTo}</span></h4>
        <div class="like-buttons">
            <button class="like-btn">❤️</button>
            <button class="unlike-btn">🤍</button>
        </div>
    `;

  // Append the new div to the endorsementEl
  endorsementEl.appendChild(newDiv);

  // Add event listeners to like and unlike buttons
  const likeBtn = newDiv.querySelector(".like-btn");
  const unlikeBtn = newDiv.querySelector(".unlike-btn");

  likeBtn.addEventListener("click", () => {
    // Check if endorsement is not already liked
    if (!newDiv.classList.contains("liked")) {
      // Perform like action
      newDiv.classList.add("liked");
      likeBtn.disabled = true; // Disable like button
      unlikeBtn.disabled = false; // Enable unlike button
    }
  });

  unlikeBtn.addEventListener("click", () => {
    // Check if endorsement is already liked
    if (newDiv.classList.contains("liked")) {
      // Perform unlike action
      newDiv.classList.remove("liked");
      unlikeBtn.disabled = true; // Disable unlike button
      likeBtn.disabled = false; // Enable like button
    }
  });
}








// clear all the input fields
function clearInputFieldsEls() {
    messageEl.value = ""
    inputFromEl.value = ""
    inputToEl.value = ""
}


