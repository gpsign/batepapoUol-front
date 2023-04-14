axios.defaults.headers.common["Authorization"] = "6SlanhOQ22CQz43wqstq4NsK";
const chat = document.querySelector(".chat");
const txt = document.querySelector("textarea");
var holdingCtrl = false;
var user = {
  name: "",
};
var first = true;

txt.addEventListener('keydown', function(pressed){
  if(pressed.key === 'Control')holdingCtrl = true;
  else if(pressed.key === 'Enter' && !holdingCtrl)sendMessage();
  else if(pressed.key === 'Enter' && holdingCtrl)txt.value += '\n';
});

txt.addEventListener('keyup', function(released){
  if(released.key == 'Control')holdingCtrl = false;
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
  if(first){
    chat.scrollTop = chat.scrollHeight;
    first = false;
  }
  else if (chat.scrollTop > 7200) chat.scrollTop = chat.scrollHeight;
}

function applyToChat(info) {
  let bp = "";

  if (info.type == "status") {

    bp = `<div class="message notification" data-test="message">
        <m-time>(${info.time})</m-time> <m-bold>${info.from} </m-bold>`;
  } else if (info.type == "private_message") {
    bp = `<div class="message private" data-test="message">
    <m-time>(${info.time})</m-time>
    <m-bold>${info.from}</m-bold>reservadamente para<m-bold>${info.to}: </m-bold>`;
  } else{
    bp = `<div class="message" data-test="message">
                  <m-time>(${info.time})</m-time> <m-bold>${info.from}</m-bold> para
                  <m-bold>Todos: </m-bold>`;
  }
  bp += info.text + "</div>";
  chat.innerHTML += bp;
}

function sendMessage(){
    let msg = {
        from: user.name,
        to: "Todos",
        text: txt.value,
        type: "message"
    }
    txt.value = '';

    let promSend = axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", msg);
    promSend.then(getData);
    promSend.catch(() => window.location.reload(true));
}