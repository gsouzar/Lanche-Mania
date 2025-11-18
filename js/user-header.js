// js/user-header.js - SCRIPT ÚNICO PARA TODAS AS PÁGINAS

document.addEventListener('DOMContentLoaded', function() {
    const userInfo = document.getElementById('userInfo');
    const mobileUserInfo = document.getElementById('mobileUserInfo');
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isAdmin = localStorage.getItem('isAdmin');

    console.log('=== USER HEADER - VERIFICANDO ===');
    console.log('Usuário:', usuarioLogado);
    console.log('Logado:', isLoggedIn);
    console.log('Admin:', isAdmin);

    // Função para fazer logout
    function fazerLogout() {
        console.log('Fazendo logout...');
        localStorage.clear();
        window.location.href = '../pages/login.html';
    }

    // FUNÇÃO PARA CONFIGURAR DROPDOWN
    function setupDropdown() {
        const userLoggedBtn = document.getElementById('userLoggedBtn');
        const userDropdownContent = document.getElementById('userDropdownContent');
        const dropdownOverlay = document.getElementById('dropdownOverlay');
        
        if (userLoggedBtn && userDropdownContent) {
            // Abrir dropdown ao clicar
            userLoggedBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdownContent.classList.toggle('active');
                if (dropdownOverlay) {
                    dropdownOverlay.classList.toggle('active');
                }
            });
            
            // Fechar dropdown ao clicar no overlay
            if (dropdownOverlay) {
                dropdownOverlay.addEventListener('click', function() {
                    userDropdownContent.classList.remove('active');
                    dropdownOverlay.classList.remove('active');
                });
            }
            
            // Fechar dropdown ao clicar em um item
            const dropdownItems = userDropdownContent.querySelectorAll('.user-dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', function() {
                    userDropdownContent.classList.remove('active');
                    if (dropdownOverlay) {
                        dropdownOverlay.classList.remove('active');
                    }
                });
            });
            
            // Fechar dropdown ao clicar fora
            document.addEventListener('click', function(e) {
                if (userLoggedBtn && !userLoggedBtn.contains(e.target) && 
                    userDropdownContent && !userDropdownContent.contains(e.target)) {
                    userDropdownContent.classList.remove('active');
                    if (dropdownOverlay) {
                        dropdownOverlay.classList.remove('active');
                    }
                }
            });
            
            // Prevenir fechamento ao clicar dentro do dropdown
            userDropdownContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    // HEADER NORMAL - USUÁRIO LOGADO
    if (userInfo && isLoggedIn === 'true' && usuarioLogado) {
        const userType = isAdmin === 'true' ? ' (Admin)' : '';
        const userIcon = isAdmin === 'true' ? 'fa-user-shield' : 'fa-user-circle';
        
        userInfo.innerHTML = `
            <div class="user-dropdown" id="userDropdown">
                <button class="user-logged" id="userLoggedBtn">
                    <i class="fa-solid ${userIcon}"></i>
                    <span>${usuarioLogado}${userType}</span>
                    <i class="fa-solid fa-chevron-down" style="font-size: 10px; margin-left: 5px;"></i>
                </button>
                <div class="user-dropdown-content" id="userDropdownContent">
                    ${isAdmin === 'true' ? `
                    <a class="user-dropdown-item" href="../pages/admin-painel.html">
                        <i class="fa-solid fa-chart-line"></i>
                        <span>Painel Admin</span>
                    </a>
                    ` : ''}
                    <div class="user-dropdown-item logout-btn" onclick="fazerLogout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        <span>Sair</span>
                    </div>
                </div>
            </div>
        `;
        
        setupDropdown();
    } 
    // HEADER NORMAL - NÃO LOGADO
    else if (userInfo) {
        userInfo.innerHTML = `
            <button class="btn-default" onclick="window.location.href='../pages/login.html'">
                <i class="fa-solid fa-user"></i>
                Entrar
            </button>
        `;
    }

    // MOBILE MENU - USUÁRIO LOGADO
    if (mobileUserInfo && isLoggedIn === 'true' && usuarioLogado) {
        const userType = isAdmin === 'true' ? ' (Admin)' : '';
        const userIcon = isAdmin === 'true' ? 'fa-user-shield' : 'fa-user-circle';
        
        mobileUserInfo.innerHTML = `
            <div style="margin-bottom: 15px;">
                <div class="user-logged" style="margin-bottom: 10px; background: rgba(255,255,255,0.2);">
                    <i class="fa-solid ${userIcon}"></i>
                    <span>${usuarioLogado}${userType}</span>
                </div>
                <button class="btn-default" onclick="fazerLogout()" style="width: 100%;">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    Sair
                </button>
            </div>
        `;
    } 
    // MOBILE MENU - NÃO LOGADO
    else if (mobileUserInfo) {
        mobileUserInfo.innerHTML = `
            <button class="btn-default" onclick="window.location.href='../pages/login.html'" style="width: 100%;">
                <i class="fa-solid fa-user"></i>
                Entrar
            </button>
        `;
    }

    // MOBILE MENU TOGGLE (funcionalidade básica)
    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // Tornar função global para onclick
    window.fazerLogout = fazerLogout;
});