class Checkout {
    constructor() {
        this.itens = JSON.parse(localStorage.getItem('carrinho')) || [];
        // VERIFICAR LOGIN AO INICIALIZAR CHECKOUT
        this.verificarLoginParaCheckout();
        this.init();
    }

    // VERIFICAR SE O USUÁRIO ESTÁ LOGADO PARA ACESSAR O CHECKOUT
    verificarLoginParaCheckout() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (!isLoggedIn || isLoggedIn !== 'true') {
            if (typeof showNotification === 'function') {
                showNotification('Faça login para acessar o checkout', 'error');
            } else {
                alert('Faça login para acessar o checkout');
            }
            
            setTimeout(() => {
                window.location.href = '../pages/login.html';
            }, 2000);
            return false;
        }
        return true;
    }
    init() {
        this.renderizarCheckout();
        this.adicionarEventListeners();
        this.atualizarContadorCarrinho();
        this.adicionarEstilosModal(); // Adicionar estilos do modal
    }

    adicionarEstilosModal() {
        // Verificar se os estilos já foram adicionados
        if (document.getElementById('checkout-modal-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'checkout-modal-styles';
        style.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }

            .modal.active {
                display: flex;
            }

            .modal-content {
                background: white;
                padding: 30px;
                border-radius: 12px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }

            .modal-content .fa-check-circle {
                font-size: 48px;
                color: #28a745;
                margin-bottom: 20px;
            }

            .modal-content h3 {
                color: #333;
                margin-bottom: 15px;
                font-size: 24px;
            }

            .modal-content p {
                color: #666;
                margin-bottom: 10px;
                line-height: 1.5;
            }

            .modal-content strong {
                color: #333;
            }

            .modal-buttons {
                display: flex;
                gap: 10px;
                margin-top: 20px;
                flex-wrap: wrap;
            }

            .modal-buttons button {
                flex: 1;
                min-width: 120px;
            }

            .empty-cart {
                text-align: center;
                padding: 40px 20px;
                color: #666;
            }

            .empty-cart .fa-cart-shopping {
                font-size: 64px;
                color: #ddd;
                margin-bottom: 20px;
            }

            .empty-cart p {
                margin-bottom: 20px;
                font-size: 18px;
            }

            @media (max-width: 768px) {
                .modal-content {
                    margin: 20px;
                    padding: 20px;
                }

                .modal-buttons {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    renderizarCheckout() {
        const checkoutItems = document.getElementById('checkout-items');

        if (this.itens.length === 0) {
            checkoutItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <p>Seu carrinho está vazio</p>
                    <a href="../pages/cardapio.html" class="btn-default">Voltar às Compras</a>
                </div>
            `;
            return;
        }

        checkoutItems.innerHTML = '';

        this.itens.forEach(item => {
            const subtotal = item.preco * item.quantidade;
            const itemElement = document.createElement('div');
            itemElement.className = 'checkout-item';
            itemElement.innerHTML = `
                <div class="item-info">
                    <h4>${item.nome}</h4>
                    <span class="item-price">R$ ${item.preco.toFixed(2)}</span>
                </div>
                <div class="item-quantity">x${item.quantidade}</div>
                <div class="item-total">R$ ${subtotal.toFixed(2)}</div>
            `;
            checkoutItems.appendChild(itemElement);
        });

        this.atualizarTotais();
    }

    atualizarTotais() {
        const subtotal = this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        const total = subtotal;

        document.getElementById('checkout-subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
        document.getElementById('checkout-total').textContent = `R$ ${total.toFixed(2)}`;
    }

    adicionarEventListeners() {
        // Métodos de pagamento
        document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.togglePaymentFields(e.target.value);
            });
        });

        // Formulário de pedido
        const deliveryForm = document.getElementById('delivery-form');
        if (deliveryForm) {
            deliveryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processarPedido();
            });
        }

        // Inicializar campos de pagamento
        const initialMethod = document.querySelector('input[name="payment-method"]:checked');
        if (initialMethod) {
            this.togglePaymentFields(initialMethod.value);
        } else {
            this.togglePaymentFields('pix');
        }
    }

    togglePaymentFields(method) {
        const cardFields = document.getElementById('card-fields');
        const cashFields = document.getElementById('cash-fields');

        // Esconder todos os campos primeiro
        if (cardFields) cardFields.style.display = 'none';
        if (cashFields) cashFields.style.display = 'none';

        // Mostrar campos específicos baseado no método
        if ((method === 'credit-card' || method === 'debit-card') && cardFields) {
            cardFields.style.display = 'block';
        } else if (method === 'cash' && cashFields) {
            cashFields.style.display = 'block';
        }
    }

    processarPedido() {
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked');

        if (!paymentMethod) {
            this.mostrarNotificacao('Por favor, selecione uma forma de pagamento.', 'error');
            return;
        }

        const method = paymentMethod.value;
        const nome = document.getElementById('customer-name').value;
        const telefone = document.getElementById('customer-phone').value;

        // Validar campos obrigatórios
        if (!nome || !telefone) {
            this.mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Validar campos do cartão se necessário
        if ((method === 'credit-card' || method === 'debit-card') &&
            !this.validarCartao()) {
            return;
        }

        // Validar campo de troco se for dinheiro
        if (method === 'cash') {
            const troco = document.getElementById('change').value;
            if (!troco || troco <= 0) {
                this.mostrarNotificacao('Por favor, informe para quanto precisa de troco.', 'error');
                return;
            }
        }

        // Simular processamento
        this.simularProcessamento(method);
    }

    validarCartao() {
        const numero = document.getElementById('card-number').value;
        const validade = document.getElementById('card-expiry').value;
        const cvv = document.getElementById('card-cvv').value;
        const nome = document.getElementById('card-name').value;

        if (!numero || !validade || !cvv || !nome) {
            this.mostrarNotificacao('Por favor, preencha todos os dados do cartão.', 'error');
            return false;
        }

        // Validação básica do cartão
        const numeroLimpo = numero.replace(/\s/g, '');
        if (numeroLimpo.length !== 16 || !/^\d+$/.test(numeroLimpo)) {
            this.mostrarNotificacao('Número do cartão inválido. Deve ter 16 dígitos.', 'error');
            return false;
        }

        if (!/^\d{2}\/\d{2}$/.test(validade)) {
            this.mostrarNotificacao('Data de validade inválida. Use o formato MM/AA.', 'error');
            return false;
        }

        if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
            this.mostrarNotificacao('CVV inválido. Deve ter 3 dígitos.', 'error');
            return false;
        }

        if (nome.trim().length < 3) {
            this.mostrarNotificacao('Nome no cartão deve ter pelo menos 3 caracteres.', 'error');
            return false;
        }

        return true;
    }

    mostrarNotificacao(mensagem, tipo = 'error') {
        // Você pode usar a função showNotification do login.js se disponível
        if (typeof showNotification === 'function') {
            showNotification(mensagem, tipo);
        } else {
            alert(mensagem); // Fallback simples
        }
    }

    simularProcessamento(paymentMethod) {
        const botao = document.getElementById('confirm-payment');
        if (!botao) return;

        const textoOriginal = botao.innerHTML;

        // Mostrar loading
        botao.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';
        botao.disabled = true;

        // Simular delay do processamento
        setTimeout(() => {
            this.finalizarPedido(paymentMethod);
            botao.innerHTML = textoOriginal;
            botao.disabled = false;
        }, 2000);
    }

    finalizarPedido(paymentMethod) {
        const total = this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        const nome = document.getElementById('customer-name').value;
        const telefone = document.getElementById('customer-phone').value;

        // Criar resumo do pedido
        const pedido = {
            id: Date.now(),
            itens: [...this.itens], // cópia dos itens
            total: total,
            cliente: {
                nome: nome,
                telefone: telefone,
                observacoes: document.getElementById('customer-notes') ? document.getElementById('customer-notes').value : ''
            },
            pagamento: paymentMethod,
            data: new Date().toLocaleString('pt-BR'),
            status: 'confirmado'
        };

        // Salvar pedido no histórico
        this.salvarPedido(pedido);

        // Mostrar confirmação
        this.mostrarConfirmacao(pedido);

        // Limpar carrinho
        this.limparCarrinho();
    }

    salvarPedido(pedido) {
        let historico = JSON.parse(localStorage.getItem('historico_pedidos')) || [];
        historico.push(pedido);
        localStorage.setItem('historico_pedidos', JSON.stringify(historico));
    }

    mostrarConfirmacao(pedido) {
        let mensagem = '';

        switch (pedido.pagamento) {
            case 'pix':
                mensagem = `
                    <h3>Pedido Confirmado!</h3>
                    <p>Seu pedido #${pedido.id} foi recebido com sucesso.</p>
                    <p><strong>Chave PIX:</strong> lanchemania@pix.com</p>
                    <p><strong>Valor:</strong> R$ ${pedido.total.toFixed(2)}</p>
                    <p>Envie o comprovante para o WhatsApp: (11) 99591-7672</p>
                `;
                break;
            case 'cash':
                const troco = document.getElementById('change').value;
                mensagem = `
                    <h3>Pedido Confirmado!</h3>
                    <p>Seu pedido #${pedido.id} foi recebido com sucesso.</p>
                    <p><strong>Pagamento:</strong> Dinheiro</p>
                    ${troco ? `<p><strong>Troco para:</strong> R$ ${parseFloat(troco).toFixed(2)}</p>` : ''}
                    <p>Prepare o pagamento para quando for retirar.</p>
                `;
                break;
            default:
                mensagem = `
                    <h3>Pedido Confirmado!</h3>
                    <p>Seu pedido #${pedido.id} foi recebido com sucesso.</p>
                    <p><strong>Pagamento via cartão:</strong> ${pedido.pagamento === 'credit-card' ? 'Crédito' : 'Débito'}</p>
                    <p><strong>Valor:</strong> R$ ${pedido.total.toFixed(2)}</p>
                `;
        }

        // Criar modal de confirmação
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <i class="fa-solid fa-check-circle"></i>
                ${mensagem}
                <div class="modal-buttons">
                    <button onclick="window.location.href='../index.html'" class="btn-default">
                        Voltar ao Início
                    </button>
                    <button onclick="window.location.href='../pages/cardapio.html'" class="btn-primary">
                        Fazer Novo Pedido
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    limparCarrinho() {
        this.itens = [];
        localStorage.setItem('carrinho', JSON.stringify([]));
        this.atualizarContadorCarrinho();
    }

    atualizarContadorCarrinho() {
        const totalItens = this.itens.reduce((total, item) => total + item.quantidade, 0);

        const carrinhoCount = document.getElementById('carrinho_count');
        const mobileCarrinhoCount = document.getElementById('mobile_carrinho_count');

        if (carrinhoCount) carrinhoCount.textContent = totalItens;
        if (mobileCarrinhoCount) mobileCarrinhoCount.textContent = totalItens;
    }
}

// Inicializar checkout quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    // Verificar se estamos na página de checkout
    if (document.getElementById('checkout-items')) {
        window.checkout = new Checkout();
    }
});
