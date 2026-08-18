import { describe, expect, it } from 'vitest';
import { LoopDetector } from './loop-detector.js';

describe('loop detector', () => { it('signals at threshold', () => { const detector = new LoopDetector(2); expect(detector.observe('identical_tool_call', 'x')).toBeNull(); expect(detector.observe('identical_tool_call', 'x')?.count).toBe(2); }); });