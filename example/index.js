import MkmApi2 from '../src/index.js';

const api = new MkmApi2({
    //These are just a sandbox credentials
    credentials: {
        appToken: '',
        appSecret: '',
        accessToken: '',
        accessTokenSecret: ''
    },
    sandbox: true});
api.account.getMessages()
    .then(data => console.log(data))
    .catch(error => console.error(error));
