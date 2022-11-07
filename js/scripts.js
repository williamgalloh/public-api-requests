// Initialize number of users to get
const userCount = 12;

// Initialize nationlity of users
const userNat = "US";

// Initialize variable that will hold user data
let originalUsers = [];
let users = [];

// Get users from API
fetch('https://randomuser.me/api/?nat=' + userNat + '&results=' + userCount)
	.then( response => response.json() )
	.then((data) => {
		if(data.results) {
			// Save the original user data to work against
			originalUsers = data.results;
			// Populate the user variable that will be used to manipulate the users displayed
			users = [...originalUsers];
			displayUsers();
		}
	});

// Display each user's card on the page
function displayUsers() {
	// clear
	document.getElementById('gallery').innerHTML = "";

	// Build each user's html
	for( let i = 0; i < users.length; i++) {
		let user = users[i];

		let html = `<div class="card" data-user="${i}">
            <div class="card-img-container">
                <img class="card-img" src="${user.picture.medium}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}</p>
            </div>
        </div>`;

        document.getElementById('gallery').insertAdjacentHTML('beforeend', html);

		document.querySelector('#gallery .card:last-child').addEventListener('click', (e) => {
			let userIndex = parseInt(e.currentTarget.dataset.user);
			showUserModal(users[userIndex], userIndex);
		});
	}
}

function showUserModal(user, index) {
	// Format phone if 10 digits long
	let cellPhone = user.cell.replace(/\D/g,'');
	if(cellPhone.length === 10) {
		let match = cellPhone.match(/^([0-9]{3})([0-9]{3})([0-9]{4})$/);
		cellPhone = `(${match[1]}) ${match[2]}-${match[3]}`;
	} else {
		cellPhone = user.cell;
	}

	// Format birthdate
	let birthDate = user.dob.date;
	let match = birthDate.match(/^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2}).*$/);
	birthDate = `${match[2]}/${match[3]}/${match[1]}`;

	let html = `<img class="modal-img" src="${user.picture.large}" alt="profile picture">
    <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
    <p class="modal-text">${user.email}</p>
    <p class="modal-text cap">${user.location.city}</p>
    <hr>
    <p class="modal-text">${cellPhone}</p>
    <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
    <p class="modal-text">Birthday: ${birthDate}</p>`;

    document.querySelector('.modal .modal-info-container').innerHTML = html;
    document.querySelector('.modal-container').style.display = "block";

    // Update next/prev buttons
    let prevIndex = (index === 0) ? users.length - 1 : index - 1;
    let nextIndex = (index === (users.length - 1)) ? 0 : (index + 1);
    document.getElementById('modal-prev').dataset.userIndex = prevIndex;
    document.getElementById('modal-next').dataset.userIndex = nextIndex;
}

function hideUserModal() {
	document.querySelector('.modal-container').style.display = "none";
}

function filterUsers(query) {
	if(query != "") {
		query = query.toLowerCase();
		// Get a fresh copy of the original users to work with
		users = [...originalUsers];

		// Filter to get only the users who match the search query
		users = users.filter((user) => {
			return user.name.first.toLowerCase().includes(query) || user.name.last.toLowerCase().includes(query);
		});
	} else {
		users = [...originalUsers];
	}
	displayUsers();
}

// Navigate back and forth inside the modal
function changeModalPage(event) {
	let userIndex = parseInt(event.currentTarget.dataset.userIndex);
	showUserModal(users[userIndex], userIndex);
}

// Hide user modal when clicking on the close button
document.getElementById('modal-close-btn').addEventListener('click', hideUserModal);

// Filter users when searching
document.getElementById('search-input').addEventListener('input', (e) => {
	let query = document.getElementById('search-input').value;
	filterUsers(query);
});

// Navigate back and forth inside the modal
document.getElementById('modal-prev').addEventListener('click', changeModalPage);
document.getElementById('modal-next').addEventListener('click', changeModalPage);
