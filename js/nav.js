
async function addNav() {
    const resp = await fetch("nav.html");
    const html = await resp.text();
    document.getElementById("content").insertAdjacentHTML("beforebegin", html);

    var navItems = document.getElementById("nav-items")
    for (var child of navItems.children) {
        console.log(child.children[0].href)
        if (child.children[0].href === window.location.href) {
            child.children[0].classList.add("active")
        }
    }
}

addNav();