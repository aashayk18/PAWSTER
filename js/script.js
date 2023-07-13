document.addEventListener("DOMContentLoaded", function () {
    var petCardTemplate = document.getElementById("pet-card-template").innerHTML;
    var template = Handlebars.compile(petCardTemplate);

    function generatePetCards(pets) {
        var petCardsContainer = document.getElementById("petCardsContainer");
        petCardsContainer.innerHTML = "";

        if (pets.length === 0) {
            var noPetsMessage = document.createElement("p");
            noPetsMessage.textContent = "No pets found";
            petCardsContainer.appendChild(noPetsMessage);
        } else {
            pets.forEach(function (pet) {
                var petCardHTML = template(pet);

                var petCardContainer = document.createElement("div");
                petCardContainer.classList.add("card");
                petCardContainer.innerHTML = petCardHTML;

                var image = petCardContainer.querySelector(".image img");
                image.setAttribute("src", "uploads/" + pet.image);

                petCardsContainer.appendChild(petCardContainer);
            });
        }
    }

    function fetchPets() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/search");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var pets = JSON.parse(xhr.responseText);
                    generatePetCards(pets);
                } else {
                    console.error('Error fetching pets:', xhr.status);
                    alert('Error fetching pets. Please try again.');
                }
            }
        };
        xhr.send();
    }

    fetchPets();
});

document.getElementById("petForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var petName = document.getElementById("petName").value;
    var petAge = document.getElementById("petAge").value;
    var petTraits = document.getElementById("petTraits").value;
    var petToy = document.getElementById("petToy").value;
    var petImage = document.getElementById("petImage").files[0];

    var formData = new FormData();
    formData.append("petName", petName);
    formData.append("petAge", petAge);
    formData.append("petTraits", petTraits);
    formData.append("petToy", petToy);
    formData.append("petImage", petImage);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/add-pet");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                fetchPets();
            } else {
                console.error('Error storing pet data:', xhr.status);
                alert('Error storing pet data. Please try again.');
            }
        }
    };
    xhr.send(formData);

    document.getElementById("petForm").reset();
    location.reload();

    var modal = document.getElementById("petFormModal");
    var modalBackdrop = document.getElementsByClassName("modal-backdrop")[0];
    modal.style.display = "none";
    modalBackdrop.style.display = "none";
});

document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var searchTerm = document.getElementById("searchTerm").value;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/search?term=" + encodeURIComponent(searchTerm));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var pets = JSON.parse(xhr.responseText);
                var petDetailsContent = document.getElementById("petDetailsContent");
                petDetailsContent.innerHTML = "";

                if (pets.length === 0) {
                    petDetailsContent.textContent = "No pets found";
                } else {
                    pets.forEach(function (pet) {
                        var petDetails = document.createElement("div");

                        var imageContainer = document.createElement("div");
                        imageContainer.style.display = "flex";
                        imageContainer.style.justifyContent = "center";

                        var image = document.createElement("img");
                        image.src = "uploads/" + pet.image;
                        image.alt = pet.name;
                        image.style.borderRadius = "10px";
                        image.style.height = "200px";
                        image.style.width = "300px";
                        
                        imageContainer.appendChild(image);

                        petDetails.appendChild(imageContainer);

                        var name = document.createElement("h6");
                        name.textContent = "Name: " + pet.name;
                        name.style.textAlign = "center";
                        name.style.fontFamily = "Montserrat";
                        name.style.fontWeight = "600";
                        name.style.fontSize = "1.1rem";
                        name.style.color = "#4e3a08";
                        name.style.marginTop = "10px";
                        name.style.marginBottom = "15px";
                        petDetails.appendChild(name);

                        var age = document.createElement("p");
                        age.textContent = "Age: " + pet.age;
                        age.style.color = "#4e3a08";
                        petDetails.appendChild(age);

                        var traits = document.createElement("p");
                        traits.textContent = "Traits: " + pet.traits;
                        traits.style.color = "#4e3a08";
                        petDetails.appendChild(traits);

                        var toy = document.createElement("p");
                        toy.textContent = "Favorite Toy: " + pet.toy;
                        toy.style.color = "#4e3a08";
                        toy.style.marginBottom = "20px";
                        petDetails.appendChild(toy);

                        petDetailsContent.appendChild(petDetails);
                    });
                }

                searchForm.reset();

                var petDetailsModal = new bootstrap.Modal(document.getElementById("petDetailsModal"));
                petDetailsModal.show();
            } else {
                console.error('Error searching for pets:', xhr.status);
                alert('Error searching for pets. Please try again.');
            }
        }
    };
    xhr.send();
});
