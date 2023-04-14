axios.defaults.headers.common["Authorization"] = "6SlanhOQ22CQz43wqstq4NsK";
const chat = document.querySelector(".chat");
const txt = document.querySelector("textarea");
var user = {
  name: "",
};
var first = true;

txt.addEventListener("keydown", function (pressed) {
  if (pressed.key == "Enter" && !pressed.ctrlKey) {
    if (!pressed.repeat) {
      sendMessage();
    }

    pressed.preventDefault(); // Prevents the addition of a new line in the text field
  }
  if (pressed.key == "Enter" && pressed.ctrlKey) {
    if (!pressed.repeat) {
      txt.value += "\n";
    }
  }
});

login();

function login() {
  user.name = prompt("Qual o seu nome?");
  let promLogin = axios.post(
    "https://mock-api.driven.com.br/api/vm/uol/participants",
    user
  );

  promLogin.then(online);
  promLogin.catch(login);
}

function online(ans) {
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
}

function render(chatContent) {
  chat.innerHTML = "";
  chatContent.data.forEach(applyToChat);
  if (first) {
    chat.scrollTop = chat.scrollHeight;
    first = false;
  } else if (chat.scrollTop > 7200) chat.scrollTop = chat.scrollHeight;
}

function applyToChat(info) {
  let bp = "";

  if (info.type == "status") {
    bp = `<div class="notification message" data-test="message">
            <ul><li>
              <m-time>(${info.time})</m-time> 
              <m-bold>${info.from} </m-bold>`;
  } else if (info.type == "private_message") {
    bp = `<div class="private message" data-test="message">
    <ul><li>
              <m-time>(${info.time})</m-time>
              <m-bold>${info.from}</m-bold>reservadamente para<m-bold>${info.to}: </m-bold>`;
  } else {
    bp = `<div class="message" data-test="message">
            <ul><li>
              <m-time>(${info.time})</m-time> <m-bold>${info.from}</m-bold> para
              <m-bold>Todos: </m-bold>`;
  }
  bp += info.text.replaceAll("\n", "<br>") + "</ul></div>";
  chat.innerHTML += bp;
}

function sendMessage() {
  if (!validMessage()) {
    txt.value = "";
    return;
  }
  let msg = {
    from: user.name,
    to: "Todos",
    text: txt.value,
    type: "message",
  };
  txt.value = "";

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
