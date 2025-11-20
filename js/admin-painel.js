// =============================
//  ADMIN PAINEL - ARQUIVO FINAL
// =============================

// Controle de instâncias dos gráficos
let categoryChartInstance = null;
let revenueChartInstance = null;

document.addEventListener('DOMContentLoaded', function () {
    console.log('=== INICIANDO PAINEL ADMIN ===');

    // Elementos do DOM
    const userInfo = document.getElementById('userInfo');
    const mobileUserInfo = document.getElementById('mobileUserInfo');

    // Dados do localStorage
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isAdmin = localStorage.getItem('isAdmin');

    console.log('Dados do localStorage:', {
        usuarioLogado,
        isLoggedIn,
        isAdmin
    });

    // VERIFICAÇÃO DE ACESSO
    if (isAdmin !== 'true' || isLoggedIn !== 'true' || !usuarioLogado) {
        alert('Acesso restrito! Faça login como administrador.');
        window.location.href = '../pages/login.html';
        return;
    }

    console.log('ACESSO PERMITIDO: Usuário admin autenticado');

    // FUNÇÃO DE LOGOUT
    window.fazerLogout = function () {
        localStorage.clear();
        window.location.href = '../pages/login.html';
    };

    // CONFIGURAR USUÁRIO NO HEADER (DESKTOP)
    if (userInfo) {
        userInfo.innerHTML = `
            <div class="user-dropdown">
                <button class="user-logged">
                    <i class="fa-solid fa-user-shield"></i>
                    <span>${usuarioLogado} (Admin)</span>
                    <i class="fa-solid fa-chevron-down" style="font-size: 10px; margin-left: 5px;"></i>
                </button>
                <div class="user-dropdown-content">
                    <a class="user-dropdown-item" href="../pages/admin-painel.html">
                        <i class="fa-solid fa-chart-line"></i>
                        <span>Painel Admin</span>
                    </a>
                    <a class="user-dropdown-item" href="#">
                        <i class="fa-solid fa-gear"></i>
                        <span>Configurações</span>
                    </a>
                    <a class="user-dropdown-item logout-btn" href="#" onclick="fazerLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        <span>Sair</span>
                    </a>
                </div>
            </div>
        `;
    }

    // CONFIGURAR USUÁRIO NO MOBILE
    if (mobileUserInfo) {
        mobileUserInfo.innerHTML = `
            <div style="margin-bottom: 15px;">
                <div class="user-logged" style="margin-bottom: 10px; background: rgba(255,255,255,0.2);">
                    <i class="fa-solid fa-user-shield"></i>
                    <span>${usuarioLogado} (Admin)</span>
                </div>
                <button class="btn-default" onclick="fazerLogout()" style="width: 100%;">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    Sair
                </button>
            </div>
        `;
    }

    // MOBILE MENU
    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // INICIALIZAR GRÁFICOS
    initCharts();

    // INICIAR DADOS EM TEMPO REAL
    updateRealTimeData();
});

// =============================
//  GRÁFICOS COM PREVENÇÃO DE ERROS
// =============================

function initCharts() {

    // ===== GRÁFICO DE CATEGORIAS =====
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {

        // destruir se existir
        if (categoryChartInstance) {
            categoryChartInstance.destroy();
        }

        categoryChartInstance = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Lanches', 'Pizzas', 'Bebidas', 'Sobremesas', 'Porções'],
                datasets: [{
                    data: [35, 25, 20, 12, 8],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // ===== GRÁFICO DE FATURAMENTO =====
    const revenueCtx = document.getElementById('revenueChart');

    if (revenueCtx) {

        if (revenueChartInstance) {
            revenueChartInstance.destroy();
        }

        revenueChartInstance = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Faturamento (R$)',
                    data: [12000, 19000, 15000, 18000, 22000, 25000, 28000, 26000, 30000, 32000, 35000, 40000],
                    borderColor: '#E9A209',
                    backgroundColor: 'rgba(233,162,9,0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => 'R$ ' + value.toLocaleString('pt-BR')
                        }
                    }
                }
            }
        });
    }
}

// =============================
// SIMULAÇÃO DE DADOS EM TEMPO REAL
// =============================
function updateRealTimeData() {
    setInterval(() => {
        const ordersElement = document.querySelector('.stat-card:nth-child(2) h3');
        if (ordersElement) {
            const currentOrders = parseInt(ordersElement.textContent);
            ordersElement.textContent = currentOrders + Math.floor(Math.random() * 3);
        }
    }, 10000);
}

// =============================
// FUNÇÕES DE AÇÕES / MODAIS
// =============================
function showActionModal(title, description) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 400px;
            width: 90%;
            text-align: center;
        ">
            <h3>${title}</h3>
            <p>${description}</p>
            <div style="
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #E9A209;
                margin: 20px 0;
            ">
                <i class="fa-solid fa-tools" style="font-size: 2rem; color: #E9A209;"></i>
                <p style="font-size: .9rem; color: #666;">
                    Essa funcionalidade será implementada em breve.
                </p>
            </div>
            <button onclick="this.closest('div[style*=fixed]').remove()" 
                style="
                    background: #E9A209;
                    color: #fff;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 6px;
                    cursor: pointer;
                ">Entendi</button>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Funções das ações
function openProductModal() { showActionModal('Novo Produto', 'Adicione um novo item ao cardápio'); }
function openPromotionModal() { showActionModal('Nova Promoção', 'Crie uma promoção especial'); }
function viewReports() { showActionModal('Relatórios', 'Acesse relatórios detalhados'); }
function manageStock() { showActionModal('Gestão de Estoque', 'Gerencie seu estoque'); }
function manageOrders() { showActionModal('Pedidos', 'Controle todos os pedidos'); }
function manageUsers() { showActionModal('Clientes', 'Administre os clientes'); }
function openFinanceModal() { showActionModal('Financeiro', 'Controle financeiro'); }
function systemSettings() { showActionModal('Configurações', 'Configure o sistema'); }
