import { describe, it, expect } from 'vitest';
import { generateId } from '../../utils/generateId.js';

describe('generateId', () => {
  it('should return a string', () => {
    const id = generateId();

    expect(typeof id).toBe('string');
  });

  it('should return a valid UUID format', () => {
    const id = generateId();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    expect(id).toMatch(uuidRegex);
  });

  it('should generate unique IDs', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }

    expect(ids.size).toBe(100);
  });
});
