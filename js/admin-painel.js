// admin-painel.js - VERSÃO SIMPLIFICADA
document.addEventListener('DOMContentLoaded', function() {
    // A verificação de admin agora está no HTML
    // Aqui só inicializamos os gráficos
    initCharts();
});

function initCharts() {
    // Gráfico de Vendas por Categoria
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    if (categoryCtx) {
        new Chart(categoryCtx, {
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
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Gráfico de Faturamento Mensal
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Faturamento (R$)',
                    data: [12000, 19000, 15000, 18000, 22000, 25000, 28000, 26000, 30000, 32000, 35000, 40000],
                    borderColor: '#E9A209',
                    backgroundColor: 'rgba(233, 162, 9, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }
}

// Funções das ações (mantenha as existentes)
function openProductModal() {
    alert('Modal de Novo Produto será aberto aqui!');
}

function openPromotionModal() {
    alert('Modal de Nova Promoção será aberto aqui!');
}

function viewReports() {
    alert('Abrindo relatórios detalhados...');
}

function manageStock() {
    alert('Abrindo gestão de estoque...');
}

// Atualizar dados em tempo real (simulação)
function updateRealTimeData() {
    setInterval(() => {
        const ordersElement = document.querySelector('.stat-card:nth-child(2) h3');
        if (ordersElement) {
            const currentOrders = parseInt(ordersElement.textContent);
            ordersElement.textContent = currentOrders + Math.floor(Math.random() * 3);
        }
    }, 10000);
}
// FUNÇÕES DAS AÇÕES RÁPIDAS
function openProductModal() {
    showActionModal('Novo Produto', 'Adicione um novo item ao cardápio');
}

function openPromotionModal() {
    showActionModal('Nova Promoção', 'Crie uma promoção especial');
}

function viewReports() {
    showActionModal('Relatórios', 'Acesse relatórios detalhados');
}

function manageStock() {
    showActionModal('Gestão de Estoque', 'Controle seu inventário');
}

function manageOrders() {
    showActionModal('Gestão de Pedidos', 'Gerencie todos os pedidos');
}

function manageUsers() {
    showActionModal('Gestão de Clientes', 'Administre usuários do sistema');
}

function openFinanceModal() {
    showActionModal('Financeiro', 'Controle financeiro e fluxo de caixa');
}

function systemSettings() {
    showActionModal('Configurações do Sistema', 'Configure as preferências');
}

// MODAL PARA AS AÇÕES
function showActionModal(title, description) {
    // Criar modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 0%;
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
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            max-width: 400px;
            width: 90%;
            text-align: center;
        ">
            <h3 style="color: #333; margin-bottom: 10px;">${title}</h3>
            <p style="color: #666; margin-bottom: 25px;">${description}</p>
            
            <div style="
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #E9A209;
            ">
                <i class="fa-solid fa-tools" style="font-size: 2rem; color: #E9A209; margin-bottom: 10px;"></i>
                <p style="color: #666; font-size: 0.9rem;">
                    Esta funcionalidade está em desenvolvimento e será implementada em breve!
                </p>
            </div>
            
            <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" 
                    style="
                        background: #E9A209;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: background 0.3s ease;
                    "
                    onmouseover="this.style.background='#d19108'"
                    onmouseout="this.style.background='#E9A209'">
                <i class="fa-solid fa-check"></i> Entendi
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// NOTIFICAÇÃO DE AÇÃO
function showActionNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500; 
        z-index: 100;
        max-width: 300px;
        background-color: var(--color-primary-5)
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.4s ease;
        background-color: var(--color-primary-5)
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 4000);
}
 document.addEventListener('DOMContentLoaded', function() {
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
                console.log('ACESSO NEGADO: Redirecionando para login...');
                alert('Acesso restrito! Faça login como administrador.');
                window.location.href = '../pages/login.html';
                return;
            }

            console.log('ACESSO PERMITIDO: Usuário admin autenticado');

            // FUNÇÃO DE LOGOUT
            window.fazerLogout = function() {
                console.log('Fazendo logout...');
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
                console.log('✅ Header desktop configurado');
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
                console.log('✅ Header mobile configurado');
            }

            // MOBILE MENU TOGGLE
            const mobileBtn = document.getElementById('mobile_btn');
            const mobileMenu = document.getElementById('mobile_menu');
            
            if (mobileBtn && mobileMenu) {
                mobileBtn.addEventListener('click', () => {
                    mobileMenu.classList.toggle('active');
                    console.log('Mobile menu toggled');
                });
            }

            // INICIALIZAR GRÁFICOS
            console.log('Inicializando gráficos...');
            initCharts();
        });

        // FUNÇÃO DOS GRÁFICOS
        function initCharts() {
            console.log('Criando gráficos...');
            
            // Gráfico de Vendas por Categoria
            const categoryCtx = document.getElementById('categoryChart');
            if (categoryCtx) {
                new Chart(categoryCtx, {
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
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
                console.log('✅ Gráfico de categorias criado');
            }

            // Gráfico de Faturamento Mensal
            const revenueCtx = document.getElementById('revenueChart');
            if (revenueCtx) {
                new Chart(revenueCtx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                        datasets: [{
                            label: 'Faturamento (R$)',
                            data: [12000, 19000, 15000, 18000, 22000, 25000, 28000, 26000, 30000, 32000, 35000, 40000],
                            borderColor: '#E9A209',
                            backgroundColor: 'rgba(233, 162, 9, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return 'R$ ' + value.toLocaleString('pt-BR');
                                    }
                                }
                            }
                        }
                    }
                });
                console.log('✅ Gráfico de faturamento criado');
            }
        }

        // FUNÇÕES DAS AÇÕES
        function openProductModal() {
            alert('Modal de Novo Produto será aberto aqui!');
        }

        function openPromotionModal() {
            alert('Modal de Nova Promoção será aberto aqui!');
        }

        function viewReports() {
            alert('Abrindo relatórios detalhados...');
        }

        function manageStock() {
            alert('Abrindo gestão de estoque...');
        }

        // ATUALIZAÇÃO EM TEMPO REAL
        function updateRealTimeData() {
            setInterval(() => {
                const ordersElement = document.querySelector('.stat-card:nth-child(2) h3');
                if (ordersElement) {
                    const currentOrders = parseInt(ordersElement.textContent);
                    ordersElement.textContent = currentOrders + Math.floor(Math.random() * 3);
                }
            }, 10000);
        }

        // Iniciar atualização em tempo real
        updateRealTimeData();