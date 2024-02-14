export function expectResolvedValueEquals(
  spy: jest.SpyInstance,
  expected: unknown
) {
  return expect(spy.mock.results[0]?.value).resolves.toEqual(expected);
}

export function expectResolvedValueMatch(
  spy: jest.SpyInstance,
  expected: object
) {
  return expect(spy.mock.results[0]?.value).resolves.toMatchObject(expected);
}
