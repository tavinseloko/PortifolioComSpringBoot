const DEFAULT_TECHS = [
    { id: 1, name: "Java", category: "Backend", level: "Intermediário", description: "Programação Orientada a Objetos, herança, polimorfismo, coleções e arquitetura MVC." },
    { id: 2, name: "Spring Boot", category: "Backend", level: "Intermediário", description: "Criação de APIs RESTful, injeção de dependências e mapeamento objeto-relacional." },
    { id: 3, name: "PHP", category: "Backend", level: "Básico", description: "Desenvolvimento de páginas dinâmicas, processamento de formulários e requisições HTTP." },
    { id: 4, name: "Python", category: "Backend", level: "Intermediário", description: "Lógica estruturada, automação de tarefas e manipulação básica de conjuntos de dados." },
    { id: 5, name: "C++", category: "Backend", level: "Básico", description: "Conceitos fundamentais de lógica de programação, sintaxe tipada e controle de fluxo." },
    { id: 6, name: "HTML5 & CSS3", category: "Frontend", level: "Intermediário", description: "Semântica web, layouts responsivos com Flexbox/CSS Grid e temas dinâmicos (Dark Mode)." },
    { id: 7, name: "JavaScript", category: "Frontend", level: "Intermediário", description: "Manipulação de DOM, tratamento de eventos, funções assíncronas e integração dinâmica." },
    { id: 8, name: "MySQL", category: "Database", level: "Intermediário", description: "Modelagem de dados relacionais, criação de tabelas, chaves estrangeiras e junções SQL." },
    { id: 9, name: "PostgreSQL", category: "Database", level: "Intermediário", description: "Estruturação de bancos relacionais robustos, constraints e consultas estruturadas." },
    { id: 10, name: "SQLite", category: "Database", level: "Básico", description: "Persistência leve de registros em arquivo local para testes e pequenos utilitários." },
    { id: 11, name: "Apache NetBeans", category: "IDE", level: "Avançado", description: "Ambiente de desenvolvimento para projetos em Java, configuração e depuração." },
    { id: 12, name: "Git & GitHub", category: "Outros", level: "Intermediário", description: "Controle de versão, ramificações (branches), histórico de commits e repositórios remotos." }
];

const DEFAULT_PROJECTS = [
    {
        title: "Portfólio Web Pessoal",
        description: "Aplicação responsiva com CRUD de competências, filtros dinâmicos e persistência local.",
        techStack: "HTML5, CSS3, JavaScript (DOM / Storage)",
        repoUrl: "https://github.com"
    },
    {
        title: "Modelagem Relacional de Banco",
        description: "Esquema completo com tabelas, relacionamentos e consultas estruturadas para gestão.",
        techStack: "MySQL / PostgreSQL, SQL",
        repoUrl: "https://github.com"
    },
    {
        title: "Rotinas e Automação",
        description: "Scripts em linha de comando desenvolvidos para processamento de arquivos e dados.",
        techStack: "Python, SQLite",
        repoUrl: "https://github.com"
    }
];

function getStoredTechs() {
    const data = localStorage.getItem('portfolio_techs');
    if (!data) {
        localStorage.setItem('portfolio_techs', JSON.stringify(DEFAULT_TECHS));
        return DEFAULT_TECHS;
    }
    return JSON.parse(data);
}

function saveStoredTechs(techs) {
    localStorage.setItem('portfolio_techs', JSON.stringify(techs));
}

let activeFilter = 'todas';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderTechnologies();
    renderProjects();
    bindFilters();
    bindForms();
});

function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';

    root.setAttribute('data-theme', savedTheme);
    toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    toggleBtn.addEventListener('click', () => {
        const isDark = root.getAttribute('data-theme') === 'dark';
        const next = isDark ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('portfolio_theme', next);
        toggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
}

function bindFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeFilter = e.target.getAttribute('data-category');
            renderTechnologies();
        });
    });
}

function renderTechnologies() {
    const grid = document.getElementById('tech-grid');
    const techs = getStoredTechs();

    const filtered = activeFilter === 'todas' 
        ? techs 
        : techs.filter(t => t.category.toLowerCase() === activeFilter.toLowerCase());

    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color: var(--muted)">Nenhuma tecnologia cadastrada nesta categoria.</p>';
        return;
    }

    filtered.forEach(t => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div>
                <div class="card-top">
                    <h3>${t.name}</h3>
                    <span class="badge">${t.category}</span>
                </div>
                <div class="level-indicator">Nível: ${t.level}</div>
                <p class="item-desc">${t.description || 'Sem descrição informada.'}</p>
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary btn-sm" onclick="editTech(${t.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTech(${t.id})">Excluir</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderProjects() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = '';

    DEFAULT_PROJECTS.forEach(p => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div>
                <div class="card-top">
                    <h3>${p.title}</h3>
                </div>
                <p class="item-desc">${p.description}</p>
                <div class="level-indicator">Stack: ${p.techStack}</div>
            </div>
            <div class="card-actions">
                <a href="${p.repoUrl}" target="_blank" class="btn btn-secondary btn-sm" style="text-decoration:none; display:inline-block;">Ver no GitHub</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

function bindForms() {
    const techForm = document.getElementById('tech-form');
    const cancelBtn = document.getElementById('cancel-edit');

    techForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const idField = document.getElementById('tech-id').value;
        const techs = getStoredTechs();

        const name = document.getElementById('tech-name').value.trim();
        const category = document.getElementById('tech-category').value;
        const level = document.getElementById('tech-level').value;
        const description = document.getElementById('tech-desc').value.trim();

        if (idField) {
            const id = parseInt(idField, 10);
            const index = techs.findIndex(t => t.id === id);
            if (index !== -1) {
                techs[index] = { id, name, category, level, description };
            }
        } else {
            const newId = techs.length > 0 ? Math.max(...techs.map(t => t.id)) + 1 : 1;
            techs.push({ id: newId, name, category, level, description });
        }

        saveStoredTechs(techs);
        techForm.reset();
        document.getElementById('tech-id').value = '';
        cancelBtn.style.display = 'none';
        renderTechnologies();
    });

    cancelBtn.addEventListener('click', () => {
        techForm.reset();
        document.getElementById('tech-id').value = '';
        cancelBtn.style.display = 'none';
    });

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.getElementById('contact-status');

        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-msg').value.trim();

        const storedMessages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
        storedMessages.push({ name, email, message, date: new Date().toISOString() });
        localStorage.setItem('portfolio_messages', JSON.stringify(storedMessages));

        status.textContent = 'Mensagem registrada localmente com sucesso!';
        status.style.color = 'var(--success)';
        contactForm.reset();

        setTimeout(() => {
            status.textContent = '';
        }, 4000);
    });
}

window.editTech = (id) => {
    const techs = getStoredTechs();
    const item = techs.find(t => t.id === id);
    if (!item) return;

    document.getElementById('tech-id').value = item.id;
    document.getElementById('tech-name').value = item.name;
    document.getElementById('tech-category').value = item.category;
    document.getElementById('tech-level').value = item.level;
    document.getElementById('tech-desc').value = item.description || '';
    
    document.getElementById('cancel-edit').style.display = 'inline-block';
    window.location.hash = '#admin';
};

window.deleteTech = (id) => {
    if (confirm('Deseja realmente remover esta tecnologia do seu portfólio?')) {
        let techs = getStoredTechs();
        techs = techs.filter(t => t.id !== id);
        saveStoredTechs(techs);
        renderTechnologies();
    }
};