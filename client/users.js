let users = [];

async function fetchUsers() {
    try {
        const response = await fetch('/admin/users', { method: 'POST' });
        if (response.ok) {
            const data = await response.json();
            users = data;
            console.log(users);
        } else {
            console.error('Error fetching users:', response.status);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}


// Function to render the user table
function renderUserTable(e) {
    const userTableBody = document.getElementById("userTableBody");

    userTableBody.innerHTML = "";

    users.forEach(user => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = user.username;
        row.appendChild(nameCell);

        const emailCell = document.createElement("td");
        emailCell.textContent = user.email;
        row.appendChild(emailCell);

        const actionsCell = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.classList.add("btn", "btn-primary");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => showEditPopup(user));
        actionsCell.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "btn-secondary");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteUser(user.id));
        actionsCell.appendChild(deleteBtn);

        row.appendChild(actionsCell);

        userTableBody.appendChild(row);
    });
}

// Function to show the create/edit user popup
function showPopup(title, submitHandler) {
    const popupOverlay = document.getElementById("popupOverlay");
    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popupTitle");
    const userForm = document.getElementById("userForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const submitBtn = document.getElementById("submitBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    popupTitle.textContent = title;
    nameInput.value = "";
    emailInput.value = "";

    submitBtn.removeEventListener("click", submitHandler);
    submitBtn.addEventListener("click", submitHandler);

    cancelBtn.addEventListener("click", () => {
        hidePopup();
    });

    popupOverlay.classList.add("visible");
    popup.classList.add("visible");
}

// Function to hide the popup
function hidePopup() {
    const popupOverlay = document.getElementById("popupOverlay");
    const popup = document.getElementById("popup");

    popupOverlay.classList.remove("visible");
    popup.classList.remove("visible");
}

// Function to handle creating a new user
function createUser() {
    const userForm = document.getElementById("userForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (name && email) {
        // Generate a unique ID for the new user (in a real application, this would be done by the server)
        const id = Math.floor(Math.random() * 100000);

        const newUser = {
            id,
            name,
            email
        };
        users.push(newUser);

        renderUserTable();
        hidePopup();
    }
}

// Function to show the edit user popup
function showEditPopup(user) {
    showPopup("Edit User", () => updateUser(user));

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");

    nameInput.value = user.username;
    emailInput.value = user.email;
}

// Function to update an existing user
function updateUser(user) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");

    const newName = nameInput.value.trim();
    const newEmail = emailInput.value.trim();

    if (newName && newEmail) {
        user.name = newName;
        user.email = newEmail;

        renderUserTable();
        hidePopup();
    }
}

// Function to delete a user
function deleteUser(id) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        renderUserTable();
    }
}


// Render the initial table
// }
async function initialize() {
    console.log("waiting")
    await fetchUsers()
    renderUserTable()
    console.log("done")

}
initialize();