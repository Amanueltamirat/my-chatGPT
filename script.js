const API_KEY = "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";
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("sent-btn");
const themeBtn = document.getElementById("theme-btn");
const deleteBtn = document.getElementById("delete-btn");
const chatContainer = document.querySelector(".chat-container");
let userText = null;
const initialHeight = chatInput.scrollHeight;
const loadDataFromLocalStorage = () => {
  const themeColor = localStorage.getItem("theme-color");
  document.body.classList.toggle("light-mode", themeColor === "light_mode");
  themeBtn.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";

  const defaultText = `<div class='default-text'>
<h1>ChatGPT Clone</h1>
<p>What you want to ask chatGPT?</p>
</div>`;

  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};
loadDataFromLocalStorage();
const getChatResponse = async (incomingChatDiv) => {
  const API_URL = "https://api.openai.com/v1/completions";
  const pElement = document.createElement("p");
  const rewuestResponse = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-instruct",
      prompt: userText,
      max_tokens: 2048,
      temperature: 0.2,
      n: 1,
      stop: null,
    }),
  };
  try {
    const response = await (await fetch(API_URL, rewuestResponse)).json();
    pElement.textContent = response.choices[0].text.trim();
  } catch (error) {
    pElement.classList.add("error");
    pElement.textContent = "Oops Something went wrong, Please try again";
  }
  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  localStorage.setItem("all-chats", chatContainer.innerHTML);
};

const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};
const copyResponse = (copyBtn) => {
  const responseTextElement = copyBtn.parentElement.querySelector("p");
  navigator.clipboard.writeText(responseTextElement.textContent);
  copyBtn.textContent = "done";
  setTimeout(() => (copyBtn.textContent = "Content_Copy"), 1000);
};

const showTypingAnimation = () => {
  const html = `
  <div class="chat-content">
  <div class="chat-details">
    <img src="images/am.jpg" alt="user-img" />
    <div class="typing-animation">
      <div class="typing-dot" style="--delay: 0.2s"></div>
      <div class="typing-dot" style="--delay: 0.3s"></div>
      <div class="typing-dot" style="--delay: 0.4s"></div>
    </div>
  </div>
  <span onClick="copyResponse(this)" class="material-symbols-outlined">Content_Copy</span>
</div>
  `;
  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  getChatResponse(incomingChatDiv);
};

const handleOutgoingChat = () => {
  userText = chatInput.value.trim();
  chatInput.value = "";

  chatInput.style.height = `${initialHeight}px`;
  if (!userText) return;
  const html = `
  
  <div class="chat-content">
  <div class="chat-details">
    <img src="images/am.jpg" alt="user-img" />
    <p>
    </p>
  </div>
</div>
  `;

  const outgoingChatDiv = createElement(html, "outgoing");
  outgoingChatDiv.querySelector("p").textContent = userText;
  document.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);

  setTimeout(showTypingAnimation, 500);
};

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme-color", themeBtn.innerText);
  themeBtn.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});

deleteBtn.addEventListener("click", () => {
  if (confirm("Are you sure, you want to delete all chats?")) {
    localStorage.removeItem("all-chats");
    loadDataFromLocalStorage();
  }
});

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${initialHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleOutgoingChat();
  }
});
sendBtn.addEventListener("click", handleOutgoingChat);
