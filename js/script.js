document.addEventListener("DOMContentLoaded", function () {
    var petCardTemplate = document.getElementById("pet-card-template").innerHTML;
    var template = Handlebars.compile(petCardTemplate);

    // const petCardsContainer = document.getElementById("petCardsContainer");
    // const petDetailsModal = document.getElementById("petDetailsModal");

    // petCardsContainer.addEventListener("click", function (event) {
    //     if (event.target.classList.contains("card")) {
    //         const petId = event.target.dataset.petId;

    //         const petDetails = getPetDetailsById(petId);

    //         const petDetailsContent = document.getElementById("petDetailsContent");
    //         petDetailsContent.innerHTML = `
    //           <div class="name">
    //             <strong>Name:</strong>
    //             <span>${petDetails.name}</span>
    //           </div>
    //           <div class="age">
    //             <strong>Age:</strong>
    //             <span>${petDetails.age}</span>
    //           </div>
    //           <div class="personality">
    //             <strong>Personality Traits:</strong>
    //             <span>${petDetails.traits}</span>
    //           </div>
    //           <div class="toy">
    //             <strong>Favorite Toy:</strong>
    //             <span>${petDetails.toy}</span>
    //           </div>
    //         `;
      
    //         const modal = new bootstrap.Modal(petDetailsModal);
    //         modal.show();
    //     }
    // })

    // async function getPetDetailsById(petId) {
    //     const response = await fetch("https://pawster-server.onrender.com/getPetById?id=" + encodeURIComponent(petId));
    //     const petDetails = await response.json();
    //     return petDetails;
    //   }

    const navbar = document.querySelector(".navbar");
    const navbarPadding = document.querySelector(".navbar-padding");

    function showNavbarPadding() {
        setTimeout(() => {
            navbarPadding.style.display = "block";
            navbarPadding.style.height = "120px";
          }, 100);
    }

    function hideNavbarPadding() {
        navbarPadding.style.height = "0px";
        setTimeout(() => {
            navbarPadding.style.display = "none";
          }, 300);
    }

    navbar.addEventListener("show.bs.collapse", showNavbarPadding);
    navbar.addEventListener("hide.bs.collapse", hideNavbarPadding);

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
                image.src = pet.image.url;

                petCardsContainer.appendChild(petCardContainer);
            });
        }
    }

    var fetchPets = async function () {
        const response = await fetch("https://pawster-server.onrender.com/search");
        const pets = await response.json();
        generatePetCards(pets);
    };

    fetchPets();
});



document.getElementById("petForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    var petName = document.getElementById("petName").value;
    var petAge = document.getElementById("petAge").value;
    var petTraits = document.getElementById("petTraits").value;
    var petToy = document.getElementById("petToy").value;
    var petOwner = document.getElementById("petOwner").value;
    var petImage = document.getElementById("petImage").files[0];

    // Extracting the numeric value and unit from the age string
    const ageRegex = /^(\d+)\s*(months|years)$/i;
    const ageMatch = petAge.match(ageRegex);

    if (ageMatch) {
        const ageValue = parseInt(ageMatch[1]); // Extracted numeric value
        const ageUnit = ageMatch[2].toLowerCase(); // Extracted unit (months or years)

        // Storing the age value in the appropriate format
        if (ageUnit === 'months') {
            petAge = ageValue + ' months';
        } else if (ageUnit === 'years') {
            petAge = ageValue + ' years';
        } else {
            // Invalid age unit
            console.error('Invalid age unit:', ageUnit);
        }
    } else {
        // Invalid age format
        console.error('Invalid age format:', petAge);
    }

    var formData = new FormData();
    formData.append("petName", petName);
    formData.append("petAge", petAge);
    formData.append("petTraits", petTraits);
    formData.append("petToy", petToy);
    formData.append("petOwner", petOwner);
    formData.append("petImage", petImage);

    const response = await fetch("https://pawster-server.onrender.com/add-pet", { method: "POST", body: formData });
    if (response.status === 200) {

        var fetchPets = async function () {
            const response = await fetch("https://pawster-server.onrender.com/search");
            const pets = await response.json();
            generatePetCards(pets);
        };

        fetchPets();
    } else {
        console.error('Error storing pet data:', response.status);
        alert('Error storing pet data. Please try again.');
    };

    document.getElementById("petForm").reset();
    location.reload();

    var modal = document.getElementById("petFormModal");
    var modalBackdrop = document.getElementsByClassName("modal-backdrop")[0];
    modal.style.display = "none";
    modalBackdrop.style.display = "none";
});

document.getElementById("searchForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const searchTerm = document.getElementById("searchTerm").value;

    const response = await fetch("https://pawster-server.onrender.com/search?term=" + encodeURIComponent(searchTerm));
    const pets = await response.json();

    const petDetailsContent = document.getElementById("petDetailsContent");
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
            image.src = pet.image.url;
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
            name.style.color = "#211800";
            name.style.marginTop = "10px";
            name.style.marginBottom = "15px";
            petDetails.appendChild(name);

            var age = document.createElement("p");
            age.textContent = "Age: " + pet.age;
            age.style.color = "#211800";
            petDetails.appendChild(age);

            var traits = document.createElement("p");
            traits.textContent = "Traits: " + pet.traits;
            traits.style.color = "#211800";
            petDetails.appendChild(traits);

            var toy = document.createElement("p");
            toy.textContent = "Favorite Toy: " + pet.toy;
            toy.style.color = "#211800";
            toy.style.marginBottom = "20px";
            petDetails.appendChild(toy);

            var owner = document.createElement("p");
            owner.textContent = "Owner Name: " + pet.owner;
            owner.style.color = "#211800";
            owner.style.marginBottom = "20px";
            petDetails.appendChild(owner);

            petDetailsContent.appendChild(petDetails);
        });
        searchForm.reset();

        const petDetailsModal = new bootstrap.Modal(document.getElementById("petDetailsModal"));
        petDetailsModal.show();
      }
    });
