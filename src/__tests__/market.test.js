import api from './apiInstances';

it.nock('return games', () => {
    return api.market.getGames();
});
