import { cn } from '../../lib/utils';

describe('cn utility function', () => {
  it('combines multiple class names', () => {
    expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
  });

  it('filters out falsy values', () => {
    expect(cn('class1', false, 'class2', null, undefined, 'class3')).toBe('class1 class2 class3');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });

  it('handles all falsy values', () => {
    expect(cn(false, null, undefined)).toBe('');
  });

  it('handles single class name', () => {
    expect(cn('single-class')).toBe('single-class');
  });

  it('handles conditional class names', () => {
    const isActive = true;
    const isDisabled = false;

    expect(cn('base-class', isActive && 'active', isDisabled && 'disabled')).toBe('base-class active');
  });
});
