import RequestHandler from './requestHandler';

test('constructor works', () => {
    let instance = new RequestHandler();
    expect(instance.useJson).toBe(false);
    expect(instance.sandbox).toBe(false);
    instance = new RequestHandler(true, false);
    expect(instance.useJson).toBe(true);
    expect(instance.sandbox).toBe(false);
    instance = new RequestHandler(false, true);
    expect(instance.useJson).toBe(false);
    expect(instance.sandbox).toBe(true);
})

test('getBaseUrl works', () => {
    let instance = new RequestHandler();
    expect(instance.getBaseUrl()).toBe('https://api.cardmarket.com/ws/v2.0/');
    instance = new RequestHandler(true);
    expect(instance.getBaseUrl()).toBe('https://api.cardmarket.com/ws/v2.0/output.json/');
    instance = new RequestHandler(false, true);
    expect(instance.getBaseUrl()).toBe('https://sandbox.cardmarket.com/ws/v2.0/');
    instance = new RequestHandler(true, true);
    expect(instance.getBaseUrl()).toBe('https://sandbox.cardmarket.com/ws/v2.0/output.json/');
})
