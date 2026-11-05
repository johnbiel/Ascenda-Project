
const LINKS = {
    discord: "",
    whatsapp: "",
    instagram: ""
};

const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector(".nav");

menuToggle.addEventListener("click", function() {
    nav.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", function() {
        nav.classList.remove("open");
    });
});

document.querySelectorAll("[data-social]").forEach(button => {
    button.addEventListener("click", function(event) {
        event.preventDefault();

        const social = this.dataset.social;
        const link = LINKS[social];

        if (!link) {
            alert("O link desta plataforma ainda será disponibilizado. Em breve!");
            return;
        }

        window.open(link, "_blank", "noopener,noreferrer");
    });
});
