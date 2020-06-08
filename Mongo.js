import {AnonymousCredential, Stitch} from 'mongodb-stitch-react-native-sdk'

Stitch.initializeDefaultAppClient("clipp_backend-faxnx").then(client => {
    client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
        console.log("logged in with", user.id);
    }).catch(err => {
        console.log(err)
    });
});

export default Stitch;