import api from './apiInstances';

test.nock('get Account works', () => {
    return api.account.get().then(data => expect(data).toHaveProperty('account'));
});

test.nock('set Vacation Mode', async () => {
    expect.assertions(2);
    await api.account.setVacationMode(true);
    let response = await api.account.get();
    expect(response.account.onVacation).toBe(true);
    await api.account.setVacationMode(false);
    response = await api.account.get();
    expect(response.account.onVacation).toBe(false);
});

test.nock('setLanguage', async () => {
    expect.assertions(2);
    await api.account.setLanguage(1);
    let response = await api.account.get();
    console.log(response.account);
    expect(response.account.idDisplayLanguage).toBe(1);
    await api.account.setLanguage(3);
    response = await api.account.get();
    expect(response.account.idDisplayLanguage).toBe(3);
});

//Not sure why those are not working unless using fully authneticated data as it makes no sense
describe.only('username/password reset', () => {
    let account = {
        email: 'rapariciog@gmail.com',
        username: 'friscoTest'
    }

    // beforeAll.nock(async () => {
    //     let response = await api.account.get();
    //     account = response.account;
    // });

    it.nock('must work with email', () => {
        return api.account.resetPassword(account.email);
    });

    it.nock('must fail with random email', async () => {
        expect.assertions(1);
        try {
            await api.account.resetPassword('this.do.not@exists.com');
        } catch (e) {
            expect(e).toBeDefined();
        }
    });

    it.nock('must work with username', () => {
        return api.account.resetPassword(null, account.username);
    });

    it.nock('must fail with random username',  async () => {
        expect.assertions(1);
        try {
            await api.account.resetPassword('this.do.not.exists.com');
        } catch (e) {
            expect(e).toBeDefined();
        }
    });

    it.nock('must throw if nothing is passed', async () => {
        expect.assertions(1);
        try {
            await api.account.resetPassword();
        } catch (e) {
            expect(e).toBeDefined();
        }
    });

    it.nock('must recover the username', () => {
        return api.account.recoverUsername(account.email);
    })

    it.nock('must not recover with random username', async () => {
        expect.assertions(1);
        try {
            await api.account.recoverUsername('this.do.not.exists.com');
        } catch (e) {
            expect(e).toBeDefined();
        }
    });

});

describe('coupons', () => {
    it.only.nock('should redeem a coupon', () => {
        return api.account.redeemCoupon('ZWIKVUPS')
    });

    it.only.nock('should redeem multiple coupons', () => {
        return api.account.redeemCoupon(['ZWIKVUPS', 'AAXUUQCD'])
    });

})
