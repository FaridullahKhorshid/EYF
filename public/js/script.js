init(function () {

    let navItemId = window.location.pathname.slice(1);
    let navItem = document.getElementById(navItemId);
    let entertainment = ['game', 'music', 'film'];

    if (navItem != undefined) {
        navItem.classList.add('active');
        if (entertainment.includes(navItemId)) {
            document.getElementById('navbar_entertainment').classList.add('active');
        }
    }

    let searchInput = document.getElementById('search');

    if (searchInput != undefined) {

        searchInput.addEventListener('keyup', (e) => {
            let albumCards = document.querySelectorAll('.searchable_item');
            let value = e.target.value.trim().toLowerCase();

            albumCards.forEach((element) => {

                let search = element.getAttribute('data-search').toLowerCase();

                if (search.indexOf(value) !== -1) {
                    element.classList.remove('d-none');
                } else {
                    element.classList.add('d-none');
                }
            });
        });
    }
})

function init(_callback) {

    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck);
            _callback();
        }
    }, 100);
}

function checkInput(input) {
    let msg = document.getElementById('alert_message');
    if (input.value === 'CreditCard') {
        msg.classList.add('d-none');
    } else {
        msg.classList.remove('d-none');
    }
}
