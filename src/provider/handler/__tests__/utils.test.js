import { sliceWrap, compareTimes } from '../utils';
describe('sliceWrap', () => {
  it('should return a list of n items wrapping a validated element', () => {
    expect(sliceWrap([])).toEqual([]);
    expect(sliceWrap([1])).toEqual([1]);
    expect(sliceWrap([1, 2], 1)).toEqual([1]);
    expect(sliceWrap([1, 2, 3], 4)).toEqual([1, 2, 3]);
    expect(sliceWrap([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
    expect(sliceWrap([1, 2, 3, 4, 5, 6, 7], 4, val => val === 4)).toEqual([
      3,
      4,
      5,
      6
    ]);
    expect(sliceWrap([1, 2, 3, 4, 5], 1, val => val === 3)).toEqual([3]);
    expect(sliceWrap([1, 2, 3, 4, 5, 6], 3, val => val === 6)).toEqual([
      4,
      5,
      6
    ]);
    expect(sliceWrap([1, 2, 3, 4, 5], 4, val => val === 4)).toEqual([
      2,
      3,
      4,
      5
    ]);
    expect(sliceWrap([1, 2, 3, 4, 5], 2, val => val === 1)).toEqual([1, 2]);
  });
});
