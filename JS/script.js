axios.defaults.headers.common["Authorization"] = "6SlanhOQ22CQz43wqstq4NsK";

const header = document.querySelector(".header");
const footer = document.querySelector(".footer");
const chat = document.querySelector(".chat");
const txt = document.querySelector("textarea");
const chatUl = document.querySelector(".chat ul");
const loginWindow = document.querySelector(".loginWindow");
const userNameInput = document.querySelector(".inputArea input");
const userNameButton = document.querySelector(".inputArea button");
const sidebar = document.querySelector(".sidebar");
const usersList = document.querySelector(".usersList");

var user = {
  name: "",
};
var selectedUser = {
  name: "",
};
var msg = {
  from: "",
  to: "Todos",
  text: "",
  type: "message",
};

txt.addEventListener("keydown", function (pressed) {
  if (pressed.key == "Enter" && !pressed.ctrlKey) {
    if (!pressed.repeat) {
      sendMessage();
    }

    pressed.preventDefault();
  }
  if (pressed.key == "Enter" && pressed.ctrlKey) {
    if (!pressed.repeat) {
      txt.value += "\n";
    }
  }
});

function showSidebar() {
  sidebar.classList.add("active");
  header.classList.add("dark");
  footer.classList.add("dark");
  chat.classList.add("dark");
}

function hideSidebar() {
  sidebar.classList.remove("active");
  header.classList.remove("dark");
  footer.classList.remove("dark");
  chat.classList.remove("dark");
}

function login() {
  if (userNameInput.value === "") return;
  userNameButton.disabled = true;
  userNameButton.innerHTML = "Logando...";
  user.name = userNameInput.value;
  let promLogin = axios.post(
    "https://mock-api.driven.com.br/api/vm/uol/participants",
    user
  );

  promLogin.then(online);
  promLogin.catch(() => {
    alert("Usuario ja esta sendo usado");
    userNameButton.disabled = false;
    userNameButton.innerHTML = "Entrar";
  });
}

function online(ans) {
  msg.from = user.name;
  userNameInput.value = "";
  loginWindow.style.display = "none";
  setInterval(
    () => axios.post("https://mock-api.driven.com.br/api/vm/uol/status", user),
    5000
  );
  getData();
  setInterval(getData, 3000);
}

function getData() {
  let promData = axios.get(
    "https://mock-api.driven.com.br/api/vm/uol/messages"
  );
  promData.then(render);
  promData.catch(() => alert("Erro"));

  let promOnline = axios.get(
    "https://mock-api.driven.com.br/api/vm/uol/participants"
  );
  promOnline.then(updateSidebar);
  promOnline.catch(() => alert("Erro"));
}

function render(chatContent) {
  chatUl.innerHTML = "";
  chatContent.data.forEach(applyToChat);
  chatUl.lastChild.scrollIntoView();
}

function updateSidebar(onlineList) {
  let validUser = false;
  usersList.innerHTML = `<div class="Todos onlineUser" onclick="select(this)">
    <ion-icon name="people"></ion-icon>
    Todos
    <ion-icon name="checkmark" class="check"></ion-icon>
  </div>`;
  onlineList.data.forEach((usr) => {
    usersList.innerHTML += ` <div class="${usr.name} onlineUser" onclick="select(this)">
        <ion-icon name="person-circle"></ion-icon>
         ${usr.name}
         <ion-icon name="checkmark" class="check"></ion-icon>
      </div>`;
  });
  document.querySelectorAll(".onlineUser").forEach((usr) => {
    if (usr.classList[0] === msg.to) {
      usr.classList.add("selected");
      validUser = true;
    }
  });
  if (!validUser) msg.to = "Todos";
}

function select(clicked) {
  let list = clicked.parentElement.classList[0];
  let bfr = document.querySelector(`.${list} .selected`);

  if (bfr !== null) bfr.classList.remove("selected");
  clicked.classList.add("selected");

  if (list === "usersList") {
    selectedUser.name = clicked.classList[0];
    msg.to = clicked.classList[0];
  } else if (list === "privacy") {
    if (clicked.classList[0] === "selectPublic") msg.type = "message";
    else msg.type = "private_message";
  }
  console.log(msg);
}

function getMessageFromType(msgRaw) {
  if (msgRaw.type == "status") {
    return `<li class="notification message" data-test="message">
              <p>
                <span class="time">(${msgRaw.time})</span> 
                <span class="bold">${msgRaw.from} </span>`;
  } else if (msgRaw.type == "private_message") {
    return `<li class="private message" data-test="message">
              <p>
              <span class="time">(${msgRaw.time})</span> 
              <span class="bold">${msgRaw.from}</span> reservadamente para<span class="bold">${msgRaw.to}: </span> `;
  } else {
    return `<li class="message" data-test="message">
              <p>
              <span class="time">(${msgRaw.time})</span> <span class="bold">${msgRaw.from}</span>
                para
                <span class="bold">${msg.to}: </span>`;
  }
}

function applyToChat(info) {
  let bp = getMessageFromType(info);
  if (info.type === "private_message") {
    if (info.to === user.name || info.from === user.name) {
      bp += info.text.replaceAll("\n", "<br>") + "</p>";
      chatUl.innerHTML += bp;
    }
  } else {
    bp += info.text.replaceAll("\n", "<br>") + "</p>";
    chatUl.innerHTML += bp;
  }
}

function sendMessage() {
  if (!validMessage()) {
    txt.value = "";
    return;
  }

  msg.text = txt.value;

  txt.value = "";

  console.log(msg);

  let promSend = axios.post(
    "https://mock-api.driven.com.br/api/vm/uol/messages",
    msg
  );
  promSend.then(getData);
  promSend.catch(() => window.location.reload(true));
}

function validMessage() {
  for (let i = 0; i < txt.value.length; i++)
    if (txt.value[i] !== "\n" && txt.value[i] !== "") return true;

  return false;
}
