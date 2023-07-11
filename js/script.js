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
    xhr.open("POST", "/store-data-to-mongodb"); // Replace with your server endpoint
    xhr.send(formData);
  
    document.getElementById("petForm").reset();
  
    var modal = document.getElementById("petFormModal");
    var modalBackdrop = document.getElementsByClassName("modal-backdrop")[0];
    modal.style.display = "none";
    modalBackdrop.style.display = "none";
  });
  