import firebase from "../Firebase.js";

export default class MessagingServices {
  static instance = new MessagingServices();

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  
  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('messages');
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
    
  async retrieveAllChatsForUser() {
    console.log("Retrieving all chats for user");
    var user = firebase.auth().currentUser;
    console.log(user);

    var username = user.email;
    username = username.substring(0, username.indexOf('@'));
    const db = firebase.firestore();
    console.log("Retrieving chats for username: ", username);
    console.log(typeof(username));

    let user1_snapshot = await db.collection('chatrooms').where('user1', '==', username).get();
    let user2_snapshot = await db.collection('chatrooms').where('user2', '==', username).get();

    let user1_matches =  user1_snapshot.docs.map(doc => doc.data().user2);
    let user2_matches =  user2_snapshot.docs.map(doc => doc.data().user1);
    
    let chats = [...user1_matches, ...user2_matches];
    return chats;
  }

  async start_chat(recipient_username, matched_description, matched_name, item_name, item_description) {
    console.log("Sharting new chat")
    console.log(recipient_username)

    var user = firebase.auth().currentUser;
    var username = user.email
    username = username.substring(0, username.indexOf('@'));
    console.log(username)
    var db = firebase.firestore();

    var user = firebase.auth().currentUser;
    var username = user.email;
    username = username.substring(0, username.indexOf('@'));
    let initial_message = {
      id: Date.now(),
      text: `We've matched on the items: ${matched_name} and ${item_name}. 
      ${matched_name}: ${matched_description}. ${item_name}: ${item_description}`,
      timestamp: new Date(),
      user: {
        name: username,
        _id: user.uid
      },
      updated: username,
    }

    let chat_room = username < recipient_username ? username + recipient_username : recipient_username + username;
    let chat_snapshot = await db.collection('chatrooms').where('combined_user_id', '==', chat_room).get()

    // See if the chat has already been created
    if (chat_snapshot.docs.length !== 0) {
      this.concat(initial_message, recipient_username)
      return
    }

    return new Promise ( (resolve, reject) => {

      console.log("Creating new chat here")
      // Creates a new chat to which values will later be added
      var new_chat = db.collection("chatrooms").doc();

      // Initializes the values for the chat between the two users
      if (username < recipient_username) {
          new_chat.set({
              chatroom_name: username + " and " + recipient_username,
              combined_user_id: username + recipient_username,
              user1: username,
              user2: recipient_username
          })
          .then(()=>{
            Promise.all(promises)
            .then(async ()=>{
              await new_chat.collection('messages').add(initial_message)
              resolve()
            })
          })
          .catch(err => {
              reject(err)
          })
      }
      else {
          new_chat.set({
              chatroom_name: recipient_username + " and " + username,
              combined_user_id: recipient_username + username,
              user1: recipient_username,
              user2: username
          })
            then(()=>{
            Promise.all(promises)
            .then(async ()=>{
              await new_chat.collection('messages').add(initial_message)
              resolve()
            })
          })
          .catch(err => {
              reject(err)
          })
      }
    })
  }

    getMessages = (callback, username, recipient_username) => {
      return new Promise((resolve, reject) => {

        var db = firebase.firestore();
        
        let chat_room = username < recipient_username ? username + recipient_username : recipient_username + username;
        console.log("Retrieving from chat_room: ", chat_room);
        db.collection("chatrooms")
          .where("combined_user_id", "==", chat_room)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc =>{
              db.collection("chatrooms").doc(doc.id).update({updated: false, updatedUser: ''});
              db.collection("chatrooms").doc(doc.id).collection("messages")
              .orderBy('timestamp')
              .onSnapshot(snapshot => {
                const changes = snapshot.docChanges();
                changes.forEach(change => callback(this.parseMsgsFromFirestore(change)));
              })
            })
          })
          .catch((err) => {
            reject(err)
          })
        })
    };

    sendMessages (messages, recipient_username) {
      // sending only specific properties to firestore
      console.log("Sending message now ", messages)
      for (let i = 0; i < messages.length; i++) {
        const { text, user, _id: id } = messages[i];
        const message = {
          id,
          text,
          user,
          timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
        };
        console.log("Adding message to concat")
        this.concat(message, recipient_username);
        //send_message(message);
      }
    };

    concat (message, recipient_username) {
      return new Promise ( (resolve, reject) => {
        var user = firebase.auth().currentUser;
        console.log(user)
          
        var username = user.email
        username = username.substring(0, username.indexOf('@'));

        let chat_room = username < recipient_username ? username + recipient_username : recipient_username + username;
        console.log("Sending message to chat_room: ", chat_room);

        var db = firebase.firestore();

        promises = []

        
          console.log("one")
          db.collection("chatrooms")
          .where("combined_user_id", "==", chat_room)
          .get()
          .then(querySnapshot => {
            console.log("Found chat")
            querySnapshot.forEach(doc => {
                console.log("Sending message--------------------: ", message);
                promises.push(db.collection("chatrooms").doc(doc.id).collection("messages").add(message));
                promises.push(db.collection('chatrooms').doc(doc.id).update({updated: true, updatedUser: username}))
            });
          })
          .then(()=>{
            Promise.all(promises)
            .then(()=>{
              resolve()
            })
          })
          .catch(err => {
              reject(err)
          })
      })
    };

static start_chat(recipient_username, matched_description, matched_name, item_name, item_description) {return MessagingServices.instance.start_chat(recipient_username, matched_description, matched_name, item_name, item_description)};
static retrieveAllChatsForUser = async () => await MessagingServices.instance.retrieveAllChatsForUser()
static getMessages (callback, username, recipient_username) {return MessagingServices.instance.getMessages(callback, username, recipient_username)}
static sendMessages (messages, recipient_username) {MessagingServices.instance.sendMessages(messages, recipient_username)}
}
