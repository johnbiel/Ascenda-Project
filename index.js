// =========================
// MENU MOBILE
// =========================

const nav = document.querySelector("nav");
const header = document.querySelector(".header");

// Cria botão do menu
const menuButton = document.createElement("button");

menuButton.classList.add("menu-mobile");
menuButton.innerHTML = "☰";

header.querySelector(".nav").prepend(menuButton);

menuButton.addEventListener("click", () => {
    nav.classList.toggle("menu-open");
});


// =========================
// FECHAR MENU AO CLICAR
// =========================

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("menu-open");
    });
});


// =========================
// ANIMAÇÃO AO ROLAR
// =========================

const elements = document.querySelectorAll(
    ".product-card, .benefit, .about-content, .hero-card"
);

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }

        });
    },
    {
        threshold: 0.15
    }
);

elements.forEach(element => {
    element.classList.add("hidden");
    observer.observe(element);
});


// =========================
// ANO AUTOMÁTICO
// =========================

const year = new Date().getFullYear();

const copyright = document.querySelector(".copyright p");

if (copyright) {
    copyright.innerHTML =
        `© ${year} Evolua. Todos os direitos reservados.`;
}


// =========================
// SCROLL SUAVE
// =========================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(event) {

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


// =========================
// LOG NO CONSOLE
// =========================

console.log("Evolua carregado com sucesso.");