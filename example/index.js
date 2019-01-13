import MkmApi2 from '../src/index.js';

const api = new MkmApi2({
    //These are just a sandbox credentials
    credentials: {
        appToken: 'qmQXmXKrZ4kFx2Kc',
        appSecret: 'dmE4gHu7fMTgV06l1jpgHuc31gInACum',
        accessToken: 'afikzZqRJhboaipjdwPERcMronCq1JmI',
        accessTokenSecret: 'syOTmQpEptHJ5msBaosR0FHNja0TiOqu'
    },
    sandbox: true});
api.account.getMessages()
    .then(data => console.log(data))
    .catch(error => console.error(error));
