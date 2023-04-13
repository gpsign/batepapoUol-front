const chat = document.querySelector(".chat");

function notification(user, login) {
  let inf = "";
  if (login) inf = "entra na";
  else inf = "sai da";
  return `<div class="message notification">
            <p>
                <m-time>(10:52:52)</m-time> <m-bold>${user} </m-bold> ${inf} sala...
            </p>
          </div>`;
}

function message(user, priv, message) {
  let text = "";
  if (priv !== "Todos") {
    text = `<div class="message private">
    <p>
    <m-time>(09:22:48)</m-time>
    <m-bold>${user}</m-bold>reservadamente para<m-bold>${priv}: </m-bold>`;
  } else
    text = `<div class="message">
                <p>
                    <m-time>(10:52:52)</m-time> <m-bold>${user}</m-bold> para
                    <m-bold>Todos: </m-bold>`;
  text += message + "</p></div>";
  console.log(text);
  return text;
}

function sendChat(content) {
  chat.innerHTML += content;
}