import firebase from '../Firebase.js';

export default class AuthService {
  static instance = new AuthService();

  signUp(user_info) {
    console.log('signing up', user_info);
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user_info.email, user_info.password)
        .then(() => {
          console.log('User Created Successfully');
          user = firebase.auth().currentUser;
          user.updateProfile({
            displayName: user_info.name,
          });
        })
        .then(() => {
          console.log('User Updated Successfully');
          thing = firebase.auth().currentUser;
          resolve(thing);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  login(user_info) {
    console.log('logging in', user_info);
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(user_info.email, user_info.password)
        .then(() => {
          console.log('User Signed In Successfully');
          user = firebase.auth().currentUser;
        })
        .then(() => {
          resolve(user);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  checkLoggedIn() {
    if (firebase.auth().currentUser == null) {
      return false;
    } else {
      return true;
    }
  }

  signout() {
    console.log('signing out');
    return firebase.auth().signOut();
  }

  deleteAccount() {
    console.log('deleting account');
    user = firebase.auth().currentUser;
    return user.delete();
  }

  static signUp(user_info) {
    return AuthService.instance.signUp(user_info);
  }
  static login(user_info) {
    return AuthService.instance.login(user_info);
  }
  static checkLoggedIn() {
    return AuthService.instance.checkLoggedIn();
  }
  static signout() {
    return AuthService.instance.signout();
  }
  static deleteAccount() {
    return AuthService.instance.deleteAccount();
  }
}
