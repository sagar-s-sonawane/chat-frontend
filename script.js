const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msgInput");
const chatForm = document.getElementById("chatForm");
const emojiBtn = document.querySelector(".emoji-btn");
const emojiPicker = document.getElementById("emojiPicker");

// Prompt for username
let username = "";
while (!username) {
  username = prompt("Enter your username:");
}

// Add message to chat box
function addMessage(text, type = "sent") {
  if (!text.trim()) return;

  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", type);
  msgDiv.innerHTML = `<span>${text}</span>`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Fetch messages from backend
async function fetchMessages() {
  try {
    const res = await fetch("http://localhost:8080/api/chat/messages");
    const messages = await res.json();

    chatBox.innerHTML = ""; // Clear chat box
    messages.forEach(msg => addMessage(`${msg.username}: ${msg.message}`, "received"));
  } catch (err) {
    console.error("Error fetching messages:", err);
  }
}

// Send message to backend
async function sendMessage() {
  const message = msgInput.value.trim();
  if (!message) return;

  try {
    await fetch("http://localhost:8080/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, message })
    });
    msgInput.value = "";
    fetchMessages();
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

// Handle form submit (works on mobile and desktop)
chatForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent page reloads
  sendMessage();
});

// Toggle emoji picker
emojiBtn.addEventListener("click", () => {
  emojiPicker.style.display = emojiPicker.style.display === "none" ? "block" : "none";
});

// Hide emoji picker when clicking outside
document.addEventListener("click", (e) => {
  if (!emojiPicker.contains(e.target) && !emojiBtn.contains(e.target)) {
    emojiPicker.style.display = "none";
  }
});

// Insert emoji into input and hide picker
emojiPicker.addEventListener("emoji-click", (event) => {
  msgInput.value += event.detail.unicode;
  emojiPicker.style.display = "none";
});

// Auto-refresh messages every 2 seconds
setInterval(fetchMessages, 2000);
fetchMessages(); // initial load
