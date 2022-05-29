init(function () {

    document.getElementById('menu-toggler').addEventListener('click', function () {
        let span = document.querySelector('#menu-toggler span');
        span.innerHTML = (span.innerHTML === 'menu' ? 'menu_open' : 'menu');
    });

    // load swiper
    getSwiper((window.innerWidth < 700));

    window.addEventListener("resize", (e) => {
        getSwiper((e.target.innerWidth < 700));
    });
})


let getSwiper = (mobile = false) => {

    return new Swiper(".swiper-container", {
        slidesPerView: (mobile ? "auto" : 2),
        loop: true,
        centeredSlides: true,
        spaceBetween: (mobile ? 5 : 20),
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + (index + 1) + '</span>';
            },
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    });
}
