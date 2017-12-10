const PouchDB = require('pouchdb');
const  db = new PouchDB('users');



class Users {
  constructor(){
    this.users = [];
  }
  addUser(id,name,room){
    const user = {_id:id,name,room}
    db.put(user)
    return user;
  }
  removeUser(id){
    return db.get(id).then(user => db.remove(user))
  }
  getUser(id){
    return db.get(id).then(value => {
      return value;
    }).catch(err => err);
  }
  getUserList(room){
    return db.allDocs({
      include_docs: true,
    })
    .then(result => {
      return result.rows
      .map(value => {
        return value.doc
      })
      .filter(value => value.room === room)
      .map(value => value.name)
    })
    .catch(err => err)
  }
}

const userHelper = new Users();

module.exports = {
  userHelper
}
