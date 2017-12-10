function generateUser(userName,chatRoom){
  return {
    user:userName,
    room:chatRoom
  }
}
function generateMessage(from,text,room){
  return {
    from:from,
    text:text,
    room:room,
    cretedAt:moment().format('h:mm:ss a')
  }
}

function sendEmail(email){
  return{
    email:email
  }
}

function scrolltoBottom(){
  var messages = document.querySelector('#chatRoom');
 messages.scrollTop = messages.scrollHeight;
}


function scroll(){
  var messages = document.querySelector('#chatRoom');
  var shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;
  if(!shouldScroll){
    scrolltoBottom();
  }
}

function generateLocation(){
  if(!navigator.geolocation){
    return 'you cannot share your geolocation. Download Chrome!'
  }
  else{
    return new Promise(resolve => {
       navigator.geolocation.getCurrentPosition(function(position){
         resolve(
            {
             latitude:position.coords.latitude,
             longitude:position.coords.longitude,
             url:`http://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
           }
         )
       })
    })
  }
}


function textGenerator(from,text,createdAt){
    var ul = document.querySelector('#chatList')
    var li = `
      <li>
        <p class='userText'>${from} - ${createdAt}</p>
        <p>${text}</p>
      </li>
    `
    ul.insertAdjacentHTML('beforeend',li);
}

function locationGenerator(from,url){
  var ul = document.querySelector('#chatList')
  var li = `
    <li>
      <p>${from} shared his location</p>
      <a target='_blank' href=${url}>location link</a>
    </li>
  `
  ul.insertAdjacentHTML('beforeend',li);
}

function userGenerator(users){
    var ul = document.querySelector('#userList')
    let newPromise = new Promise(resolve => {
      ul.innerHTML = '';
      resolve();
    })
    newPromise.then(() => {
      users.map(value => {
        var li =`
          <li>
            <p>${value}</p>
          </li>
        `
          ul.insertAdjacentHTML('beforeend',li);
      })
    })
}
