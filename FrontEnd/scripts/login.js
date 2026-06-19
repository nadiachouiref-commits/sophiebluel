const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
    // Empêche le rechargement de la page
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    // On envoie email + mot de passe à l'API
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            // Mauvais identifiants
            document.querySelector(".error").innerText = "Email ou mot de passe incorrect";
        }
    })
    .then(data => {
        if (data) {
            // On stocke le token
            localStorage.setItem("token", data.token);
            // On redirige vers la page d'accueil
            window.location.href = "./index.html";
        }
    })
});
