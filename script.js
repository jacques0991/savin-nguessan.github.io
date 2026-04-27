class PortfolioSite {
    constructor() {
        this.page = document.body.dataset.page || "index.html";
        this.navGroup = document.body.dataset.navGroup || this.page;
        this.header = document.querySelector("[data-header]");
        this.menuButton = document.querySelector("[data-menu-button]");
        this.nav = document.querySelector("[data-nav]");
        this.form = document.querySelector("#contactForm");
        this.status = document.querySelector("#formStatus");

        this.setActiveNavigation();
        this.bindMenu();
        this.bindHeaderState();
        this.bindReveal();
        this.bindContactForm();
    }

    setActiveNavigation() {
        if (!this.nav) return;

        this.nav.querySelectorAll("a[href]").forEach((link) => {
            const href = link.getAttribute("href");
            if (href === this.navGroup) {
                link.classList.add("active");
            }
        });
    }

    bindMenu() {
        if (!this.menuButton || !this.nav) return;

        this.menuButton.addEventListener("click", () => {
            const isOpen = document.body.classList.toggle("nav-open");
            this.menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        this.nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                document.body.classList.remove("nav-open");
                this.menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    bindHeaderState() {
        if (!this.header) return;

        const updateHeader = () => {
            this.header.classList.toggle("is-scrolled", window.scrollY > 12);
        };

        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });
    }

    bindReveal() {
        const items = document.querySelectorAll("[data-reveal]");
        if (!items.length) return;

        const revealAll = () => items.forEach((item) => item.classList.add("is-visible"));

        if (!("IntersectionObserver" in window)) {
            revealAll();
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.16 }
        );

        items.forEach((item) => observer.observe(item));
    }

    bindContactForm() {
        if (!this.form) return;

        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            const fields = [
                this.form.querySelector("#name"),
                this.form.querySelector("#email"),
                this.form.querySelector("#subject"),
                this.form.querySelector("#message")
            ];

            const isValid = fields.every((field) => this.validateField(field));
            if (!isValid) {
                this.setStatus("Merci de remplir correctement les champs obligatoires.");
                return;
            }

            const [name, email, subject, message] = fields.map((field) => field.value.trim());
            const mailSubject = encodeURIComponent(subject);
            const mailBody = encodeURIComponent(
                `Bonjour Savin,\r\n\r\n` +
                `Nom: ${name}\r\n` +
                `Email: ${email}\r\n\r\n` +
                `${message}\r\n\r\n` +
                `Cordialement`
            );

            this.setStatus("La messagerie va s'ouvrir avec un email pre-rempli.");
            window.location.href = `mailto:nguessansavin@gmail.com?subject=${mailSubject}&body=${mailBody}`;
        });
    }

    validateField(field) {
        if (!field) return false;

        const value = field.value.trim();
        let valid = value.length > 0;

        if (field.type === "email") {
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        field.classList.toggle("is-invalid", !valid);
        return valid;
    }

    setStatus(message) {
        if (this.status) {
            this.status.textContent = message;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PortfolioSite();
});
