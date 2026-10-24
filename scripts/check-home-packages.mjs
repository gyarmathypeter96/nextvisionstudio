import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.equal([...html.matchAll(/data-monthly-plan="/g)].length, 3);
for (const [id,name,price,count] of [
  ['starter','Starter Package','350',4],
  ['monthly','Full Monthly Content','450',8],
  ['growth','Growth Package','600',12],
]) {
  const card = html.match(new RegExp(`<article[^>]*data-monthly-plan="${id}"[^>]*>([\\s\\S]*?)<\\/article>`))?.[1];
  assert.ok(card, `Missing ${id}`);
  for (const text of [name,`€${price}`,'/ month','+ VAT','Strategic content planning','Half day filming at your business',`${count} short form videos`]) assert.ok(card.includes(text),`${id} missing ${text}`);
  assert.ok(card.includes('href="#contact-form"'));
  assert.ok(card.includes(`data-content-plan="${id}"`));
  assert.equal(card.includes('Most popular'), id === 'monthly');
  assert.equal(card.includes('Halloween offer'), id === 'monthly');
}
assert.ok(!html.includes('From a clear plan to content that brings in enquiries.'));
assert.ok(html.includes('name="content_package"'));
assert.ok(html.includes('value="Monthly Social Media Content"'));
assert.ok(html.includes('data-package-summary'));
assert.ok(html.includes('nvs-logo-transparency'));
assert.ok(html.includes('/images/clients/saxoo-london.png'));
const source = await readFile(new URL('../src/components/MonthlyContentPackages.astro',import.meta.url),'utf8');
assert.ok(source.includes('prefers-reduced-motion: reduce'));
assert.ok(source.includes('summary.hidden = false'));
assert.ok(source.includes('service.value = "Monthly Social Media Content"'));
const oldPrices = await readFile(new URL('../dist/how-much-does-a-videographer-cost-in-dublin/index.html',import.meta.url),'utf8');
for (const [videos, amount] of [[4,'€350'],[8,'€450'],[12,'€600']]) assert.ok(oldPrices.includes(amount) && oldPrices.includes(`${videos} short videos`), `Pricing guide must show the ${videos} video monthly package at ${amount}`);
assert.ok(oldPrices.includes('€1,200'), 'Managed social price must remain intact');
assert.ok(!oldPrices.includes('12 short video edits') && !oldPrices.includes('8 short video edits'), 'Editing-only packages must not undercut the monthly packages');
const formHtml = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.ok(formHtml.includes('Monthly video packages from €350 + VAT'), 'Quote form must show the new starting price');
console.log('PASS: 3 monthly packages, approved prices/scope, middle Halloween feature, form mapping, logo treatment, reduced motion and separate existing rates.');
