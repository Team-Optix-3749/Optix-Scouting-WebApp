
async function addNav() {
    const resp = await fetch("nav.html");
    const html = await resp.text();
    document.getElementById("content").insertAdjacentHTML("beforebegin", html);

    console.log(window.location.pathname)
}

addNav();