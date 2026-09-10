// ==========================================
// FIREBASE
// ==========================================

const db = firebase.firestore();
const storage = firebase.storage();


// ==========================================
// ELEMENTOS
// ==========================================

const loginOverlay = document.getElementById("login-overlay");
const adminContent = document.getElementById("admin-content");

const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginSenha = document.getElementById("login-senha");

const loginMensagem = document.getElementById("login-mensagem");

const textoLogin = document.getElementById("texto-login");
const loadingLogin = document.getElementById("loading-login");

const btnLogout = document.getElementById("btn-logout");

const btnMostrarForm =
    document.getElementById("btn-mostrar-form");

const btnSalvar =
    document.getElementById("btn-salvar");

const btnCancelar =
    document.getElementById("btn-cancelar");

const tipoImagem =
    document.getElementById("tipoImagem");

const campoURL =
    document.getElementById("campo-url");

const campoArquivo =
    document.getElementById("campo-arquivo");


// ==========================================
// VERIFICAR LOGIN
// ==========================================

firebase.auth().onAuthStateChanged((user) => {

    if (user) {

        console.log("Usuário logado:", user.email);

        loginOverlay.style.display = "none";

        adminContent.style.display = "block";

        carregarProdutos();

    } else {

        console.log("Nenhum usuário logado.");

        loginOverlay.style.display = "flex";

        adminContent.style.display = "none";

    }

});


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = loginEmail.value.trim();
    const senha = loginSenha.value;

    if (!email || !senha) {

        mostrarErroLogin(
            "Preencha o e-mail e a senha."
        );

        return;
    }


    textoLogin.style.display = "none";
    loadingLogin.style.display = "inline-block";

    loginMensagem.classList.add("d-none");


    try {

        await firebase.auth()
            .signInWithEmailAndPassword(
                email,
                senha
            );

        loginForm.reset();

    }

    catch (error) {

        console.error(
            "Erro no login:",
            error
        );

        let mensagem =
            "Não foi possível entrar.";

        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            mensagem =
                "E-mail ou senha incorretos.";

        }

        else if (
            error.code ===
            "auth/user-not-found"
        ) {

            mensagem =
                "Usuário não encontrado.";

        }

        else if (
            error.code ===
            "auth/wrong-password"
        ) {

            mensagem =
                "Senha incorreta.";

        }

        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            mensagem =
                "Digite um e-mail válido.";

        }

        else if (
            error.code ===
            "auth/too-many-requests"
        ) {

            mensagem =
                "Muitas tentativas. Aguarde um pouco.";

        }

        else {

            mensagem =
                error.message;

        }

        mostrarErroLogin(mensagem);

    }

    finally {

        textoLogin.style.display = "inline";

        loadingLogin.style.display = "none";

    }

});


// ==========================================
// MOSTRAR ERRO DO LOGIN
// ==========================================

function mostrarErroLogin(texto) {

    loginMensagem.textContent = texto;

    loginMensagem.className =
        "alert alert-danger";

}


// ==========================================
// LOGOUT
// ==========================================

btnLogout.addEventListener(
    "click",
    async () => {

        try {

            await firebase.auth().signOut();

        }

        catch (error) {

            console.error(
                "Erro ao sair:",
                error
            );

        }

    }
);


// ==========================================
// MOSTRAR FORMULÁRIO
// ==========================================

