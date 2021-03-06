const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io("/");

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
  users.forEach(user=>{
    if(user.cam ===true){
      addWebcamIcon(user.id)
    }
  })
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
/*=====================================================
video calling
==============================*/
//init peerjs
const myPeer=new Peer({
  host: "/",
  port: "3001",
})
//video
const videoGrid=document.getElementById('video-grid')
//get to call on click
const myVideo=document.createElement('video')
myVideo.muted=true

vidBtn=document.getElementById('video-btn')
vidBtn.addEventListener('click',()=>{
  startCall()
  myPeer.on('open',username=>{
  socket.emit('joinRoom',room,username)
})
})
function startCall(){
  navigator.getWebcam = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({  audio: true, video: true })
    .then(function (stream) {
                  //Display the video stream in the video object
                  addvideostream(myVideo,stream)
                  socket.on('connected',username=>{
                    connectToNewUser(username,stream)
                  })
     })
     .catch(function (e) { logError(e.name + ": " + e.message); });
}
else {
navigator.getWebcam({ audio: true, video: true },
     function (stream) {
             //Display the video stream in the video object
             addvideostream(myVideo,stream)
             socket.on('connected',username=>{
              connectToNewUser(username,stream)
            })
     },
     function () { logError("Web cam is not accessible."); });
}
}


// addvideostream
function addvideostream(video,stream){
  video.srcObject=stream;
  video.addEventListener('loadedmetadata',()=>{
    video.play()
  })
  videoGrid.append(video)
}
function connectToNewUser(username,stream){
  const call=myPeer.call(username,stream)
  const video=document.createElement('video')
  call.on('close',()=>{
    video.remove()
  })

}