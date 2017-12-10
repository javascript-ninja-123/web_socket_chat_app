var socket = io();

var finalCode;

socket.on('connect', function(){
  console.log('logged in')
})


socket.on('disconnect', function(){
  console.log('server is down')
})

socket.on('codeNumber',function(code){
   finalCode =code.code;
})

socket.on('newMessage', function(message){
  textGenerator(message.from,message.text,message.createdAt)
  scroll();
})


socket.on('newLocation', function(location){
  locationGenerator(location.from,location.url)
  scroll();
})

socket.on('updateUserList', function(userList){
  userGenerator(userList)
})




function socketPromise(name,fn,arr1,arr2,arr3){
  return new Promise((resolve,reject) => {
    if(typeof arr1 !== 'string' || typeof arr2 !== 'string'){
      return reject('Type string')
    }
    else if(arr1.trim().length <= 0 || arr2.trim().length <=0){
      return reject('type something');
    }
      socket.emit(name,fn(arr1,arr2,arr3),function(data){
        if(data.status){
          resolve();
        }
        else{
          return reject(data)
        }
      })
  })
}

function geolocationPromise(fn){
  return new Promise(resolve => {
    resolve(fn());
  })
}


////vue js
var app = new Vue({
  el: '#app',
  data: {
    name:'',
    room:'',
    buttonText:'Enter',
    vertifyButton:'Verify Email',
    codeButton:'Type code',
    ok:true,
    userName:'',
    userRoom:'',
    text:'',
    afterVertification:false,
    codeNumber:false,
    code:'',
    emaiButton:true
  },
  methods:{
    verifyEmail: function(){
      if(!this.name.includes('@')){
        this.vertifyButton = 'type Email Address'
      }
      else{
        socket.emit('verifyEmail',sendEmail(this.name))
        this.codeNumber = true;
        this.emaiButton = false;
      }
    },
    verifyCode: function(){
      if(parseInt(this.code) === parseInt(finalCode)){
        this.afterVertification = true;
        this.codeNumber = false;
      }
      else{
        this.codeButton ='wrong code'
      }
    },
    enterChatRoom: function(){
      this.buttonText='Enter';
      socketPromise('newUser',generateUser,this.name,this.room)
      .then(() => {
        this.userName = this.name;
        this.userRoom = this.room;
        this.name = '';
        this.room= '';
      })
      .then(() => this.ok = false)
      .catch(err => this.buttonText = err)
    },
    sendMessage: function(){
      socketPromise('createMessage',generateMessage,this.userName,this.text,this.userRoom)
      .then(() => {
        this.text = ''
      })
    },
    sendLocation:function(){
      generateLocation()
      .then(location => Object.assign(location,{user:this.userName, room:this.userRoom}))
      .then(location => socket.emit('shareLocation',location))
    }
  }
})
