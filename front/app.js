
// Load users from API
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        
        const usersDiv = document.getElementById('users');
        usersDiv.innerHTML = users.map(user => `
            <div class="user-card">
                <h3>${user.name}</h3>
                <p>${user.email}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Add new user
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    try {
        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        
        // Clear form and reload users
        e.target.reset();
        loadUsers();
    } catch (error) {
        console.error('Error adding user:', error);
    }
});

// Load users when page loads
loadUsers();

const map = L.map('map').setView([41.14852, -8.61317], 20);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const pinsList = document.getElementById('pins');
let markers = [];

const addButton = document.getElementById('add');
const popup = document.getElementById('add-popup');
const submitBtn = document.getElementById('submit-marker');
const cancelBtn = document.getElementById('cancel-marker');
const latInput = document.getElementById('lat')
const longInput = document.getElementById('lng')
const textInput = document.getElementById('info')
const catInput = document.getElementById('type')


function addMarker(lat, lng, popupText = "New Marker", category = "", description = "") {
    const marker = L.marker([lat, lng]).addTo(map)
    .bindPopup(popupText)
    .openPopup();
    markers.push({ marker, lat, lng, popupText, category, description });
    updatePinsList();
    savePins();
}

function updatePinsList() {
    pinsList.innerHTML = markers.map((m, index) => `
        <li data-index="${index}">${m.popupText}</li>
    `).join('');
    document.querySelectorAll('#pins li').forEach(li => {
        li.addEventListener('click', () => {
            const i = li.getAttribute('data-index');
            const m = markers[i];
            map.flyTo([m.lat, m.lng], 18, { animate: false, duration: 0.5 });
            m.marker.openPopup();
        });
    });
}

function savePins() {
    const data = markers.map(m => ({
        lat: m.lat,
        lng: m.lng,
        popupText: m.popupText,
        category: m.category,
        description: m.description
    }));
    localStorage.setItem('pins', JSON.stringify(data));
}

function loadPins() {
    const saved = localStorage.getItem('pins');
    if (!saved) return;

    const data = JSON.parse(saved);
    data.forEach(p => {
        addMarker(p.lat, p.lng, p.popupText, p.category, p.description);
    });
}

addButton.addEventListener('click', () => {
    popup.style.display = 'block';
});

cancelBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    latInput.value = '';
    longInput.value = '';
    textInput.value = '';
    catInput.value = '';
});

submitBtn.addEventListener('click', () => {
    const lat = parseFloat(latInput.value);
    const lng = parseFloat(longInput.value);

    if (!isNaN(lat) && !isNaN(lng)) {
        const popupText = `${catInput.value} at [${lat}, ${lng}]<br>${textInput.value}<br>Added by: ${name}`;
        addMarker(lat, lng, popupText, catInput.value, textInput.value);
        popup.style.display = 'none';
        latInput.value = '';
        longInput.value = '';
        textInput.value = '';
        catInput.value = '';
    } else {
        alert ("Please enter valid values for latitude and longitude!");
    }
});

loadPins();

// var marker = L.marker([41.14852, -8.61317]).addTo(map);

// marker.bindPopup("<b>Where it all started!</b><br>CARALHOOO").openPopup();
