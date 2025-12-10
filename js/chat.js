// js/chat.js

let activeChatId = null;

// Fetch chats
async function loadChats() {
  const res = await fetch(`${CONFIG.API_BASE_URL}/chats`);
  const chats = await res.json();

  const chatList = document.getElementById("chatList");
  chatList.innerHTML = "";

  chats.forEach(chat => {
    const div = document.createElement("div");
    div.textContent = chat.name;
    div.onclick = () => openChat(chat.id);
    chatList.appendChild(div);
  });
}

// Open chat
async function openChat(chatId) {
  activeChatId = chatId;

  const res = await fetch(`${CONFIG.API_BASE_URL}/chats/${chatId}/messages`);
  const messages = await res.json();

  document.getElementById("messages").innerHTML = "";
  document.getElementById("chatHeader").textContent = "Chat #" + chatId;

  messages.forEach(msg => addMessage(msg.text, msg.sender === "me"));
}

// Append message
function addMessage(text, isYou) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${isYou ? "you" : "other"}`;
  msgDiv.textContent = text;
  document.getElementById("messages").appendChild(msgDiv);
}

// Send message
async function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value;
  if (!text) return;

  addMessage(text, true);

  await fetch(`${CONFIG.API_BASE_URL}/chats/${activeChatId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  input.value = "";
}

loadChats();
