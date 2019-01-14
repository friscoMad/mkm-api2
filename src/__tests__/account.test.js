import MkmApi from '../index.js';

const api = new MkmApi({
    //These are just a sandbox credentials
    credentials: {
        appToken: 'qmQXmXKrZ4kFx2Kc',
        appSecret: 'dmE4gHu7fMTgV06l1jpgHuc31gInACum',
        accessToken: 'afikzZqRJhboaipjdwPERcMronCq1JmI',
        accessTokenSecret: 'syOTmQpEptHJ5msBaosR0FHNja0TiOqu'
    },
    sandbox: true});

test('get Account works', () => {
    return api.account.get().then(data => expect(data).toHaveProperty('account'));
});

test('set Vacation Mode', async () => {
    expect.assertions(2);
    await api.account.setVacationMode(true);
    let response = await api.account.get();
    expect(response.account.onVacation).toBe(true);
    await api.account.setVacationMode(false);
    response = await api.account.get();
    expect(response.account.onVacation).toBe(false);
});

test('setLanguage', async () => {
    expect.assertions(2);
    await api.account.setLanguage(1);
    let response = await api.account.get();
    console.log(response.account);
    expect(response.account.idDisplayLanguage).toBe(1);
    await api.account.setLanguage(3);
    response = await api.account.get();
    expect(response.account.idDisplayLanguage).toBe(3);
});

describe.skip('username/password reset', () => {
    let account;

    beforeAll(async () => {
        let response = await api.account.get();
        account = response.account;
    });

    it('must work with email', () => {
        return api.account.resetPassword(account.email);
    });

    it('must work with username', () => {
        return api.account.resetPassword(null, account.username);
    });

    it('must throw if nothing is passed', async () => {
        expect.assertions(1);
        try {
            await api.account.resetPassword();
        } catch (e) {
            expect(e).toBeDefined();
        }
    });

    it('must recover the username', () => {
        return api.account.recoverUsername(account.email);
    })

});
