// mobile.js - Versão sem ScrollReveal
$(document).ready(function() {
    // Menu mobile toggle
    $('#mobile_btn').on('click', function () {
        $('#mobile_menu').toggleClass('active');
        $('#mobile_btn').find('i').toggleClass('fa-x');
        
        // Controlar overflow do body
        if ($('#mobile_menu').hasClass('active')) {
            $('body').css('overflow', 'hidden');
        } else {
            $('body').css('overflow', 'auto');
        }
    });

    // Fechar menu ao clicar no botão fechar
    $('#mobile_btn_close').on('click', function () {
        $('#mobile_menu').removeClass('active');
        $('#mobile_btn').find('i').removeClass('fa-x');
        $('body').css('overflow', 'auto');
    });

    // Fechar menu ao clicar em links (mobile)
    $('#mobile_menu a').on('click', function () {
        $('#mobile_menu').removeClass('active');
        $('#mobile_btn').find('i').removeClass('fa-x');
        $('body').css('overflow', 'auto');
    });

    const navItems = $('.nav-item');

    // Lógica específica para página do carrinho
    if (window.location.pathname.includes('carrinho.html') || 
        window.location.pathname.includes('checkout.html')) {
        navItems.removeClass('active');
        // Não aplica lógica de scroll para estas páginas
        return;
    }

    // Lógica de scroll apenas para outras páginas
    const sections = $('section');

    $(window).on('scroll', function () {
        const header = $('header');
        const scrollPosition = $(window).scrollTop() - header.outerHeight();

        let activeSectionIndex = 0;
        
        if (scrollPosition <= 0) {
            header.css('box-shadow', 'none');
        } else {
            header.css('box-shadow', '5px 1px 5px rgba(0, 0, 0, 0.1)');
        }

        sections.each(function(i) {
            const section = $(this);
            const sectionTop = section.offset().top - 96;
            const sectionBottom = sectionTop + section.outerHeight();

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSectionIndex = i;
                return false;
            }
        })

        navItems.removeClass('active');
        $(navItems[activeSectionIndex]).addClass('active');
    });
});