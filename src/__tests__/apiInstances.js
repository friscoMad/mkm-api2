import { MkmApi } from '../index';

export const client1 = new MkmApi({
    credentials: {
        appToken: process.env.APP_TOKEN_1,
        appSecret: process.env.APP_SECRET_1,
        accessToken: process.env.ACCCESS_TOKEN_1 ? process.env.ACCCESS_TOKEN_1 : '',
        accessTokenSecret: process.env.ACCESS_SECRET_1 ? process.env.ACCESS_SECRET_1 : ''
    },
    sandbox: true
});
export default client1;
