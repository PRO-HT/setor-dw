const featuredProjects = [
    ["Calculadora de Notas", "Grade Calculator", "Calculadora de notas para obter a média final a partir das avaliações.", "Grade calculator for obtaining the final average from assessments.", "https://pro-ht.github.io/portfolio-main/assets/img/projetos/projetos.png", "https://pro-ht.github.io/Calculadora-Protasio-Alves/", "https://github.com/PRO-HT/Calculadora-Protasio-Alves"],
    ["Dia Internacional das Mulheres", "International Women`s Day", "Site sobre historia, direitos, resistencia e conscientizacao.", "Website about history, rights, resistance and awareness.", "https://pro-ht.github.io/portfolio-main/assets/img/projetos/Dia_da_mulher.png", "https://pro-ht.github.io/Dia_Internacional_das_Mulheres-main/", "https://github.com/PRO-HT/Dia_Internacional_das_Mulheres-main"],
    ["Feminicidio", "Femicide Awareness", "Site informativo sobre violencia contra mulheres e a importancia da denuncia.", "Awareness website about violence against women and reporting.", "https://pro-ht.github.io/portfolio-main/assets/img/projetos/Feminic%C3%ADdio.png", "https://pro-ht.github.io/Feminicidio-main/", "https://github.com/PRO-HT/Feminicidio-main"],
    ["Painel ML", "ML Panel", "Painel de visualização desenvolvido para apresentação de informações.", "Information dashboard developed for displaying data.", "https://pro-ht.github.io/portfolio-main/assets/img/projetos/painelML.png", "https://painel-ml.netlify.app/", "https://github.com/PRO-HT"],
    ["Solução Completa", "Complete Solution", "Página institucional para serviços digitais, suporte técnico e manutenção.", "Institutional page for digital services, technical support and maintenance.", "https://pro-ht.github.io/portfolio-main/assets/img/projetos/solucao-completa.png", "https://solucao-completa.netlify.app/", "https://github.com/PRO-HT/Solucao-Completa"],
    ["EJ Web Studio", "EJ Web Studio", "Landing page para apresentar uma agência e suas soluções digitais.", "Landing page presenting a web agency and its digital solutions.", "https://pro-ht.github.io/portfolio-main/assets/img/projetos/ejwebstudio.png", "https://ejwebstudio.netlify.app/", "https://github.com/PRO-HT/ej-web-studio"]
];
const catalog = { evaluations: [], activities: [], projects: featuredProjects.map(([titlePt, titleEn, descriptionPt, descriptionEn, image, demo, repository]) => ({ title: { "pt-BR": titlePt, en: titleEn }, description: { "pt-BR": descriptionPt, en: descriptionEn }, technologies: ["HTML", "CSS", "JavaScript"], image, demo, repository })) };
const state = { language: localStorage.getItem("portfolio-language") || "pt-BR", translations: null };
const getValue = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);

const translatePage = () => {
    document.documentElement.lang = state.language;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const value = getValue(state.translations, element.dataset.i18n);
        if (value !== undefined) element.textContent = value;
    });
    document.querySelectorAll("[data-lang]").forEach((button) =>
        button.setAttribute("aria-pressed", String(button.dataset.lang === state.language)));
};

const renderLibrary = (filter = "all") => {
    const grid = document.getElementById("library-grid");
    const items = [
        ...catalog.evaluations.map((item) => ({ ...item, type: "evaluation" })),
        ...catalog.activities.map((item) => ({ ...item, type: "activity" }))
    ].filter((item) => filter === "all" || item.type === filter);
    grid.innerHTML = items.length ? items.map((item) => `
        <article class="portfolio-card">
            <div class="card-body">
                <span class="card-type">${getValue(state.translations, `library.types.${item.type}`)}</span>
                <h3>${item.title[state.language] || item.title["pt-BR"]}</h3>
                <p>${item.description[state.language] || item.description["pt-BR"]}</p>
                <ul class="tag-list">${item.technologies.map((technology) => `<li>${technology}</li>`).join("")}</ul>
            </div>
        </article>`).join("") : `<div class="empty-state">${getValue(state.translations, "empty.library")}</div>`;
};

const renderProjects = () => {
    document.getElementById("projects-grid").innerHTML = catalog.projects.length
        ? catalog.projects.map((project) => `
            <article class="portfolio-card featured-project">
                <div class="project-cover"><img src="${project.image}" alt="${project.title[state.language] || project.title["pt-BR"]}" loading="lazy"></div>
                <div class="card-body">
                <span class="card-type">${getValue(state.translations, "projects.cardLabel")}</span>
                <h3>${project.title[state.language] || project.title["pt-BR"]}</h3>
                <p>${project.description[state.language] || project.description["pt-BR"]}</p>
                <ul class="tag-list">${project.technologies.map((technology) => `<li>${technology}</li>`).join("")}</ul>
                <div class="project-actions">
                    <a class="button button-primary" href="${project.demo}" target="_blank" rel="noopener noreferrer">${state.language === "en" ? "View project" : "Ver projeto"}</a>
                </div>
            </div></article>`).join("")
        : `<div class="empty-state">${getValue(state.translations, "empty.projects")}</div>`;
};

const renderTeam = () => {
    document.getElementById("team-grid").innerHTML = ["jamylle", "enzo"].map((member) => {
        const data = getValue(state.translations, `team.members.${member}`);
        return `<article class="member-card">
            <div class="member-photo">
                <img src="${member === "enzo" ? "assets/img/team/EquipeJunta.jpeg" : "assets/img/team/Jamylle.jpeg"}" alt="${member === "enzo" ? "Enzo Araújo e Jamylle Woicjiekowski" : data.name}">
            </div>
            <div class="member-content">
                <h3>${data.name}</h3><p class="member-role">${data.role}</p><p>${data.description}</p>
                <ul class="tag-list">${data.skills.map((skill) => `<li>${skill}</li>`).join("")}</ul>
            </div>
        </article>`;
    }).join("");
};

const updateInterface = () => {
    translatePage();
    renderProjects();
    renderTeam();
};

const loadTranslations = async () => {
    try {
        const response = await fetch("assets/i18n/translations.json");
        if (!response.ok) throw new Error("Translation file unavailable");
        const translations = await response.json();
        state.translations = translations[state.language];
        updateInterface();
    } catch (error) {
        document.body.innerHTML = '<main style="padding:32px;font-family:sans-serif"><h1>Portfólio DW</h1><p>Execute o site em um servidor local para carregar as traduções.</p></main>';
    }
};

document.querySelectorAll("[data-lang]").forEach((button) => button.addEventListener("click", () => {
    state.language = button.dataset.lang;
    localStorage.setItem("portfolio-language", state.language);
    loadTranslations();
}));
document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((filter) => filter.classList.remove("active"));
    button.classList.add("active");
    renderLibrary(button.dataset.filter);
}));
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
});

const siteHeader = document.querySelector(".site-header");
let previousScrollPosition = window.scrollY;

window.addEventListener("scroll", () => {
    const currentScrollPosition = window.scrollY;
    const scrollingDown = currentScrollPosition > previousScrollPosition;

    if (currentScrollPosition > 80) {
        siteHeader.classList.toggle("header-hidden", scrollingDown);
    } else {
        siteHeader.classList.remove("header-hidden");
    }

    previousScrollPosition = Math.max(currentScrollPosition, 0);
}, { passive: true });
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
}));
loadTranslations();
