import firebase from "../Firebase";
import 'firebase/firestore';

export default class FirestoreService {
    static instance = new FirestoreService();

    static sendFeedback(feedback) {
        return FirestoreService.instance.submitFeedback(feedback);
    }

    submitFeedback(feedback) {
        console.log("Sending feedback to Firestore");
        const db = firebase.firestore();
        return new Promise((resolve, reject) => {
            db.collection("feedback").add({
                generic_feedback_response: feedback
            }).then(() => {
                console.log("Feedback submitted.");
                resolve(true);
            }).catch((err) => {
                console.log("Error submitting feedback: " + err);
                reject(err);
            });
        });
    }
}