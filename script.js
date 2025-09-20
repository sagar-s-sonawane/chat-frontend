const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const emojiBtn = document.querySelector(".emoji-btn");
const emojiPicker = document.getElementById("emojiPicker");

// Function to add a message
function addMessage(text, type = "sent") {
  if (!text.trim()) return;

  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", type);

  msgDiv.innerHTML = `
    <span>${text}</span>
    <div class="options">
      <span onclick="deleteMessage(this)">Delete</span> | 
      <span onclick="hideMessage(this)">Hide</span>
    </div>
  `;

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message on button click
sendBtn.addEventListener("click", () => {
  addMessage(msgInput.value, "sent");
  msgInput.value = "";
});

// Send message on Enter key
msgInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addMessage(msgInput.value, "sent");
    msgInput.value = "";
  }
});

// Delete message completely
function deleteMessage(el) {
  el.closest(".message").remove();
}

// Hide message (replace with "Message hidden")
function hideMessage(el) {
  const msg = el.closest(".message").querySelector("span");
  msg.textContent = "Message hidden";
}

// Toggle emoji picker
emojiBtn.addEventListener("click", () => {
  emojiPicker.style.display = emojiPicker.style.display === "none" ? "block" : "none";
});

// When emoji clicked, insert into input
emojiPicker.addEventListener("emoji-click", (event) => {
  msgInput.value += event.detail.unicode;
});
