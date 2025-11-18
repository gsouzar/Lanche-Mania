// Alternar entre login e cadastro
function showLoginForm() {
    document.getElementById('login-form').classList.add('active');
    document.getElementById('register-form').classList.remove('active');
}

function showRegisterForm() {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.add('active');
}

// Mostrar/ocultar senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = document.querySelector(`[onclick="togglePassword('${inputId}')"]`);
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        display: grid;
        place-items: center;         
        width: fit-content;            
        max-width: 300px;           
        height: 60px;                  
        padding: 10px 16px;
        border-radius: 8px;
        color: black;
        font-weight: 500;
        z-index: 10000;
        font-size: 14px;
        background-color: ${type === 'success' ? '#ffcb45' : type === 'error' ? '#dc3545' : '#ffcb45'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        opacity: 0;
        transform: translateY(-15px);
        transition: all 0.25s ease;
        white-space: nowrap;           
        overflow: hidden;   
        box-sizing: border-box;   
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-15px)';
        setTimeout(() => notification.remove(), 250);
    }, 2500);
}

// Função para verificar se é email de admin
function checkAdminEmail(email) {
    const adminEmails = [
        'admin@lanchemania.com',
        'gerente@lanchemania.com',
        'adm@lanchemania.com'
    ];
    return adminEmails.includes(email);
}

// Função para verificar credenciais de admin
function checkAdminCredentials(email, password) {
    const adminCredentials = [
        { email: 'admin@lanchemania.com', password: 'admin123' },
        { email: 'gerente@lanchemania.com', password: 'gerente123' },
        { email: 'adm@lanchemania.com', password: 'adm123' }
    ];
    return adminCredentials.some(admin =>
        admin.email === email && admin.password === password
    );
}

function fazerLogout() {
    console.log('Fazendo logout...');
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    window.location.href = 'login.html'; // ← CORRIGIDO
}

