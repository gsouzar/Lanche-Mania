const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function searchProduct() {
    const filter = searchInput.value.trim().toLowerCase();
    const allSectionTitles = document.querySelectorAll(".section-subtitle-card");
    const allDishesSections = document.querySelectorAll("#dishes");
    let foundAnyProduct = false;

    // Remove mensagem anterior
    const existingMessage = document.querySelector(".no-products-message");
    if (existingMessage) existingMessage.remove();

    // Se busca vazia, mostra TUDO
    if (filter === "") {
        allSectionTitles.forEach(title => {
            title.style.display = "";
        });
        allDishesSections.forEach(section => {
            section.querySelectorAll(".dish").forEach(dish => {
                dish.style.display = "";
            });
        });
        return;
    }

    // Durante busca: primeiro esconde TUDO
    allSectionTitles.forEach(title => {
        title.style.display = "none";
    });
    allDishesSections.forEach(section => {
        section.querySelectorAll(".dish").forEach(dish => {
            dish.style.display = "none";
        });
    });

    // Agora mostra apenas os produtos que batem com a busca
    allDishesSections.forEach(section => {
        const dishes = section.querySelectorAll(".dish");
        
        dishes.forEach(dish => {
            const dishTitle = dish.querySelector(".dish-title").textContent.toLowerCase();
            
            if (dishTitle.includes(filter)) {
                dish.style.display = ""; // Mostra o produto
                foundAnyProduct = true;
                
                // Encontra e mostra o título da SEÇÃO deste produto
                const sectionTitle = findSectionTitle(dish);
                if (sectionTitle) {
                    sectionTitle.style.display = ""; // Mostra o título da seção
                }
            }
        });
    });

    // Mostra mensagem se não encontrou nada
    if (!foundAnyProduct) {
        showNoProductsMessage();
    }
}

function findSectionTitle(dish) {
    // Procura o título da seção (vai para trás até encontrar um .section-subtitle-card)
    let currentElement = dish.parentElement.previousElementSibling;
    
    while (currentElement) {
        if (currentElement.classList.contains("section-subtitle-card")) {
            return currentElement;
        }
        currentElement = currentElement.previousElementSibling;
    }
    
    return null;
}

function showNoProductsMessage() {
    const message = document.createElement("div");
    message.className = "no-products-message";
    message.textContent = "Produto não encontrado";
    message.style.cssText = `
        text-align: center;
        padding: 20px;
        font-size: 18px;
        color: #666;
        background-color: #f9f9f9;
        border-radius: 8px;
        margin: 20px 0;
        width: 100%;
    `;
    
    // Adiciona a mensagem no container principal
    const mainContainer = document.querySelector("#menu") || document.body;
    mainContainer.appendChild(message);
}

// Eventos
searchBtn.addEventListener("click", searchProduct);

let searchTimeout;
searchInput.addEventListener("input", function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(searchProduct, 300);
});

searchInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        searchProduct();
    }
});

// Quando limpar o campo de busca
searchInput.addEventListener("search", function() {
    if (this.value === "") {
        searchProduct();
    }
});