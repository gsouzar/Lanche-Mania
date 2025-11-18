let carrinhoInstancia = null;

function getCarrinho() {
    if (!carrinhoInstancia && typeof Carrinho !== 'undefined') {
        carrinhoInstancia = new Carrinho();
    }
    return carrinhoInstancia;
}

// FUNÇÃO PARA VERIFICAR SE O USUÁRIO ESTÁ LOGADO
function verificarLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // Usar showNotification se disponível, senão usar alert
        if (typeof showNotification === 'function') {
            showNotification('Faça login para adicionar itens', 'error');
        } else {
            alert('Faça login para adicionar');
        }
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
            window.location.href = '../pages/login.html';
        }, 2000);
        
        return false;
    }
    
    return true;
}

function adicionarAoCarrinho(produto) {
    console.log('Adicionando ao carrinho:', produto);
    
    // VERIFICAR LOGIN ANTES DE ADICIONAR
    if (!verificarLogin()) {
        return false; // Impede a adição se não estiver logado
    }
    
    const carrinho = getCarrinho();
    if (carrinho) {
        carrinho.adicionarItem(produto);
    } else {
        console.error('Carrinho não disponível');
        // Fallback: salvar diretamente no localStorage
        salvarItemDiretamente(produto);
        alert('Produto adicionado ao carrinho!');
    }
    return true;
}

// Fallback caso o carrinho.js não carregue
function salvarItemDiretamente(produto) {
    try {
        const carrinhoAtual = JSON.parse(localStorage.getItem('carrinho')) || [];
        
        const itemExistente = carrinhoAtual.find(item => item.id === produto.id);
        
        if (itemExistente) {
            itemExistente.quantidade += 1;
        } else {
            carrinhoAtual.push({
                ...produto,
                quantidade: 1
            });
        }
        
        localStorage.setItem('carrinho', JSON.stringify(carrinhoAtual));
        console.log('Item salvo diretamente no localStorage');
        
        // Atualizar contador visualmente
        atualizarContadorManual();
        
    } catch (error) {
        console.error('Erro ao salvar item:', error);
    }
}

function atualizarContadorManual() {
    try {
        const carrinhoAtual = JSON.parse(localStorage.getItem('carrinho')) || [];
        const totalItens = carrinhoAtual.reduce((total, item) => total + item.quantidade, 0);
        
        const carrinhoCount = document.getElementById('carrinho_count');
        const mobileCarrinhoCount = document.getElementById('mobile_carrinho_count');
        
        if (carrinhoCount) {
            carrinhoCount.textContent = totalItens;
            carrinhoCount.style.display = totalItens > 0 ? 'flex' : 'none';
        }
        if (mobileCarrinhoCount) {
            mobileCarrinhoCount.textContent = totalItens;
        }
    } catch (error) {
        console.error('Erro ao atualizar contador:', error);
    }
}

// Inicializar contador quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cardápio carregado');
    atualizarContadorManual();
    
    // Tentar inicializar o carrinho se estiver disponível
    if (typeof Carrinho !== 'undefined' && !carrinhoInstancia) {
        carrinhoInstancia = new Carrinho();
    }
});

// Função para navegação por categorias - VERSÃO SIMPLIFICADA
function filtrarCategoria(categoria) {
    // Remove a classe active de todos os botões
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Adiciona a classe active ao botão clicado
    event.target.classList.add('active');

    // Encontra a seção correspondente
    const elemento = document.getElementById(categoria);
    
    if (elemento) {
        // Rolagem suave
        elemento.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function adicionarProduto(botao) {
    const id = botao.dataset.id;
    const nome = botao.dataset.nome;
    const preco = parseFloat(botao.dataset.preco);
    const imagem = botao.dataset.imagem;

    adicionarAoCarrinho({
        id: id,
        nome: nome,
        preco: preco,
        imagem: imagem
    });
}