document.addEventListener('DOMContentLoaded', function () {
    // Verificar se estamos na página de login
    const isLoginPage = document.getElementById('login-form') !== null;

    // Só executar o código específico do login se estivermos na página de login
    if (isLoginPage) {
        // Máscara telefone
        const phoneInput = document.getElementById('register-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    if (value.length <= 2) value = value.replace(/^(\d{0,2})/, '($1');
                    else if (value.length <= 7) value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                    else value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
                e.target.value = value;
            });
        }

        // Remover espaços de senha
        const passwordInputs = ['login-password', 'register-password', 'register-confirm-password'];
        passwordInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', function (e) {
                    const pos = e.target.selectionStart;
                    this.value = this.value.replace(/\s/g, '');
                    e.target.setSelectionRange(pos, pos);
                });
                input.addEventListener('paste', function (e) {
                    e.preventDefault();
                    const text = e.clipboardData.getData('text').replace(/\s/g, '');
                    document.execCommand('insertText', false, text);
                });
            }
        });

        // Emails minúsculos
        const emailInputs = ['login-email', 'register-email'];
        emailInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.addEventListener('input', () => input.value = input.value.toLowerCase());
        });

        // Nome apenas letras
        const nameInput = document.getElementById('register-name');
        if (nameInput) {
            nameInput.addEventListener('input', function () {
                this.value = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
            });
        }

        // LOGIN - apenas se o formulário existir
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const email = document.getElementById('login-email').value.trim();
                const password = document.getElementById('login-password').value.trim();

                if (!email || !password) return showNotification('Preencha todos os campos.', 'error');
                if (!email.includes('@') || !email.includes('.')) return showNotification('E-mail inválido.', 'error');
                if (password.length < 6) return showNotification('A senha deve ter 6 caracteres.', 'error');

                const isAdminEmail = checkAdminEmail(email);
                const isAdmin = checkAdminCredentials(email, password);

                // Bloquear total se for admin e senha incorreta
                if (isAdminEmail && !isAdmin) {
                    showNotification('Acesso bloqueado. Contate o suporte.', 'error');
                    return;
                }

                if (isAdmin) {
                    const usuario = email.split('@')[0];
                    showNotification('Bem-vindo, ' + usuario + '! (Admin)', 'success');
                    localStorage.setItem('usuarioLogado', usuario);
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('isAdmin', 'true');
                    setTimeout(() => window.location.href = '../pages/admin-painel.html', 1500);
                } else {
                    const usuario = email.split('@')[0];
                    showNotification('Bem-vindo, ' + usuario + '!', 'success');
                    localStorage.setItem('usuarioLogado', usuario);
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('isAdmin', 'false');
                    setTimeout(() => window.location.href = 'index.html', 1500); // ← CORRIGIDO
                }
            });
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const name = document.getElementById('register-name').value.trim();
                const phone = document.getElementById('register-phone').value.trim();
                const email = document.getElementById('register-email').value.trim();
                const password = document.getElementById('register-password').value.trim();
                const confirmPassword = document.getElementById('register-confirm-password').value.trim();
                const acceptTerms = document.getElementById('accept-terms').checked;

                if (!name || !phone || !email || !password || !confirmPassword)
                    return showNotification('Preencha todos os campos.', 'error');
                if (name.length < 2) return showNotification('Nome inválido.', 'error');
                if (phone.replace(/\D/g, '').length < 10) return showNotification('Telefone inválido.', 'error');
                if (!email.includes('@') || !email.includes('.')) return showNotification('E-mail inválido.', 'error');
                if (password !== confirmPassword) return showNotification('Senhas não coincidem.', 'error');
                if (password.length < 6) return showNotification('Senha deve ter 6 caracteres.', 'error');
                if (!acceptTerms) return showNotification('Aceite os termos de uso.', 'error');

                const usuario = email.split('@')[0];
                showNotification('Conta criada com sucesso! Bem-vindo, ' + usuario + '!', 'success');

                localStorage.setItem('usuarioLogado', usuario);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', name);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('isAdmin', 'false');

                setTimeout(() => {
                    showLoginForm();
                    document.getElementById('registerForm').reset();
                }, 1500);
            });
        }

        // Menu mobile - apenas se os elementos existirem
        const mobileBtn = document.getElementById('car');
        const mobileMenu = document.getElementById('mobile_btn');
        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('active'));
        }
    }

    // Código para mostrar usuário logado - funciona em todas as páginas
    const userInfo = document.getElementById('userInfo');
    const mobileUserInfo = document.getElementById('mobileUserInfo');
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isAdmin = localStorage.getItem('isAdmin');

    console.log('Verificando login:', { usuarioLogado, isLoggedIn, isAdmin });

    // Header normal - USUÁRIO LOGADO
    if (userInfo && isLoggedIn === 'true' && usuarioLogado) {
        const userType = isAdmin === 'true' ? ' (Admin)' : '';
        userInfo.innerHTML = `
            <div class="user-dropdown" id="userDropdown">
                <button class="user-logged" id="userLoggedBtn">
                    <i class="fa-solid ${isAdmin === 'true' ? 'fa-user-shield' : 'fa-user-circle'}"></i>
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

        // Configurar dropdown
        setupDropdown();
    }
    // Header normal - NÃO LOGADO
    else if (userInfo) {
        userInfo.innerHTML = `
            <button class="btn-default" onclick="window.location.href='../pages/login.html'">
                <i class="fa-solid fa-user"></i>
            </button>
        `;
    }

    // Mobile menu - USUÁRIO LOGADO
    if (mobileUserInfo && isLoggedIn === 'true' && usuarioLogado) {
        const userType = isAdmin === 'true' ? ' (Admin)' : '';
        mobileUserInfo.innerHTML = `
            <div style="margin-bottom: 15px;">
                <div class="user-logged" style="margin-bottom: 10px; background: rgba(255,255,255,0.2);">
                    <i class="fa-solid ${isAdmin === 'true' ? 'fa-user-shield' : 'fa-user-circle'}"></i>
                    <span>${usuarioLogado}${userType}</span>
                </div>
                <button class="btn-default" onclick="fazerLogout()" style="width: 100%;">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    Sair
                </button>
            </div>
        `;
    }
    // Mobile menu - NÃO LOGADO
    else if (mobileUserInfo) {
        mobileUserInfo.innerHTML = `
            <button class="btn-default" onclick="window.location.href='../pages/login.html'" style="width: 100%;">
                <i class="fa-solid fa-user"></i>
            </button>
        `;
    }

    // FUNÇÃO PARA CONFIGURAR DROPDOWN
    function setupDropdown() {
        const userLoggedBtn = document.getElementById('userLoggedBtn');
        const userDropdownContent = document.getElementById('userDropdownContent');
        const dropdownOverlay = document.getElementById('dropdownOverlay');

        if (userLoggedBtn && userDropdownContent) {
            // Abrir dropdown ao clicar
            userLoggedBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                userDropdownContent.classList.toggle('active');
                if (dropdownOverlay) {
                    dropdownOverlay.classList.toggle('active');
                }
            });

            // Fechar dropdown ao clicar no overlay
            if (dropdownOverlay) {
                dropdownOverlay.addEventListener('click', function () {
                    userDropdownContent.classList.remove('active');
                    dropdownOverlay.classList.remove('active');
                });
            }

            // Fechar dropdown ao clicar em um item
            const dropdownItems = userDropdownContent.querySelectorAll('.user-dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', function () {
                    userDropdownContent.classList.remove('active');
                    if (dropdownOverlay) {
                        dropdownOverlay.classList.remove('active');
                    }
                });
            });

            // Fechar dropdown ao clicar fora
            document.addEventListener('click', function (e) {
                if (userLoggedBtn && !userLoggedBtn.contains(e.target) &&
                    userDropdownContent && !userDropdownContent.contains(e.target)) {
                    userDropdownContent.classList.remove('active');
                    if (dropdownOverlay) {
                        dropdownOverlay.classList.remove('active');
                    }
                }
            });

            // Prevenir fechamento ao clicar dentro do dropdown
            userDropdownContent.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }
    }

    // Tornar as funções globais para o onclick
    window.fazerLogout = fazerLogout;
    window.setupDropdown = setupDropdown;
});