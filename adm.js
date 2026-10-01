
Esses ``` precisam ser removidos.

### Substitua TODO o seu `admin.js` por este:

```javascript
/* global firebase */

const auth = firebase.auth();
const db = firebase.firestore();

const loginArea = document.getElementById("loginArea");
const adminLayout = document.getElementById("adminLayout");

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");

const logoutButton = document.getElementById("logoutButton");

const productForm = document.getElementById("productForm");
const productId = document.getElementById("productId");
const productName = document.getElementById("productName");
const productType = document.getElementById("productType");
const productPrice = document.getElementById("productPrice");
const productStatus = document.getElementById("productStatus");
const productDescription = document.getElementById("productDescription");
const productImage = document.getElementById("productImage");
const productLink = document.getElementById("productLink");

const productMessage = document.getElementById("productMessage");
const productsList = document.getElementById("productsList");

const saveProductButton =
    document.getElementById("saveProductButton");

const cancelEditButton =
    document.getElementById("cancelEditButton");


loginArea.style.display = "flex";
adminLayout.style.display = "none";


auth.onAuthStateChanged(async (user) => {

    if (!user) {
        loginArea.style.display = "flex";
        adminLayout.style.display = "none";
        return;
    }

    try {

        const userDoc = await db
            .collection("usuario")
            .doc(user.uid)
            .get();

        if (!userDoc.exists) {

            await auth.signOut();

            loginMessage.textContent =
                "Usuário administrativo não encontrado.";

            return;
        }

        const userData = userDoc.data();

        if (userData.perfil !== "admin") {

            await auth.signOut();

            loginMessage.textContent =
                "Você não possui permissão de administrador.";

            return;
        }

        loginArea.style.display = "none";
        adminLayout.style.display = "block";

        carregarProdutos();

    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            "Erro ao verificar administrador.";
    }
});


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    loginMessage.textContent = "Entrando...";

    try {

        await auth.signInWithEmailAndPassword(
            email.value.trim(),
            password.value
        );

        loginMessage.textContent = "";

    } catch (error) {

        console.error(error);

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/user-not-found"
        ) {

            loginMessage.textContent =
                "E-mail ou senha incorretos.";

        } else {

            loginMessage.textContent =
                "Não foi possível entrar.";
        }
    }
});


logoutButton.addEventListener("click", async () => {

    try {

        await auth.signOut();

    } catch (error) {

        console.error(error);
    }
});


productForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const nome = productName.value.trim();
    const tipo = productType.value;
    const preco = Number(productPrice.value);
    const status = productStatus.value;
    const descricao = productDescription.value.trim();
    const imagem = productImage.value.trim();
    const link = productLink.value.trim();

    if (!nome || !tipo || !descricao) {

        productMessage.textContent =
            "Preencha os campos obrigatórios.";

        return;
    }

    saveProductButton.disabled = true;
    saveProductButton.textContent = "Salvando...";

    try {

        const produto = {

            nome: nome,
            tipo: tipo,
            preco: preco,
            status: status,
            descricao: descricao,
            imagem: imagem,
            link: link,

            atualizadoEm:
                firebase.firestore.FieldValue.serverTimestamp()
        };

        if (productId.value) {

            await db
                .collection("produtos")
                .doc(productId.value)
                .update(produto);

            productMessage.textContent =
                "Produto atualizado com sucesso.";

        } else {

            produto.criadoEm =
                firebase.firestore.FieldValue.serverTimestamp();

            await db
                .collection("produtos")
                .add(produto);

            productMessage.textContent =
                "Produto adicionado com sucesso.";
        }

        limparFormulario();
        carregarProdutos();

    } catch (error) {

        console.error(error);

        productMessage.textContent =
            "Erro ao salvar o produto.";

    } finally {

        saveProductButton.disabled = false;

        saveProductButton.textContent =
            "Adicionar produto";
    }
});


cancelEditButton.addEventListener("click", () => {

    limparFormulario();

});


async function carregarProdutos() {

    productsList.innerHTML = `
        <div class="loading">
            Carregando produtos...
        </div>
    `;

    try {

        const snapshot = await db
            .collection("produtos")
            .orderBy("criadoEm", "desc")
            .get();

        if (snapshot.empty) {

            productsList.innerHTML = `
                <div class="empty">
                    Nenhum produto cadastrado ainda.
                </div>
            `;

            return;
        }

        productsList.innerHTML = "";

        snapshot.forEach((doc) => {

            const produto = doc.data();

            const card = document.createElement("article");

            card.className = "admin-product-card";

            const preco = Number(produto.preco || 0);

            const precoFormatado =
                preco > 0
                    ? preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })
                    : "Grátis";

            card.innerHTML = `

                <div class="admin-product-image">

                    ${
                        produto.imagem
                            ? `<img src="${produto.imagem}" alt="${escapeHTML(produto.nome)}">`
                            : `<span>EVOLUA</span>`
                    }

                </div>

                <div class="admin-product-content">

                    <span class="product-type">
                        ${escapeHTML(produto.tipo || "Produto")}
                    </span>

                    <h3>
                        ${escapeHTML(produto.nome || "Sem nome")}
                    </h3>

                    <p>
                        ${escapeHTML(produto.descricao || "")}
                    </p>

                    <div class="admin-product-info">

                        <strong>
                            ${precoFormatado}
                        </strong>

                        <span>
                            ${escapeHTML(produto.status || "Disponível")}
                        </span>

                    </div>

                    <div class="admin-product-actions">

                        <button
                            class="btn btn-edit"
                            onclick="editarProduto('${doc.id}')"
                        >
                            Editar
                        </button>

                        <button
                            class="btn btn-delete"
                            onclick="excluirProduto('${doc.id}')"
                        >
                            Excluir
                        </button>

                    </div>

                </div>
            `;

            productsList.appendChild(card);
        });

    } catch (error) {

        console.error(error);

        productsList.innerHTML = `
            <div class="empty">
                Não foi possível carregar os produtos.
            </div>
        `;
    }
}


window.editarProduto = async function (id) {

    try {

        const doc = await db
            .collection("produtos")
            .doc(id)
            .get();

        if (!doc.exists) {

            productMessage.textContent =
                "Produto não encontrado.";

            return;
        }

        const produto = doc.data();

        productId.value = id;
        productName.value = produto.nome || "";
        productType.value = produto.tipo || "";
        productPrice.value = produto.preco || "";

        productStatus.value =
            produto.status || "Disponível";

        productDescription.value =
            produto.descricao || "";

        productImage.value =
            produto.imagem || "";

        productLink.value =
            produto.link || "";

        saveProductButton.textContent =
            "Salvar alterações";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

        productMessage.textContent =
            "Erro ao carregar produto.";
    }
};


window.excluirProduto = async function (id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmar) {
        return;
    }

    try {

        await db
            .collection("produtos")
            .doc(id)
            .delete();

        productMessage.textContent =
            "Produto excluído com sucesso.";

        carregarProdutos();

    } catch (error) {

        console.error(error);

        productMessage.textContent =
            "Erro ao excluir produto.";
    }
};


function limparFormulario() {

    productForm.reset();

    productId.value = "";

    productStatus.value = "Disponível";

    saveProductButton.textContent =
        "Adicionar produto";
}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}