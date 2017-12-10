const moment = require('moment')

const generateMessage = (from,text) => {
  const time = moment().format('MMMM Do YYYY, h:mm:ss a')
  return{
    from,
    text,
    createdAt:time
  }
}
const sendMessage = (from,text,createdAt) => {
  return{
    from,
    text,
    createdAt
  }
}

const sendLocation = (from,url) => {
  return {
    from,
    url
  }
}


module.exports = {
  generateMessage,
  sendMessage,
  sendLocation
}
