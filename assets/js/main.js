function atualizarTotal() {
    // Recuperar a comanda do localStorage
    var comanda = JSON.parse(localStorage.getItem('comanda'));
    var total = 0;

    if(comanda !== null && comanda.itens !== null) {
        // Calcular o total
        for(var i = 0; i < comanda.itens.length; i++) {
            total += comanda.itens[i].total;
        }
    }

    // Atualizar o total na interface do usuário
    document.getElementById("totalGasto").innerText = total.toFixed(2);
}

function atualizarNumeroComanda() {
    // Recuperar a comanda do localStorage
    var comanda = JSON.parse(localStorage.getItem('comanda'));

    if(comanda !== null) {
        // Atualizar o número da comanda na interface do usuário
        document.getElementById("numero-comanda").innerText = comanda.numero;
    }
}

// Caminho da imagem do modal precisa ser mudado mais tarde se bugar
function preencherModal(item) {
    var imageURL = "assets/img/products/" + item.imagem;
    document.querySelector('#myModal .single-product-img img').src = imageURL;
    document.querySelector('#myModal .single-product-content h3').innerText = item.nome;
    document.querySelector('#myModal .single-product-content .single-product-pricing').innerText = 'R$' + item.valor;
    document.querySelector('#myModal .single-product-content p:not(.single-product-pricing)').innerText = item.descritivo;
    document.querySelector('#myModal #modal-categoria').innerText = item.categoria;
}

// Código de teste que insere objeto de comanda no localStorage

var comanda = {
    "numero": 12222,
    "itens": [
        {
            "item": {"nome": "Item 1", "valor": 10.0},
            "quantidade": 2,
            "total": 2323230.0
        },
        {
            "item": {"nome": "Item 2", "valor": 15.0},
            "quantidade": 3,
            "total": 45.0
        }
    ],
    "total" : 65.0
};

localStorage.setItem('comanda', JSON.stringify(comanda));

// loaderActions que carrega a maioria das funções

function loaderActions(){
    
    // Adiciona evento de clique no Modal

    document.querySelectorAll('.product-item').forEach(itemElement => {
        itemElement.addEventListener('click', function() {
            var item = JSON.parse(this.getAttribute('data-item'));
            preencherModal(item);
            $('#myModal').modal('show'); // Abre o modal com jQuery
        });
    });


    // testimonial sliders
    $(".testimonial-sliders").owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        responsive:{
            0:{
                items:1,
                nav:false
            },
            600:{
                items:1,
                nav:false
            },
            1000:{
                items:1,
                nav:false,
                loop:true
            }
        }
    });

    // homepage slider
    $(".homepage-slider").owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        nav: true,
        dots: false,
        navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
        responsive:{
            0:{
                items:1,
                nav:false,
                loop:true
            },
            600:{
                items:1,
                nav:true,
                loop:true
            },
            1000:{
                items:1,
                nav:true,
                loop:true
            }
        }
    });

    // logo carousel
    $(".logo-carousel-inner").owlCarousel({
        items: 4,
        loop: true,
        autoplay: true,
        margin: 30,
        responsive:{
            0:{
                items:1,
                nav:false
            },
            600:{
                items:3,
                nav:false
            },
            1000:{
                items:4,
                nav:false,
                loop:true
            }
        }
    });

    // count down
    if($('.time-countdown').length){  
        $('.time-countdown').each(function() {
        var $this = $(this), finalDate = $(this).data('countdown');
        $this.countdown(finalDate, function(event) {
            var $this = $(this).html(event.strftime('' + '<div class="counter-column"><div class="inner"><span class="count">%D</span>Days</div></div> ' + '<div class="counter-column"><div class="inner"><span class="count">%H</span>Hours</div></div>  ' + '<div class="counter-column"><div class="inner"><span class="count">%M</span>Mins</div></div>  ' + '<div class="counter-column"><div class="inner"><span class="count">%S</span>Secs</div></div>'));
        });
    });
    }

    // // projects filters isotop
    // $(".product-filters li").on('click', function () {
        
    //     $(".product-filters li").removeClass("active");
    //     $(this).addClass("active");

    //     var selector = $(this).attr('data-filter');

    //     $(".product-lists").isotope({
    //         filter: selector,
    //     });
        
    // });
    
    // // isotop inner
    // $(".product-lists").isotope();

    // magnific popup
    $('.popup-youtube').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });

    // light box
    $('.image-popup-vertical-fit').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        mainClass: 'mfp-img-mobile',
        image: {
            verticalFit: true
        }
    });

    // homepage slides animations
    $(".homepage-slider").on("translate.owl.carousel", function(){
        $(".hero-text-tablecell .subtitle").removeClass("animated fadeInUp").css({'opacity': '0'});
        $(".hero-text-tablecell h1").removeClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.3s'});
        $(".hero-btns").removeClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.5s'});
    });

    $(".homepage-slider").on("translated.owl.carousel", function(){
        $(".hero-text-tablecell .subtitle").addClass("animated fadeInUp").css({'opacity': '0'});
        $(".hero-text-tablecell h1").addClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.3s'});
        $(".hero-btns").addClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.5s'});
    });

    // stikcy js
    $("#sticker").sticky({
        topSpacing: 0
    });

    //mean menu
    $('.main-menu').meanmenu({
        meanMenuContainer: '.mobile-menu',
        meanScreenWidth: "992"
    });
    
     // search form
    $(".search-bar-icon").on("click", function(){
        $(".search-area").addClass("search-active");
    });

    $(".close-btn").on("click", function() {
        $(".search-area").removeClass("search-active");
    });


    atualizarTotal();
}

(function ($) {
    "use strict";

    $(document).ready(function($){
        atualizarTotal();
        atualizarNumeroComanda();
    });

    jQuery(window).on("load",function(){
        jQuery(".loader").fadeOut(1000);
    });

}(jQuery));

/**
 * actionbar
 */
$(function() {
    'use strict';

    $('.js-menu-toggle').click(function(e) {
        var $this = $(this);

        if ( $('body').hasClass('show-sidebar') ) {
            $('body').removeClass('show-sidebar');
            $this.removeClass('active');
        } else {
            $('body').addClass('show-sidebar');	
            $this.addClass('active');
        }
        e.preventDefault();
    });

    // click outisde offcanvas
    $(document).mouseup(function(e) {
    var container = $(".sidebar");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ( $('body').hasClass('show-sidebar') ) {
                $('body').removeClass('show-sidebar');
                $('body').find('.js-menu-toggle').removeClass('active');
            }
    }
    }); 
});