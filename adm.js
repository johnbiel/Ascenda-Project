const auth = firebase.auth();

const loginArea = document.getElementById("loginArea");
const painelArea = document.getElementById("painelArea");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const mensagem = document.getElementById("mensagem");
const logoutBtn = document.getElementById("logoutBtn");

auth.onAuthStateChanged((user) => {
    if (user) {
        loginArea.classList.add("hidden");
        painelArea.classList.remove("hidden");
    } else {
        loginArea.classList.remove("hidden");
        painelArea.classList.add("hidden");
    }
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    mensagem.textContent = "Entrando...";

    auth.signInWithEmailAndPassword(email, senha)
        .then(() => {
            mensagem.textContent = "";
        })
        .catch((error) => {
            console.error(error);

            if (error.code === "auth/invalid-credential") {
                mensagem.textContent = "E-mail ou senha incorretos.";
            } else if (error.code === "auth/invalid-email") {
                mensagem.textContent = "E-mail inválido.";
            } else {
                mensagem.textContent = "Erro: " + error.code;
            }
        });
});

logoutBtn.addEventListener("click", () => {
    auth.signOut();
});