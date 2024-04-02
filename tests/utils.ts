export function expectResolved(spy: jest.SpyInstance) {
  return expect(spy.mock.results[0]?.value).resolves;
}

export function expectNthResolved(spy: jest.SpyInstance, n: number) {
  return expect(spy.mock.results[n - 1]?.value).resolves;
}
