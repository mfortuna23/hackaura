
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
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            loadUsers(); // Reload the users list
        } else {
            alert('Error: ' + result.error);
        }
        // Clear form and reload users
        e.target.reset();
        loadUsers();
    } catch (error) {
        console.error('Error adding user:', error);
    }
});

// Load users when page loads
loadUsers();

var map = L.map('map').setView([41.14852, -8.61317], 20);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const addButton = document.getElementById('add');
const popup = document.getElementById('add-popup');
const submitBtn = document.getElementById('submit-marker');
const cancelBtn = document.getElementById('cancel-marker');

function addMarker(lat, lng, popupText = "New Marker") {
    L.marker([lat, lng]).addTo(map)
    .bindPopup(popupText)
    .openPopup();
}

const latInput = document.getElementById('lat')
const longInput = document.getElementById('lng')

addButton.addEventListener('click', () => {
    popup.style.display = 'block';
});

cancelBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    latInput.value = '';
    longInput.value = '';
});

submitBtn.addEventListener('click', () => {
    const lat = parseFloat(latInput.value);
    const lng = parseFloat(longInput.value);

    if (!isNaN(lat) && !isNaN(lng)) {

        addMarker(lat, lng, `Marker at [${lat}, ${lng}]`);
        popup.style.display = 'none';
        latInput.value = '';
        longInput.value = '';
    } else {
        alert ("Please enter valid values for latitude and longitude!");
    }
});

// var marker = L.marker([41.14852, -8.61317]).addTo(map);
// marker.bindPopup("<b>Where it all started!</b><br>CARALHOOO").openPopup();

