const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");

let username = localStorage.getItem("chatUsername") || "";

// Prompt username only once
if (!username) {
  username = prompt("Enter your username:") || "Anonymous";
  localStorage.setItem("chatUsername", username);
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

    chatBox.innerHTML = "";
    messages.forEach(msg => addMessage(`${msg.username}: ${msg.message}`, "received"));
  } catch (err) {
    console.error(err);
  }
}

// Send message
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
    console.error(err);
  }
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

emojiBtn.addEventListener("click", () => {
  emojiPicker.style.display = emojiPicker.style.display === "none" ? "block" : "none";
});

document.addEventListener("click", (e) => {
  if (!emojiPicker.contains(e.target) && !emojiBtn.contains(e.target)) {
    emojiPicker.style.display = "none";
  }
});

emojiPicker.addEventListener("emoji-click", (event) => {
  msgInput.value += event.detail.unicode;
  emojiPicker.style.display = "none";
});

// Auto-refresh messages
setInterval(fetchMessages, 2000);
fetchMessages();
