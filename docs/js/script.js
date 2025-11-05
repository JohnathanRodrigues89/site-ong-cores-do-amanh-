document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------
    // MENU HAMBÚRGUER E RESPONSIVO
    // -------------------------------
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.navbar__link-list');

    if (hamburger && navMenu) {
        hamburger.setAttribute('aria-controls', 'main-navigation');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
        navMenu.setAttribute('role', 'menu');

        const toggleMenu = () => {
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        };

        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        document.querySelectorAll('.navlink a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // -------------------------------
    // MODO DE ALTO CONTRASTE (ACESSIBILIDADE)
    // -------------------------------
    const contrastButton = document.createElement('button');
    contrastButton.textContent = 'Alto Contraste';
    contrastButton.className = 'btn-contraste';
    contrastButton.setAttribute('aria-pressed', 'false');
    contrastButton.setAttribute('aria-label', 'Ativar ou desativar modo de alto contraste');
    document.body.appendChild(contrastButton);

    contrastButton.addEventListener('click', () => {
        const isActive = document.body.classList.toggle('alto-contraste');
        contrastButton.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // -------------------------------
    // SISTEMA DE PROJETOS DINÂMICOS (index.html / projetos.html)
    // -------------------------------
    const projetosContainer = document.querySelector('.projetos-grid');
    if (projetosContainer) {
        const projetos = [
            { title: "Oficinas de Arte", description: "Atividades artísticas para crianças e jovens.", img: "project1.jpg" },
            { title: "Educação e Inclusão", description: "Projetos educativos e sociais.", img: "project2.jpg" },
            { title: "Voluntariado", description: "Participação em ações comunitárias.", img: "project3.jpg" }
        ];

        projetosContainer.innerHTML = '';
        projetos.forEach(p => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card__img-container">
                    <img src="${p.img}" alt="${p.title}" class="card__img">
                </div>
                <div class="card__title">${p.title}</div>
                <p>${p.description}</p>
            `;
            projetosContainer.appendChild(card);
        });
    }

    // -------------------------------
    // FORMULÁRIO CADASTRO COM VALIDAÇÃO E TOAST
    // -------------------------------
    const form = document.getElementById('form-cadastro');
    const formErrors = [];
    const toastContainer = document.getElementById('toast-container') || (() => {
        const div = document.createElement('div');
        div.id = 'toast-container';
        document.body.appendChild(div);
        return div;
    })();

    const displayToast = (message, type = "success") => {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    };

    if (form) {
        const nome = form.querySelector('#nome');
        const email = form.querySelector('#email');
        const cpf = form.querySelector('#cpf');
        const telefone = form.querySelector('#telefone');
        const dataNascimento = form.querySelector('#data_nascimento');
        const endereco = form.querySelector('#endereco');
        const cep = form.querySelector('#cep');
        const cidade = form.querySelector('#cidade');
        const estado = form.querySelector('#estado');

        const setError = (field, message) => {
            formErrors.push(field);
            const container = field.parentElement;
            container.classList.add("error");
            let msg = container.querySelector(".error-message");
            if (!msg) {
                msg = document.createElement("small");
                msg.classList.add("error-message");
                container.appendChild(msg);
            }
            msg.innerText = message;
        };

        const cleanError = (field) => {
            const index = formErrors.indexOf(field);
            if (index !== -1) formErrors.splice(index, 1);
            const container = field.parentElement;
            container.classList.remove("error");
            const msg = container.querySelector(".error-message");
            if (msg) msg.innerText = "";
        };

        const notEmpty = (field, name) => {
            if (field.value.trim() === "") setError(field, `Por favor, preencha ${name}`);
        };

        const validateEmail = (field) => {
            const pattern = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;
            if (!pattern.test(field.value.trim())) setError(field, "E-mail inválido");
        };

        const minimumAge = (field, name) => {
            const date = new Date(field.value);
            const today = new Date();
            let age = today.getFullYear() - date.getFullYear();
            if (
                today.getMonth() < date.getMonth() ||
                (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
            )
                age--;
            if (age < 18) setError(field, `${name} deve ser maior de 18 anos`);
        };

        const validateCPF = (field) => {
            let v = field.value.replace(/\D/g, "");
            if (v.length !== 11 || /^(\d)\1+$/.test(v)) setError(field, "CPF inválido");
        };

        const validateCEP = async (cepField, cidadeField, estadoField) => {
            const cleaned = cepField.value.replace(/\D/g, "");
            try {
                if (!/^\d{8}$/.test(cleaned)) throw "inv";
                const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
                const data = await res.json();
                if (data.erro) throw "inv";
                cidadeField.value = data.localidade;
                estadoField.value = data.uf;
            } catch (e) {
                setError(cepField, "CEP inválido");
                cidadeField.value = "";
                estadoField.value = "";
            }
        };

        // Máscaras
        telefone?.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
            v = v.replace(/(\d{5})(\d{4})$/, "$1-$2");
            e.target.value = v;
        });

        cpf?.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = v;
        });

        cep?.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 8) v = v.slice(0, 8);
            v = v.replace(/(\d{5})(\d)/, "$1-$2");
            e.target.value = v;
        });

        // Eventos de validação
        const validations = [
            { field: nome, callback: () => notEmpty(nome, "Nome") },
            { field: email, callback: () => notEmpty(email, "Email") },
            { field: email, callback: () => validateEmail(email) },
            { field: cpf, callback: () => notEmpty(cpf, "CPF") },
            { field: cpf, callback: () => validateCPF(cpf) },
            { field: telefone, callback: () => notEmpty(telefone, "Telefone") },
            { field: dataNascimento, callback: () => notEmpty(dataNascimento, "Data de Nascimento") },
            { field: dataNascimento, callback: () => minimumAge(dataNascimento, "Data de Nascimento") },
            { field: endereco, callback: () => notEmpty(endereco, "Endereço") },
            { field: cep, callback: () => notEmpty(cep, "CEP") },
            { field: cep, callback: async () => await validateCEP(cep, cidade, estado) },
        ];

        validations.forEach((v) => {
            v.field.addEventListener("blur", v.callback);
            v.field.addEventListener("input", () => cleanError(v.field));
        });

        // Envio do formulário
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            formErrors.length = 0;
            for (const v of validations) await v.callback();
            if (formErrors.length > 0) {
                displayToast("Corrija os erros antes de enviar", "error");
            } else {
                displayToast("Cadastro enviado com sucesso!", "success");
                const formData = {
                    nome: nome.value,
                    email: email.value,
                    cpf: cpf.value,
                    telefone: telefone.value,
                    dataNascimento: dataNascimento.value,
                    endereco: endereco.value,
                    cep: cep.value,
                    cidade: cidade.value,
                    estado: estado.value,
                };
                localStorage.setItem("cadastro", JSON.stringify(formData));
                form.reset();
            }
        });
    }
});
