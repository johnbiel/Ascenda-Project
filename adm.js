document.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // E-MAIL AUTORIZADO
  // ============================================
  const ADMIN_EMAILS = [
    "gomesdasilvajoaogabrieljg@gmail.com"
  ];

  // Elementos
  const loginArea = document.getElementById("loginArea");
  const adminArea = document.getElementById("adminArea");
  const loginForm = document.getElementById("loginForm");
  const loginButton = document.getElementById("loginButton");
  const loginStatus = document.getElementById("loginStatus");
  const logoutButton = document.getElementById("logoutButton");
  const adminEmail = document.getElementById("adminEmail");

  const productForm = document.getElementById("productForm");
  const productId = document.getElementById("productId");
  const productTitle = document.getElementById("productTitle");
  const productDescription = document.getElementById("productDescription");
  const productPrice = document.getElementById("productPrice");
  const productImage = document.getElementById("productImage");
  const productLink = document.getElementById("productLink");
  const saveProductButton = document.getElementById("saveProductButton");
  const cancelEditButton = document.getElementById("cancelEditButton");
  const formTitle = document.getElementById("formTitle");
  const productStatus = document.getElementById("productStatus");
  const productList = document.getElementById("productList");
  const listStatus = document.getElementById("listStatus");

  if (!firebase.apps.length) {
    setStatus(loginStatus, "Erro ao carregar Firebase. Verifique o arquivo de configuração.", "error");
    return;
  }

  const auth = firebase.auth();
  const db = firebase.firestore();

  // ==================== LOGIN ====================

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const isAdmin = ADMIN_EMAILS
        .map(e => e.toLowerCase())
        .includes(user.email.toLowerCase());

      if (!isAdmin) {
        await auth.signOut();
        loginArea.classList.remove("hidden");
        adminArea.classList.add("hidden");
        setStatus(loginStatus, "Acesso negado. Este e-mail não tem permissão.", "error");
        return;
      }

      loginArea.classList.add("hidden");
      adminArea.classList.remove("hidden");
      adminEmail.textContent = user.email;
      loadProducts();
    } else {
      loginArea.classList.remove("hidden");
      adminArea.classList.add("hidden");
      productList.innerHTML = `<p class="muted">Carregando produtos...</p>`;
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus(loginStatus, "Entrando...");
    loginButton.disabled = true;

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
      setStatus(loginStatus, getAuthErrorMessage(error.code), "error");
    } finally {
      loginButton.disabled = false;
    }
  });

  logoutButton.addEventListener("click", async () => {
    try {
      await auth.signOut();
      setStatus(loginStatus, "");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  });

  function getAuthErrorMessage(code) {
    const messages = {
      "auth/invalid-email": "E-mail inválido.",
      "auth/user-disabled": "Conta desativada.",
      "auth/user-not-found": "Usuário não encontrado.",
      "auth/wrong-password": "Senha incorreta.",
      "auth/invalid-credential": "E-mail ou senha incorretos.",
      "auth/too-many-requests": "Muitas tentativas. Tente mais tarde.",
      "auth/network-request-failed": "Erro de conexão."
    };
    return messages[code] || "Erro ao fazer login. Tente novamente.";
  }

  function setStatus(element, message, type = "") {
    element.textContent = message;
    element.className = `status ${type}`;
  }

  // ==================== PRODUTOS ====================

  function resetForm() {
    productForm.reset();
    productId.value = "";
    formTitle.textContent = "Cadastrar novo e-book";
    saveProductButton.textContent = "Cadastrar e-book";
    cancelEditButton.classList.add("hidden");
    setStatus(productStatus, "");
  }

  cancelEditButton.addEventListener("click", resetForm);

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus(productStatus, "Salvando...");
    saveProductButton.disabled = true;

    const data = {
      title: productTitle.value.trim(),
      description: productDescription.value.trim(),
      price: Number(productPrice.value),
      image: productImage.value.trim(),
      link: productLink.value.trim(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!data.title || !data.description || isNaN(data.price) || data.price < 0) {
      setStatus(productStatus, "Preencha todos os campos corretamente.", "error");
      saveProductButton.disabled = false;
      return;
    }

    try {
      if (productId.value) {
        await db.collection("produtos").doc(productId.value).update(data);
        setStatus(productStatus, "E-book atualizado com sucesso!", "success");
      } else {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection("produtos").add(data);
        setStatus(productStatus, "E-book cadastrado com sucesso!", "success");
      }
      resetForm();
    } catch (error) {
      console.error(error);
      setStatus(productStatus, "Erro ao salvar o e-book.", "error");
    } finally {
      saveProductButton.disabled = false;
    }
  });

  function loadProducts() {
    setStatus(listStatus, "");

    db.collection("produtos")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          productList.innerHTML = `<p class="muted">Nenhum e-book cadastrado ainda.</p>`;
          return;
        }

        productList.innerHTML = "";

        snapshot.forEach(doc => {
          const product = doc.data();
          const id = doc.id;

          const card = document.createElement("div");
          card.className = "product";

          card.innerHTML = `
            <div>
              <h3>${escapeHtml(product.title)}</h3>
              <p>${escapeHtml(product.description)}</p>
              <p style="margin-top: 8px; color: #1fc51f; font-weight: 600;">
                ${Number(product.price).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
              </p>
            </div>
            <div class="product-actions">
              <button class="button secondary btn-edit" data-id="${id}">Editar</button>
              <button class="button danger btn-delete" data-id="${id}">Excluir</button>
            </div>
          `;

          productList.appendChild(card);
        });

        document.querySelectorAll(".btn-edit").forEach(btn => {
          btn.addEventListener("click", () => editProduct(btn.dataset.id));
        });

        document.querySelectorAll(".btn-delete").forEach(btn => {
          btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
        });
      }, error => {
        console.error(error);
        productList.innerHTML = `<p class="muted">Erro ao carregar produtos.</p>`;
        setStatus(listStatus, "Não foi possível carregar os e-books.", "error");
      });
  }

  async function editProduct(id) {
    try {
      const doc = await db.collection("produtos").doc(id).get();
      if (!doc.exists) {
        setStatus(productStatus, "Produto não encontrado.", "error");
        return;
      }

      const data = doc.data();
      productId.value = id;
      productTitle.value = data.title || "";
      productDescription.value = data.description || "";
      productPrice.value = data.price || "";
      productImage.value = data.image || "";
      productLink.value = data.link || "";

      formTitle.textContent = "Editar e-book";
      saveProductButton.textContent = "Salvar alterações";
      cancelEditButton.classList.remove("hidden");
      productForm.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error(error);
      setStatus(productStatus, "Erro ao carregar produto.", "error");
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Tem certeza que deseja excluir este e-book?")) return;

    try {
      await db.collection("produtos").doc(id).delete();
      setStatus(listStatus, "E-book excluído com sucesso.", "success");
      setTimeout(() => setStatus(listStatus, ""), 3000);
    } catch (error) {
      console.error(error);
      setStatus(listStatus, "Erro ao excluir o e-book.", "error");
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});