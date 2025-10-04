
// Load users from API
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
		console.log('Raw data from API:', data);
        
        const usersDiv = document.getElementById('users');
        // If it's already an array, use it directly
        if (Array.isArray(data)) {
            usersDiv.innerHTML = data.map(user => `
                <div style="border:1px solid #ccc; padding:10px; margin:5px;">
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                </div>
            `).join('');
        } 
        // If it's an object with a users property
        else if (data.users && Array.isArray(data.users)) {
            usersDiv.innerHTML = data.users.map(user => `
                <div style="border:1px solid #ccc; padding:10px; margin:5px;">
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                </div>
            `).join('');
        }
        // If it's an object with a rows property
        else if (data.rows && Array.isArray(data.rows)) {
            usersDiv.innerHTML = data.rows.map(user => `
                <div style="border:1px solid #ccc; padding:10px; margin:5px;">
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                </div>
            `).join('');
        }
        // If nothing works
        else {
            usersDiv.innerHTML = '<p>No users found. Try adding one first!</p>';
        }
    } catch (error) {
        console.error('Error loading users:');
    }
}

let currentUserName = ""; // global variable

document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    currentUserName = name; // store the name for marker use
    
    try {
        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });

        e.target.reset();
        loadUsers();
        alert(`User "${name}" added!`);
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


const PinIcon = L.Icon.extend({
    options: {
        //shadowUrl: 'leaf-shadow.png',
        iconSize:     [32, 32],
        //shadowSize:   [50, 64],
        iconAnchor:   [16, 32],
        //shadowAnchor: [4, 62],
        popupAnchor:  [0, -32]
    }
});

const icons = {
    Occurrence: new PinIcon({iconUrl: 'pin-warning.png'}),
    NeedHelp: new PinIcon({iconUrl: 'pin-SOS.png'}),
    GiveHelp: new PinIcon({iconUrl: 'pin-help.png'})
};

function addMarker(lat, lng, popupText = "New Marker", category = "", description = "") {
    let selectedIcon = null;

    if (category === "occurrence")  selectedIcon = icons.Occurrence;
    else if (category === "need help") selectedIcon = icons.NeedHelp;
    else if (category === "give help")  selectedIcon = icons.GiveHelp;
    
    console.log("📍 Adding marker:", { lat, lng, category, selectedIcon });
    console.log("Category input value:", catInput.value);

    const marker = L.marker([lat, lng], selectedIcon ? { icon: selectedIcon } : {}).addTo(map)
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
    const category = catInput.value.trim().toLowerCase();
    const description = textInput.value.trim();

    if (!isNaN(lat) && !isNaN(lng)) {
        const popupText = `${category} at [${lat}, ${lng}]<br>${description}<br>Added by: ${currentUserName || "Unknown"}`;
        addMarker(lat, lng, popupText, category, description);
        popup.style.display = 'none';
        latInput.value = '';
        longInput.value = '';
        textInput.value = '';
        catInput.value = '';
    } else {
        alert ("Please enter valid values for latitude and longitude!");
    }
});

function updatePinsList(filter = "all") {
    pinsList.innerHTML = markers
        .filter(m => filter === "all" || m.category === filter)
        .map((m, index) => `
            <li data-index="${index}">${m.popupText}</li>
        `)
        .join('');

    document.querySelectorAll('#pins li').forEach(li => {
        li.addEventListener('click', () => {
            const i = li.getAttribute('data-index');
            const m = markers[i];
            map.flyTo([m.lat, m.lng], 18, { animate: false, duration: 0.5 });
            m.marker.openPopup();
        });
    });
}

const pinFilter = document.getElementById('pin-filter');

pinFilter.addEventListener('change', () => {
    updatePinsList(pinFilter.value);
});


loadPins();

// var marker = L.marker([41.14852, -8.61317]).addTo(map);
// marker.bindPopup("<b>Where it all started!</b><br>CARALHOOO").openPopup();

