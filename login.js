const emailCorreto = "gomesdasilvajoaogabrieljg@gmail.com";
const senhaCorreta = "briel17jg";

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const erro = document.getElementById("erro");

    if (email === emailCorreto && senha === senhaCorreta) {

        sessionStorage.setItem("evoluaAdmin", "true");

        // Vai para o painel ADM
        window.location.href = "painel.html";

    } else {

        erro.textContent = "Gmail ou senha incorretos.";

    }
});