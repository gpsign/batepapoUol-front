axios.defaults.headers.common["Authorization"] = "6SlanhOQ22CQz43wqstq4NsK";
const chat = document.querySelector(".chat");
var user = {
  name: "",
};

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
  for (let i = 0; i < chatContent.data.length; i++) {
    sendChat(chatContent.data[i]);
  }
  if (chat.scrollTop > 7200) chat.scrollTop = chat.scrollHeight;
}

function sendChat(info) {
  let skel = "";

  if (info.type == "status") {
    skel = `<div class="message notification">
    <p>
        <m-time>(${info.time})</m-time> <m-bold>${info.from} </m-bold>`;
  } else if (info.to !== "Todos") {
    skel = `<div class="message private">
    <p>
    <m-time>(${info.time})</m-time>
    <m-bold>${info.from}</m-bold>reservadamente para<m-bold>${info.to}: </m-bold>`;
  } else {
    skel = `<div class="message">
              <p>
                  <m-time>(${info.time})</m-time> <m-bold>${info.from}</m-bold> para
                  <m-bold>Todos: </m-bold>`;
  }
  skel += info.text + "</p></div>";
  chat.innerHTML += skel;
}