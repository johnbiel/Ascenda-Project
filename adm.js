
const carregando = document.getElementById("carregando");
const painel = document.getElementById("painel");
const adminEmail = document.getElementById("adminEmail");
const sairButton = document.getElementById("sairButton");

let verificacaoEmAndamento = false;

auth.onAuthStateChanged(async (user) => {
  if (verificacaoEmAndamento) return;

  verificacaoEmAndamento = true;
  painel.hidden = true;
  carregando.hidden = false;

  if (!user) {
    window.location.replace("login.html");
    return;
  }

  try {
    const doc = await db.collection("usuarios").doc(user.uid).get();

    if (!doc.exists || doc.data().perfil !== "admin") {
      await auth.signOut();
      window.location.replace("login.html");
      return;
    }

    adminEmail.textContent = user.email || "Administrador";
    painel.hidden = false;
    carregando.hidden = true;
  } catch (error) {
    console.error("Erro ao verificar administrador:", error);
    carregando.textContent =
      "Não foi possível verificar o acesso. Atualize a página.";
  } finally {
    verificacaoEmAndamento = false;
  }
});

sairButton.addEventListener("click", async () => {
  sairButton.disabled = true;

  try {
    await auth.signOut();
    window.location.replace("login.html");
  } catch (error) {
    console.error("Erro ao sair:", error);
    sairButton.disabled = false;
    alert("Não foi possível encerrar a sessão. Tente novamente.");
  }
});
