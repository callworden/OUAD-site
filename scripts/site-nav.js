/* Shared top menu: mobile toggle */
(function () {
    var btn = document.querySelector('.site-nav .nav-toggle');
    var menu = document.getElementById('navMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        menu.classList.toggle('is-open', !open);
    });
    menu.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            btn.setAttribute('aria-expanded', 'false');
            menu.classList.remove('is-open');
        }
    });
})();
