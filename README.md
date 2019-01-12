## mkm-api2

JS library for accessing MKM api, it does work on Node.js and browser and it is hevily based on vrBaena/node-mkm-api.

The code uses JS Classes and promises for the results.

Minimal usage example (import the module as you need)

'''javascript
import MkmApi from 'mkm-api2';

const api = new MkmApi({
    credentials: {
        appToken: '',
        appSecret: '',
        accessToken: '',
        accessTokenSecret: ''
    },
    sandbox: true});

api.account.get()
    .then(data => console.log(data))
    .catch(error => console.error(error));
//Or

await userData = api.account.get();
console.log(userData);
'''

Latest docs are available on: https://friscomad.github.io/mkm-api2/latest
