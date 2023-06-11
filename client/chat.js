var user = null
    // ___________________________________________________________________
    //user settings page
    // loader...........
var myVar;

function myFunction() {
    myVar = setTimeout(showPage, 350);
}

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("myDiv").style.display = "block";
}

fetch('/user/data', {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        user = data
        console.log(user.photoURL)

        document.getElementById("username").innerHTML = user.username
        document.getElementById("Profile_username").innerHTML = user.username
        document.getElementById('user-photo').src = user.photoURL
        document.getElementById('user_image_toggle').src = user.photoURL
        document.getElementById('user-email').innerHTML = user.email

    })
    .catch(error => {
        console.log(error);
    });
const socket = io();
const messagesList = document.getElementById('messages');
socket.on('previousMessages', (messages) => {
    messages.forEach((message) => {
        const div = document.createElement('div');
        className = user.id == message.sender_id ? "outgoing" : "incoming";
        div.classList.add(className, "message")
        const timestamp = new Date(message.timestamp._seconds * 1000)
        const formattedTimestamp = timestamp.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
        div.innerHTML = `
        <p>${message.content}</p>
        <p class="timestamp">${formattedTimestamp}</p>

        `
        messagesList.appendChild(div);
    });
    scrollToBottom()
});

const chatInput = document.getElementById('chat-input');
const btnMessage = document.getElementById('btn_message');
const sendMessage = () => {
    const message = chatInput.value;
    if (message !== '') {
        socket.emit('chatMessage', message);
        chatInput.value = '';
    }
}
btnMessage.addEventListener('click', (e) => {
    e.preventDefault();
    sendMessage()
});
chatInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') sendMessage()
})

socket.on('chatMessage', (message) => {
    const messagesList = document.getElementById('messages');
    console.log(message)
    className = user.id == message.id ? "outgoing" : "incoming";
    const timestamp = new Date(message.timestamp)
    const formattedTimestamp = timestamp.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    // const li = document.createElement('li');
    // li.textContent = message;
    // messagesList.appendChild(li);
    const div = document.createElement('div');
    div.classList.add(className, "message")
    div.innerHTML = `
        <p>${message.content}</p>
        <p class="timestamp">${formattedTimestamp}</p>
        `
    messagesList.appendChild(div);
    scrollToBottom()
    user.id !== message.id ? document.getElementById("Notification").play() : "";
});

function scrollToBottom() {
    messagesList.scrollTop = messagesList.scrollHeight
}


const toggle_btn = document.getElementById('user_image_toggle')
const profile_menu = document.getElementById('profile-menu');
toggle_btn.addEventListener('click', () => {
    profile_menu.classList.toggle('active');
});
const logout_btn = document.getElementById('btn-logout')
logout_btn.addEventListener('click', () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    fetch('/logout', {
            method: 'POST',
            credentials: 'same-origin' // Include cookies in the request
        })
        .then(response => {
            if (response.ok) {
                // alert('Logout successful')
                // console.log('Logout successful');
                window.location.href = '/'
            } else {
                alert('something went wrong! try again')
                console.log('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
})


const fileInput = document.getElementById('photo');
const profilePhoto = document.getElementById('user-photo');

function createFormData(fieldName, file) {
    const formData = new FormData();
    formData.append(fieldName, file);
    return formData;
}
fileInput.addEventListener('change', function() {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        profilePhoto.src = e.target.result;
        document.getElementById('user_image_toggle').src = e.target.result

    };

    reader.readAsDataURL(file);
    var formData = createFormData('photo', file);
    formData.append("uid", user.id)
    console.log(formData)
    fetch('/updateprofile', {
            method: 'POST',
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.downloadURL);
            // Handle the response data
        })
        .catch(error => {
            console.error('Error uploading photo:', error);
            // Handle the error
        });
});