btnMostrarForm.addEventListener(
    "click",
    () => {

        document
            .getElementById("form-produto")
            .classList.remove("d-none");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


// ==========================================
// CANCELAR
// ==========================================

btnCancelar.addEventListener(
    "click",
    () => {

        limparFormulario();

        document
            .getElementById("form-produto")
            .classList.add("d-none");

    }
);


// ==========================================
// TIPO DE IMAGEM
// ==========================================

tipoImagem.addEventListener(
    "change",
    alternarEntradaImagem
);


function alternarEntradaImagem() {

    if (tipoImagem.value === "url") {

        campoURL.classList.remove("d-none");

        campoArquivo.classList.add("d-none");

    }

    else {

        campoURL.classList.add("d-none");

        campoArquivo.classList.remove("d-none");

    }

}


// ==========================================
// SALVAR PRODUTO
// ==========================================

btnSalvar.addEventListener(
    "click",
    salvarProduto
);


async function salvarProduto() {

    const nome =
        document
            .getElementById("nome")
            .value
            .trim();


    const preco =
        parseFloat(
            document
                .getElementById("preco")
                .value
        );


    const estoque =
        parseInt(
            document
                .getElementById("estoque")
                .value
        );


    const imagemURL =
        document
            .getElementById("imagemURL")
            .value
            .trim();


    const arquivo =
        document
            .getElementById("imagemArquivo")
            .files[0];


    const idProduto =
        document
            .getElementById("id-produto")
            .value;


    const tipo =
        tipoImagem.value;


    // --------------------------------------
    // VALIDAÇÃO
    // --------------------------------------

    if (!nome) {

        mostrarMensagem(
            "Digite o nome do produto.",
            "warning"
        );

        return;

    }


    if (isNaN(preco) || preco < 0) {

        mostrarMensagem(
            "Digite um preço válido.",
            "warning"
        );

        return;

    }


    if (isNaN(estoque) || estoque < 0) {

        mostrarMensagem(
            "Digite um estoque válido.",
            "warning"
        );

        return;

    }


    const user =
        firebase.auth().currentUser;


    if (!user) {

        mostrarMensagem(
            "Você precisa estar logado.",
            "danger"
        );

        return;

    }


    try {

        btnSalvar.disabled = true;

        btnSalvar.textContent =
            "Salvando...";


        let imagem = imagemURL;


        // --------------------------------------
        // UPLOAD DA IMAGEM
        // --------------------------------------

        if (
            tipo === "arquivo" &&
            arquivo
        ) {

            mostrarMensagem(
                "Enviando imagem...",
                "info"
            );


            const nomeArquivo =
                Date.now() +
                "_" +
                arquivo.name;


            const referencia =
                storage
                    .ref()
                    .child(
                        "produtos/" +
                        nomeArquivo
                    );


            await referencia.put(
                arquivo
            );


            imagem =
                await referencia
                    .getDownloadURL();

        }


        // --------------------------------------
        // PRODUTO
        // --------------------------------------

        const produto = {

            nome: nome,

            preco: preco,

            estoque: estoque,

            imagem: imagem,

            atualizadoEm:
                firebase
                    .firestore
                    .FieldValue
                    .serverTimestamp(),

            criadoPor:
                user.email

        };


        // --------------------------------------
        // EDITAR
        // --------------------------------------

        if (idProduto) {

            await db
                .collection("produtos")
                .doc(idProduto)
                .update(produto);


            mostrarMensagem(
                "Produto atualizado com sucesso!",
                "success"
            );

        }


        // --------------------------------------
        // NOVO PRODUTO
        // --------------------------------------

        else {

            produto.criadoEm =
                firebase
                    .firestore
                    .FieldValue
                    .serverTimestamp();


            await db
                .collection("produtos")
                .add(produto);


            mostrarMensagem(
                "Produto adicionado com sucesso!",
                "success"
            );

        }


        limparFormulario();


        document
            .getElementById("form-produto")
            .classList.add("d-none");


        carregarProdutos();

    }

    catch (error) {

        console.error(
            "Erro ao salvar:",
            error
        );

        mostrarMensagem(
            "Erro ao salvar produto: " +
            error.message,
            "danger"
        );

    }

    finally {

        btnSalvar.disabled = false;

        btnSalvar.textContent =
            "Salvar produto";

    }

}


// ==========================================
// CARREGAR PRODUTOS
// ==========================================

async function carregarProdutos() {

    const lista =
        document
            .getElementById("lista-produtos");


    lista.innerHTML = `
        <div class="col-12 text-center py-5">
            <div
                class="spinner-border"
                role="status">
            </div>

            <p class="mt-2">
                Carregando produtos...
            </p>
        </div>
    `;


    try {

        const snapshot =
            await db
                .collection("produtos")
                .orderBy(
                    "criadoEm",
                    "desc"
                )
                .get();


        lista.innerHTML = "";


        if (snapshot.empty) {

            lista.innerHTML = `
                <div class="col-12">

                    <div class="alert alert-info">

                        Nenhum produto cadastrado.

                    </div>

                </div>
            `;

            return;

        }


        snapshot.forEach((doc) => {

            const produto =
                doc.data();


            const preco =
                Number(
                    produto.preco || 0
                )
                .toFixed(2)
                .replace(".", ",");


            const imagem =
                produto.imagem ||
                "https://via.placeholder.com/400x250?text=Sem+Imagem";


            lista.innerHTML += `

                <div class="col-md-4 mb-4">

                    <div class="card produto-card h-100 shadow-sm">

                        <img
                            src="${imagem}"
                            class="card-img-top"
                            alt="${produto.nome || "Produto"}"
                            onerror="
                                this.src='https://via.placeholder.com/400x250?text=Sem+Imagem'
                            "
                        >

                        <div class="card-body">

                            <h5 class="card-title">
                                ${produto.nome || "Sem nome"}
                            </h5>

                            <p class="card-text">

                                <strong>
                                    R$ ${preco}
                                </strong>

                            </p>

                            <p class="card-text">

                                Estoque:
                                ${produto.estoque || 0}

                            </p>

                            <div>

                                <button
                                    class="btn btn-warning btn-sm me-2"
                                    onclick="editarProduto('${doc.id}')">

                                    Editar

                                </button>

                                <button
                                    class="btn btn-danger btn-sm"
                                    onclick="excluirProduto('${doc.id}')">

                                    Excluir

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(
            "Erro ao carregar produtos:",
            error
        );


        lista.innerHTML = `

            <div class="col-12">

                <div class="alert alert-danger">

                    Erro ao carregar produtos.

                    <br>

                    ${error.message}

                </div>

            </div>

        `;

    }

}


// ==========================================
// EDITAR PRODUTO
// ==========================================

async function editarProduto(id) {

    try {

        const doc =
            await db
                .collection("produtos")
                .doc(id)
                .get();


        if (!doc.exists) {

            mostrarMensagem(
                "Produto não encontrado.",
                "danger"
            );

            return;

        }


        const produto =
            doc.data();


        document
            .getElementById("nome")
            .value =
            produto.nome || "";


        document
            .getElementById("preco")
            .value =
            produto.preco || "";


        document
            .getElementById("estoque")
            .value =
            produto.estoque || "";


        document
            .getElementById("imagemURL")
            .value =
            produto.imagem || "";


        document
            .getElementById("id-produto")
            .value =
            id;


        tipoImagem.value =
            "url";


        alternarEntradaImagem();


        document
            .getElementById("form-produto")
            .classList.remove("d-none");


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    catch (error) {

        console.error(error);

        mostrarMensagem(
            "Erro ao editar produto.",
            "danger"
        );

    }

}


// ==========================================
// EXCLUIR PRODUTO
// ==========================================

async function excluirProduto(id) {

    const confirmar =
        confirm(
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


        mostrarMensagem(
            "Produto excluído com sucesso!",
            "success"
        );


        carregarProdutos();

    }

    catch (error) {

        console.error(error);

        mostrarMensagem(
            "Erro ao excluir produto: " +
            error.message,
            "danger"
        );

    }

}


// ==========================================
// LIMPAR FORMULÁRIO
// ==========================================

function limparFormulario() {

    document
        .getElementById("nome")
        .value = "";


    document
        .getElementById("preco")
        .value = "";


    document
        .getElementById("estoque")
        .value = "";


    document
        .getElementById("imagemURL")
        .value = "";


    document
        .getElementById("imagemArquivo")
        .value = "";


    document
        .getElementById("id-produto")
        .value = "";


    tipoImagem.value =
        "url";


    alternarEntradaImagem();

}


// ==========================================
// MENSAGEM
// ==========================================

function mostrarMensagem(
    texto,
    tipo = "info"
) {

    const mensagem =
        document.getElementById(
            "mensagem"
        );


    mensagem.className =
        `alert alert-${tipo}`;


    mensagem.textContent =
        texto;


    mensagem.classList.remove(
        "d-none"
    );


    setTimeout(() => {

        mensagem.classList.add(
            "d-none"
        );

    }, 5000);

}