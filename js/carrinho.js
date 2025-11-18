// Definir a classe Carrinho no escopo global
window.Carrinho = class Carrinho {
    constructor() {
        this.itens = JSON.parse(localStorage.getItem('carrinho')) || [];
        this.taxaEntrega = 5.00;
        this.init();
    }

    init() {
        console.log('Carrinho inicializado com', this.itens.length, 'itens');
        this.atualizarContadorCarrinho();
        this.adicionarEventListeners();

        // Só renderiza se estiver na página do carrinho
        if (window.location.pathname.includes('carrinho.html')) {
            console.log('Renderizando carrinho na página do carrinho');
            this.renderizarCarrinho();
            // Forçar atualização do resumo
            setTimeout(() => {
                this.atualizarResumo();
            }, 100);
        }
    }

    adicionarEventListeners() {
        // Continuar comprando
        const continuarBtn = document.getElementById('continuar-comprando');
        if (continuarBtn) {
            continuarBtn.addEventListener('click', () => {
                window.location.href = '../pages/cardapio.html';
            });
        }

        // Finalizar pedido - COM VERIFICAÇÃO DE LOGIN
        const finalizarBtn = document.getElementById('finalizar-pedido');
        if (finalizarBtn) {
            finalizarBtn.addEventListener('click', () => {
                this.verificarLoginParaFinalizar();
            });
        }
    }

    // VERIFICAR LOGIN ANTES DE FINALIZAR PEDIDO
    verificarLoginParaFinalizar() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (!isLoggedIn || isLoggedIn !== 'true') {
            if (typeof showNotification === 'function') {
                showNotification('Faça login para finalizar o pedido', 'error');
            } else {
                alert('Faça login para finalizar o pedido');
            }
            
            setTimeout(() => {
                window.location.href = '../pages/login.html';
            }, 2000);
            return false;
        }
        
        return this.finalizarPedido();
    }

    atualizarContadorCarrinho() {
        const totalItens = this.getTotalItens();
        console.log('Atualizando contador:', totalItens, 'itens');

        // Atualizar contador na navbar
        const carrinhoCount = document.getElementById('carrinho_count');
        const mobileCarrinhoCount = document.getElementById('mobile_carrinho_count');

        if (carrinhoCount) {
            carrinhoCount.textContent = totalItens;
            carrinhoCount.style.display = totalItens > 0 ? 'flex' : 'none';
        }
        if (mobileCarrinhoCount) {
            mobileCarrinhoCount.textContent = totalItens;
        }

        // Adicionar animação
        const carrinhoBtn = document.getElementById('carrinho_btn');
        if (carrinhoBtn && totalItens > 0) {
            carrinhoBtn.classList.add('carrinho-pulse');
            setTimeout(() => {
                carrinhoBtn.classList.remove('carrinho-pulse');
            }, 500);
        }
    }

    mostrarNotificacao(mensagem) {
        console.log('Mostrando notificação:', mensagem);

        // Remover notificação existente
        const notificacaoExistente = document.querySelector('.notification');
        if (notificacaoExistente) {
            notificacaoExistente.remove();
        }

        // Criar nova notificação
        const notificacao = document.createElement('div');
        notificacao.className = 'notification';
        notificacao.innerHTML = `
            <i class="fa-solid fa-check-circle"></i>
            <span>${mensagem}</span>
        `;

        document.body.appendChild(notificacao);

        // Mostrar notificação
        setTimeout(() => {
            notificacao.classList.add('show');
        }, 100);

        // Esconder e remover após 3 segundos
        setTimeout(() => {
            notificacao.classList.remove('show');
            setTimeout(() => {
                if (notificacao.parentNode) {
                    notificacao.remove();
                }
            }, 300);
        }, 3000);
    }

    renderizarCarrinho() {
        const corpoTabela = document.getElementById('corpo-tabela');
        const carrinhoVazio = document.getElementById('carrinho-vazio');
        const carrinhoComItens = document.getElementById('carrinho-com-itens');

        if (!corpoTabela || !carrinhoVazio || !carrinhoComItens) {
            console.log('Elementos do carrinho não encontrados - provavelmente não está na página do carrinho');
            return; // Elementos não existem nesta página
        }

        if (this.itens.length === 0) {
            carrinhoVazio.style.display = 'block';
            carrinhoComItens.style.display = 'none';
            console.log('Carrinho vazio');
            return;
        }

        carrinhoVazio.style.display = 'none';
        carrinhoComItens.style.display = 'block';

        corpoTabela.innerHTML = '';

        this.itens.forEach((item, index) => {
            const subtotal = item.preco * item.quantidade;
            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>
                    <div class="item-produto">
                        <img src="${item.imagem}" alt="${item.nome}" class="item-imagem">
                        <span>${item.nome}</span>
                    </div>
                </td>
                <td>R$ ${item.preco.toFixed(2)}</td>
                <td>
                    <div class="controle-quantidade">
                        <button class="quantidade-btn" onclick="carrinho.alterarQuantidade(${index}, -1)">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <input type="number" class="quantidade-input" value="${item.quantidade}" 
                               min="1" onchange="carrinho.atualizarQuantidade(${index}, this.value)">
                        <button class="quantidade-btn" onclick="carrinho.alterarQuantidade(${index}, 1)">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td>R$ ${subtotal.toFixed(2)}</td>
                <td>
                    <button class="remover-btn" onclick="carrinho.removerItem(${index})">
                        <i class="fa-solid fa-trash"></i>
                        Remover
                    </button>
                </td>
            `;

            corpoTabela.appendChild(linha);
        });

        this.atualizarResumo();
        console.log('Carrinho renderizado com', this.itens.length, 'itens');
    }

    alterarQuantidade(index, mudanca) {
        const novaQuantidade = this.itens[index].quantidade + mudanca;

        if (novaQuantidade < 1) {
            this.removerItem(index);
            return;
        }

        this.itens[index].quantidade = novaQuantidade;
        this.salvarCarrinho();
        this.renderizarCarrinho();
        this.atualizarContadorCarrinho();
    }

    atualizarQuantidade(index, novaQuantidade) {
        const quantidade = parseInt(novaQuantidade);

        if (quantidade < 1 || isNaN(quantidade)) {
            this.removerItem(index);
            return;
        }

        this.itens[index].quantidade = quantidade;
        this.salvarCarrinho();
        this.renderizarCarrinho();
        this.atualizarContadorCarrinho();
    }

    removerItem(index) {
        if (confirm('Tem certeza que deseja remover este item do carrinho?')) {
            const itemRemovido = this.itens[index];
            this.itens.splice(index, 1);
            this.salvarCarrinho();
            this.renderizarCarrinho();
            this.atualizarContadorCarrinho();
            this.mostrarNotificacao(`${itemRemovido.nome} removido do carrinho`);
        }
    }

    atualizarResumo() {
        console.log('Atualizando resumo...');

        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');

        console.log('Elementos encontrados:', {
            subtotal: !!subtotalElement,
            total: !!totalElement
        });

        if (!subtotalElement || !totalElement) {
            console.error('Elementos do resumo não encontrados');
            return;
        }

        const subtotal = this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        const total = subtotal;
        console.log('Valores calculados:', { subtotal, total });

        // Formatar para o padrão brasileiro
        subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        totalElement.textContent = `R$ ${total.toFixed(2)}`;

        console.log('Resumo atualizado com sucesso');
    }

    salvarCarrinho() {
        localStorage.setItem('carrinho', JSON.stringify(this.itens));
        console.log('Carrinho salvo no localStorage');
    }

    finalizarPedido() {
        if (this.itens.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        // Redirecionar para a página de checkout
        window.location.href = '../pages/checkout.html';
    }

    // Método para adicionar itens ao carrinho - COM VERIFICAÇÃO DE LOGIN
    adicionarItem(produto) {
        console.log('Adicionando produto:', produto);

        // Verificar login novamente (para garantir)
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn || isLoggedIn !== 'true') {
            console.log('Usuário não logado - impedindo adição ao carrinho');
            return false;
        }

        const itemExistente = this.itens.find(item => item.id === produto.id);

        if (itemExistente) {
            itemExistente.quantidade += 1;
            console.log('Quantidade atualizada para:', itemExistente.quantidade);
        } else {
            this.itens.push({
                ...produto,
                quantidade: 1
            });
            console.log('Novo item adicionado');
        }

        this.salvarCarrinho();
        this.atualizarContadorCarrinho();
        this.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);

        // Só renderiza se estiver na página do carrinho
        if (window.location.pathname.includes('carrinho.html')) {
            this.renderizarCarrinho();
        }
        
        return true;
    }

    // Obter quantidade total de itens
    getTotalItens() {
        return this.itens.reduce((total, item) => total + item.quantidade, 0);
    }
}

// Inicializar carrinho automaticamente apenas se estiver na página do carrinho
if (window.location.pathname.includes('carrinho.html')) {
    console.log('Inicializando carrinho na página do carrinho...');
    window.carrinho = new Carrinho();
} else {
    console.log('Carrinho.js carregado - pronto para uso');
    // Criar uma instância global para uso em outras páginas
    window.carrinho = new Carrinho();
}

// Debug
console.log('carrinho.js carregado com sucesso! Carrinho disponível globalmente:', typeof Carrinho !== 'undefined');

// Debug: Verificar se os elementos existem quando a página carrega
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('carrinho.html')) {
        console.log('Página do carrinho carregada');

        // Verificar se os elementos do resumo existem
        const elementos = ['subtotal', 'taxa-entrega', 'total'];
        elementos.forEach(id => {
            const elemento = document.getElementById(id);
            console.log(`Elemento #${id}:`, elemento ? 'Encontrado' : 'NÃO ENCONTRADO');
        });

        // Forçar atualização após um breve delay
        setTimeout(() => {
            if (window.carrinho) {
                console.log('Forçando atualização do resumo...');
                window.carrinho.atualizarResumo();
            }
        }, 500);
    }
});