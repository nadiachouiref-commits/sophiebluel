// recuperer token depuis le localStorage
const token = localStorage.getItem("token");


fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {

        const gallery = document.querySelector(".gallery");
        const filters = document.querySelector(".filters");

        function afficherProjets(projets) {
            gallery.innerHTML = "";
            projets.forEach(work => {
                const figure = document.createElement("figure");
                const image = document.createElement("img");
                image.src = work.imageUrl;
                const caption = document.createElement("figcaption");
                caption.innerText = work.title;
                figure.appendChild(image);
                figure.appendChild(caption);
                gallery.appendChild(figure);
            });
        }

        function afficherProjetsModale(projets) {
            const modaleGallery = document.getElementById("modale-gallery");

            modaleGallery.innerHTML = "";

            projets.forEach(work => {
                const figure = document.createElement("figure");

                const image = document.createElement("img");
                image.src = work.imageUrl;

                const trash = document.createElement("i");
                trash.classList.add("fa-solid", "fa-trash-can");

                // Suppression au clic sur la poubelle
                
                trash.addEventListener("click", () => {
                    const confirmation = confirm("Voulez-vous supprimer ce projet ?");
    
                    if (confirmation) {
                        fetch(`http://localhost:5678/api/works/${work.id}`, {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        .then(response => {
                            if (response.ok) {
                                figure.remove(); // supprime la photo de la modale
                                // Retire le projet du tableau data
                                const index = data.findIndex(w => w.id === work.id);
                                data.splice(index, 1);
            
                                // Met à jour la galerie principale
                                afficherProjets(data);
                            }
                        });
                    }    
                });

                figure.appendChild(image);
                figure.appendChild(trash);

                modaleGallery.appendChild(figure);
            })
        }

        afficherProjetsModale(data);

        // Afficher tous les projets au démarrage
        afficherProjets(data);

        // Bouton "Tous"
        const buttonTous = document.createElement("button");
        buttonTous.innerText = "Tous";
        buttonTous.classList.add("active");
        buttonTous.addEventListener("click", () => {
            afficherProjets(data);
            document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
            buttonTous.classList.add("active");
        });
        filters.appendChild(buttonTous);

        // Boutons catégories
        const categories = ["Objets", "Appartements", "Hotels & restaurants"];
        categories.forEach(category => {
            const buttonCategorie = document.createElement("button");
            buttonCategorie.innerText = category;
            buttonCategorie.addEventListener("click", () => {
                const projetsFiltres = data.filter(work => work.category.name === category);
                afficherProjets(projetsFiltres);
                document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
                buttonCategorie.classList.add("active");
            });
            filters.appendChild(buttonCategorie);
        });

    });



    if (token) {
        // Remplacer login par logout
        const loginLink = document.querySelector("nav li:nth-child(3) a"); //on sélectionne le <li> qui est en 3ème position dans la nav
        loginLink.innerText = "logout";
        loginLink.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.reload();
        });

        // Cacher les filtres
        const filters = document.querySelector(".filters");
        filters.style.display = "none";

        // Afficher le bouton modifier
        const modifier = document.querySelector(".modifier");
        modifier.style.display = "block";
  
        // Bandeau mode édition
        const editBanner = document.querySelector(".edit-banner");
        editBanner.style.display = "block";
    }


// Récupération des éléments HTML nécessaires au fonctionnement de la modale
const overlay = document.getElementById("overlay");

const modaleGalerie = document.getElementById("modale-galerie");
const modaleAjout = document.getElementById("modale-ajout");

const btnAjouterPhoto = document.getElementById("btn-ajouter-photo");
const btnRetour = document.querySelector(".btn-retour");

const boutonsFermer = document.querySelectorAll(".close-modale");

// Ouvrir écran ajout photo
btnAjouterPhoto.addEventListener("click", () => {
    modaleGalerie.style.display = "none";
    modaleAjout.style.display = "block";
});

// Retour écran galerie
btnRetour.addEventListener("click", () => {
    modaleAjout.style.display = "none";
    modaleGalerie.style.display = "block";
});

// Fermer avec la croix
boutonsFermer.forEach((bouton) => {
    bouton.addEventListener("click", () => {
        overlay.style.display = "none";
    });
});

// Fermer en cliquant sur le fond gris
overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
        overlay.style.display = "none";
    }
});

// Ouverture de la modale et affichage de l'ecran galerie par défaut 
const btnModifier = document.querySelector(".modifier");

btnModifier.addEventListener("click", () => {
    overlay.style.display = "flex";

    modaleGalerie.style.display = "block";
    modaleAjout.style.display = "none";
});

//Modale écran 2 : Ajout d'un nouveau projet

// Étape A - Preview de l'image sélectionnée
const photoInput = document.getElementById("photo-input");
const previewImage = document.getElementById("preview-image");
const iconeUpload = document.getElementById("icone-upload");

photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    const url = URL.createObjectURL(file);
    previewImage.src = url;
    previewImage.style.display = "block";
    iconeUpload.style.display = "none";
     // Cacher le bouton et le texte quand une image est selectionnée 
    document.querySelector("#upload-zone label").style.display = "none";
    document.querySelector("#upload-zone p").style.display = "none";
});

// Étape B - Récupération des catégories depuis l'API
fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categoriesAPI => {
        const selectCategorie = document.getElementById("categorie");
        categoriesAPI.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.innerText = cat.name;
            selectCategorie.appendChild(option);
        });
    });


// activer le bouton "valider" et envoyer le formulaire


const titreInput = document.getElementById("titre");
const selectCategorie = document.getElementById("categorie");
const btnValider = document.getElementById("btn-valider");

// Vérifie si tous les champs sont remplis
function verifierFormulaire() {
    if (photoInput.files.length > 0 && titreInput.value !== "" && selectCategorie.value !== "") {
        btnValider.style.backgroundColor = "#1D6154";
    } else {
        btnValider.style.backgroundColor = "#A7A7A7";
    }
}

photoInput.addEventListener("change", verifierFormulaire);
titreInput.addEventListener("input", verifierFormulaire);
selectCategorie.addEventListener("change", verifierFormulaire);

// Envoi du formulaire
btnValider.addEventListener("click", () => {
    const formData = new FormData();
    formData.append("image", photoInput.files[0]);
    formData.append("title", titreInput.value);
    formData.append("category", selectCategorie.value);

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(newWork => {
        // Ajouter dans data / Mettre à jour la galerie principale et la galerie de la modale
        location.reload();
    });
});