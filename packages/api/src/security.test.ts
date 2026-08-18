import test from 'node:test';
import assert from 'node:assert/strict';
import { signWebhook, verifyWebhook } from './webhook-signing.js';
test('webhook signatures verify and reject tampering',()=>{const body='{"event":"approval"}',secret='test-secret';const sig=signWebhook(body,secret);assert.equal(verifyWebhook(body,sig,secret),true);assert.equal(verifyWebhook(body+'x',sig,secret),false);});
