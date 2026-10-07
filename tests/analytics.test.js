import test from 'node:test';
import assert from 'node:assert/strict';
import {visitURL} from '../src/analytics.js';
test('only the canonical HTTPS demo sends a fixed page and origin-only source',()=>{
 const u=new URL(visitURL('https://csv-example.goatcounter.com', 'https://jiaozenghao.github.io/csv-delta/?secret=x#private','https://example.com/private?q=secret',{}));
 assert.equal(u.searchParams.get('p'),'/csv-delta/');
 assert.equal(u.searchParams.get('r'),'https://example.com');
 assert.ok(!u.href.includes('secret'));
});
test('local, unrelated, opted-out and invalid endpoints never send visits',()=>{
 for(const loc of ['http://localhost:4173/','file:///tmp/report.html','https://evil.test/csv-delta/','https://jiaozenghao.github.io/other/']) assert.equal(visitURL('https://csv-example.goatcounter.com',loc,'',{}),null);
 for(const endpoint of ['', 'http://csv-example.goatcounter.com','https://evil.test','https://a.goatcounter.com/private']) assert.equal(visitURL(endpoint,'https://jiaozenghao.github.io/csv-delta/','',{}),null);
 for(const privacy of [{doNotTrack:'1'},{globalPrivacyControl:true}]) assert.equal(visitURL('https://a.goatcounter.com','https://jiaozenghao.github.io/csv-delta/','',privacy),null);
});
test('tutorial visits use fixed paths and omit queries, fragments and private referrer paths',()=>{
 for(const path of ['/csv-delta/guides/compare-csv.html','/csv-delta/guides/compare-csv.zh-CN.html']) {
  const url=new URL(visitURL('https://a.goatcounter.com',`https://jiaozenghao.github.io${path}?secret=x#private`,'https://example.com/private?q=secret',{}));
  assert.equal(url.searchParams.get('p'),path);
  assert.equal(url.searchParams.get('r'),'https://example.com');
  assert.ok(!url.href.includes('secret'));
  for(const privacy of [{doNotTrack:'1'},{globalPrivacyControl:true}]) assert.equal(visitURL('https://a.goatcounter.com',`https://jiaozenghao.github.io${path}`,'',privacy),null);
 }
 assert.equal(visitURL('https://a.goatcounter.com','https://jiaozenghao.github.io/csv-delta/guides/private.html','',{}),null);
});
