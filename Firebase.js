import firebase from 'firebase'

app_config = {
   apiKey: "AIzaSyAfdaE3begE1Q6qq66xVzMVA4Oud7kuz7k",
   authDomain: "clipp-app-439ac.firebaseapp.com",
   databaseURL: "https://clipp-app-439ac.firebaseio.com",
   projectId: "clipp-app-439ac",
   storageBucket: "gs://clipp-app-439ac.appspot.com/",
   messagingSenderId: "316245243814",
   appId: "1:316245243814:web:71c22dde54dea3c45a4167"
}

firebase.initializeApp(app_config)
export default firebase