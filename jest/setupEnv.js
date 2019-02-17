if (process.env.LIVE_TEST) {
    console.log('TESTING WITH LIVE DATA');
    require('dotenv-safe').config();
}
