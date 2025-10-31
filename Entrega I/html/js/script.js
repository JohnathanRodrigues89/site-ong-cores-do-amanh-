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
    // FORMULÁRIO CADASTRO (cadastro.html)
    // -------------------------------
    const form = document.getElementById('form-cadastro');
    if (form) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);

        const displayToast = (message, type = "success") => {
            const toast = document.createElement('div');
            toast.className = `toast toast--${type}`;
            toast.textContent = message;
            toastContainer.appendChild(toast);
            setTimeout(() => toast.remove(), 4000);
        };

        const nome = form.querySelector('#nome');
        const email = form.querySelector('#email');
        const cpf = form.querySelector('#cpf');
        const telefone = form.querySelector('#telefone');
        const cep = form.querySelector('#cep');
        const cidade = form.querySelector('#cidade');
        const estado = form.querySelector('#estado');

        const notEmpty = (field, msg) => {
            if (field.value.trim() === '') {
                field.setAttribute('aria-invalid', 'true');
                displayToast(msg, 'error');
                return false;
            }
            field.setAttribute('aria-invalid', 'false');
            return true;
        };

        const validateEmail = field => /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i.test(field.value);

        const validateCPF = field => {
            let v = field.value.replace(/\D/g, '');
            return v.length === 11 && !/^(\d)\1+$/.test(v);
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!notEmpty(nome, 'Nome é obrigatório')) return;
            if (!notEmpty(email, 'E-mail é obrigatório') || !validateEmail(email)) return displayToast('E-mail inválido', 'error');
            if (!notEmpty(cpf, 'CPF é obrigatório') || !validateCPF(cpf)) return displayToast('CPF inválido', 'error');
            if (!notEmpty(telefone, 'Telefone é obrigatório')) return;
            if (!notEmpty(cep, 'CEP é obrigatório')) return;

            displayToast('Cadastro enviado com sucesso!');
            const dados = {
                nome: nome.value,
                email: email.value,
                cpf: cpf.value,
                telefone: telefone.value,
                cep: cep.value,
                cidade: cidade.value,
                estado: estado.value
            };
            localStorage.setItem('cadastro', JSON.stringify(dados));
            form.reset();
        });
    }
});
