import { sanitizeEmail, paginate } from '../../src/utils/helpers';

describe('helpers', () => {
  describe('sanitizeEmail', () => {
    it('should lowercase and trim email', () => {
      expect(sanitizeEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com');
    });

    it('should handle already sanitized email', () => {
      expect(sanitizeEmail('user@example.com')).toBe('user@example.com');
    });
  });

  describe('paginate', () => {
    it('should return correct pagination meta', () => {
      const items = [1, 2, 3];
      const result = paginate(items, 30, 2, 10);
      expect(result.data).toEqual(items);
      expect(result.meta).toEqual({
        page: 2,
        limit: 10,
        total: 30,
        totalPages: 3,
      });
    });

    it('should calculate total pages correctly', () => {
      const result = paginate([], 25, 1, 10);
      expect(result.meta?.totalPages).toBe(3);
    });

    it('should handle single page', () => {
      const result = paginate([1, 2], 2, 1, 20);
      expect(result.meta?.totalPages).toBe(1);
    });
  });
});
