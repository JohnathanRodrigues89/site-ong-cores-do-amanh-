// ===============================
// SITE ONG CORES DO AMANHÃ
// Acessibilidade | Validação | Interatividade
// ===============================

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
        hamburger.setAttribute('role', 'button');
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
    const contrastButton = document.getElementById('btn-contraste') || (() => {
        const button = document.createElement('button');
        button.id = 'btn-contraste';
        button.textContent = 'Alto Contraste';
        button.className = 'btn-contraste';
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-label', 'Ativar ou desativar modo de alto contraste');
        document.body.appendChild(button);
        return button;
    })();

    const toggleContrast = () => {
        const isActive = document.body.classList.toggle('alto-contraste');
        contrastButton.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    };

    contrastButton.addEventListener('click', toggleContrast);
    contrastButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleContrast();
        }
    });

    // -------------------------------
    // SISTEMA DE PROJETOS DINÂMICOS
    // -------------------------------
    const projetosContainer = document.querySelector('.projetos-grid');
    if (projetosContainer && !projetosContainer.querySelector('.card')) {
        const projetos = [
            { title: "Oficinas de Arte", description: "Atividades artísticas para crianças e jovens.", img: "../assets/img/img03.jpg" },
            { title: "Educação e Inclusão", description: "Projetos educativos e sociais.", img: "../assets/img/img04.jpg" },
            { title: "Voluntariado", description: "Participação em ações comunitárias.", img: "../assets/img/img05.png" }
        ];

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
    // FORMULÁRIO CADASTRO COM VALIDAÇÃO
    // -------------------------------
    const form = document.getElementById('form-cadastro');
    const toastContainer = document.getElementById('toast-container') || (() => {
        const div = document.createElement('div');
        div.id = 'toast-container';
        document.body.appendChild(div);
        return div;
    })();

    const displayToast = (message, type = "success") => {
        toastContainer.innerHTML = ''; // Evita sobreposição
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
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

        const formErrors = [];

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

        const validateCPF = (field) => {
            let cpfValue = field.value.replace(/\D/g, "");
            if (cpfValue.length !== 11 || /^(\d)\1+$/.test(cpfValue)) return setError(field, "CPF inválido");

            let soma = 0, resto;
            for (let i = 1; i <= 9; i++) soma += parseInt(cpfValue.substring(i - 1, i)) * (11 - i);
            resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) resto = 0;
            if (resto !== parseInt(cpfValue.substring(9, 10))) return setError(field, "CPF inválido");

            soma = 0;
            for (let i = 1; i <= 10; i++) soma += parseInt(cpfValue.substring(i - 1, i)) * (12 - i);
            resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) resto = 0;
            if (resto !== parseInt(cpfValue.substring(10, 11))) setError(field, "CPF inválido");
        };

        const validateCEP = async (cepField, cidadeField, estadoField) => {
            const cleaned = cepField.value.replace(/\D/g, "");
            if (!/^\d{8}$/.test(cleaned)) return setError(cepField, "CEP inválido");
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
                const data = await res.json();
                if (data.erro) throw "inválido";
                cidadeField.value = data.localidade;
                estadoField.value = data.uf;
            } catch {
                setError(cepField, "CEP inválido");
                cidadeField.value = "";
                estadoField.value = "";
            }
        };

        // Máscaras
        telefone?.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            v = v.slice(0, 11);
            v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
            v = v.replace(/(\d{5})(\d{4})$/, "$1-$2");
            e.target.value = v;
        });

        cpf?.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            v = v.slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = v;
        });

        cep?.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            v = v.slice(0, 8);
            v = v.replace(/(\d{5})(\d)/, "$1-$2");
            e.target.value = v;
        });

        // Envio do formulário
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            form.querySelectorAll('.error-message').forEach(msg => msg.innerText = '');
            formErrors.length = 0;

            await notEmpty(nome, "Nome");
            await notEmpty(email, "Email");
            await validateEmail(email);
            await notEmpty(cpf, "CPF");
            await validateCPF(cpf);
            await notEmpty(telefone, "Telefone");
            await notEmpty(dataNascimento, "Data de Nascimento");
            await notEmpty(endereco, "Endereço");
            await notEmpty(cep, "CEP");
            await validateCEP(cep, cidade, estado);

            if (formErrors.length > 0) {
                displayToast("Corrija os erros antes de enviar", "error");
                return;
            }

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
            nome.focus();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});