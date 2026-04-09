if (!localStorage.getItem("currentUser")) {
    window.location.href = "index.html";
}

// Инициализация карты (Алматы)
let map = L.map('map').setView([43.238949, 76.889709], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

let ads = JSON.parse(localStorage.getItem("ads")) || [];
let markers = [];

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

function saveAds() {
    localStorage.setItem("ads", JSON.stringify(ads));
}

function addAd() {
    const title = document.getElementById("title").value;
    const desc = document.getElementById("desc").value;
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    const file = document.getElementById("image").files[0];

    if (!title || !desc || !lat || !lng || !file) {
        alert("Заполните все поля!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const ad = {
            title,
            desc,
            lat,
            lng,
            image: e.target.result,
            user: localStorage.getItem("currentUser")
        };

        ads.push(ad);
        saveAds();
        renderAds();
    };

    reader.readAsDataURL(file);
}

function renderAds(data = ads) {
    const list = document.getElementById("list");
    list.innerHTML = "";

    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    data.forEach(ad => {
        const marker = L.marker([ad.lat, ad.lng])
            .addTo(map)
            .bindPopup(`<b>${ad.title}</b><br>${ad.desc}`);

        markers.push(marker);

        const div = document.createElement("div");
        div.className = "ad";
        div.innerHTML = `
            <b>${ad.title}</b><br>
            ${ad.desc}<br>
            <img src="${ad.image}">
        `;

        div.onclick = () => {
            map.setView([ad.lat, ad.lng], 15);
            marker.openPopup();
        };

        list.appendChild(div);
    });
}

function searchAds() {
    const value = document.getElementById("search").value.toLowerCase();
    const filtered = ads.filter(ad =>
        ad.title.toLowerCase().includes(value)
    );
    renderAds(filtered);
}

// Загрузка объявлений при старте
renderAds();
