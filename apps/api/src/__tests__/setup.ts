import { beforeEach } from 'vitest';
import { db } from '../database/index.js';

beforeEach(() => {
  db.reset();
});
