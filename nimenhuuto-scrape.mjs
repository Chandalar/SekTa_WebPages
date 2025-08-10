// nimenhuuto-scrape.mjs
// Täysin itsenäinen Playwright-scraperi: top20 harkat, pelit ja OUT
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

// -------- CLI --------
function arg(name, def = undefined) {
  const i = process.argv.findIndex(a => a === `--${name}`);
  if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) return process.argv[i + 1];
  return process.env[`NH_${name.toUpperCase()}`] ?? def;
}
const URL = arg('url') || 'https://sekta.nimenhuuto.com/enrollments';
const EMAIL = arg('email', '');
const PASSWORD = arg('password', '');
const FROM = arg('from', ''); // YYYY-MM-DD
const TO = arg('to', '');     // YYYY-MM-DD
const HEADFUL = process.argv.includes('--headful');
const SLOWMO = Number(arg('slowmo', '0')) || 0;

// -------- helpers --------
async function loginIfNeeded(page) {
  // Jos sivu ohjaa login-sivulle, täytetään kentät
  // Yritetään yleisiä label/placeholdereita
  const emailInput = page.getByPlaceholder(/sähköposti|email/i).first().or(page.getByLabel(/sähköposti|email/i).first());
  const passInput = page.getByPlaceholder(/salasana|password/i).first().or(page.getByLabel(/salasana|password/i).first());
  if (await emailInput.count() && await passInput.count()) {
    if (!EMAIL || !PASSWORD) throw new Error('Kirjautumissivu löytyi, mutta email/salasana puuttuu (--email --password).');
    await emailInput.fill(EMAIL);
    await passInput.fill(PASSWORD);
    // etsi nappi "Kirjaudu" tai vastaava
    const loginBtn = page.getByRole('button', { name: /kirjaudu|login|sign in/i }).first();
    if (await loginBtn.count()) {
      await Promise.all([page.waitForLoadState('networkidle'), loginBtn.click()]);
    } else {
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    }
  }
}

async function setDateRange(page) {
  if (!FROM && !TO) return;

  // Koitetaan löytää kaksi päivämääräkenttää:
  const dateInputs = page.locator('input[type="date"]');
  if (await dateInputs.count() >= 2) {
    if (FROM) await dateInputs.nth(0).fill(FROM);
    if (TO) await dateInputs.nth(1).fill(TO);
    return;
  }

  // Fallback: tekstikentät päivän alku/loppu
  const start = page.locator('input[name*="start" i], input[id*="start" i], input[placeholder*="alka" i], input[placeholder*="start" i]').first();
  const end   = page.locator('input[name*="end" i], input[id*="end" i], input[placeholder*="loppu" i], input[placeholder*="end" i]').first();
  if (FROM && await start.count()) await start.fill(FROM);
  if (TO && await end.count()) await end.fill(TO);
}

async function toggleTypes(page, { harkka, matsi, muu }) {
  async function setCheckbox(labelRegex, on) {
    const cb = page.getByRole('checkbox', { name: labelRegex });
    if (await cb.count()) {
      if (on) await cb.check().catch(()=>{});
      else await cb.uncheck().catch(()=>{});
    } else {
      // fallback label -> input
      const label = page.locator('label', { hasText: labelRegex });
      if (await label.count()) {
        const forId = await label.getAttribute('for');
        if (forId) {
          const input = page.locator(`#${forId}`);
          if (await input.count()) await input.evaluate((el, on) => { el.checked = !!on; el.dispatchEvent(new Event('change', { bubbles: true })); }, on);
        }
      }
    }
  }
  await setCheckbox(/harkka|harjoit/i, !!harkka);
  await setCheckbox(/matsi|ottelu|peli/i, !!matsi);
  await setCheckbox(/muu/i, !!muu);
}

async function toggleInOut(page, mode /* 'in'|'out' */) {
  const inRadio  = page.getByRole('radio', { name: /\bIn\b/i });
  const outRadio = page.getByRole('radio', { name: /\bOut\b/i });
  if (mode === 'in' && await inRadio.count())  await inRadio.check().catch(()=>{});
  if (mode === 'out' && await outRadio.count()) await outRadio.check().catch(()=>{});
}

async function clickCalculate(page) {
  // Klikkaa "Laske ilmoittautumiset"
  const btn = page.getByRole('button', { name: /laske ilmoittautumiset/i }).first();
  const fallback = page.locator('button:has-text("Laske ilmoittautumiset")').first();
  if (await btn.count()) {
    await Promise.all([page.waitForLoadState('networkidle'), btn.click()]);
  } else if (await fallback.count()) {
    await Promise.all([page.waitForLoadState('networkidle'), fallback.click()]);
  } else {
    throw new Error('“Laske ilmoittautumiset” -nappia ei löytynyt.');
  }

  // odota renderöintiä ja scrollaa alas
  await page.waitForTimeout(700);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForSelector('text=Ilmoittautumiset', { timeout: 8000 }).catch(()=>{});
}

async function parseList(page) {
  // Palauttaa: Map(nimi -> lukumäärä)
  const rows = await page.evaluate(() => {
    function pickRoot() {
      // Etsi osio joka sisältää otsikon/tekstin "Ilmoittautumiset" ja taulukon tai listan
      const nodes = Array.from(document.querySelectorAll('section, main, .container, .content, body'));
      for (const el of nodes) {
        const txt = (el.innerText || '').toLowerCase();
        if (txt.includes('ilmoittautumiset') && (el.querySelector('table') || el.querySelector('ol,ul'))) {
          return el;
        }
      }
      return document.body;
    }

    const out = [];
    const root = pickRoot();

    // 1) Taulukko
    const table = root.querySelector('table');
    if (table) {
      table.querySelectorAll('tr').forEach(tr => {
        const cells = Array.from(tr.querySelectorAll('td,th')).map(td => (td.innerText || '').trim());
        if (cells.length >= 2) {
          let name = cells[0].replace(/^[0-9.\s🏅🥈🥉-]+/, '').trim();
          const count = Number((cells[1] || '').replace(/[^0-9]/g, ''));
          if (name && Number.isFinite(count)) out.push([name, count]);
        }
      });
      if (out.length) return out;
    }

    // 2) Järjestetty lista (ol/ul)
    const list = root.querySelector('ol, ul');
    if (list) {
      list.querySelectorAll('li').forEach(li => {
        const txt = (li.innerText || '').trim();
        // Esim "1. Mika Aaltonen 74"
        const m = txt.match(/^(?:\d+[.)\s-]+)?(.+?)\s+(\d+)$/);
        if (m) {
          const name = m[1].replace(/[🏅🥈🥉•\s]+$/,'').trim();
          const count = Number(m[2]);
          if (name && Number.isFinite(count)) out.push([name, count]);
        }
      });
    }
    return out;
  });

  return new Map(rows);
}

function top20(map) {
  return [...map.entries()].filter(([n]) => n).sort((a,b)=>b[1]-a[1]).slice(0,20);
}
function saveCSV(name, rows) {
  const csv = ['Nimi;Lukumäärä', ...rows.map(([n,c]) => `${n};${c}`)].join('\n');
  if (!fs.existsSync('out')) fs.mkdirSync('out');
  fs.writeFileSync(path.join('out', name), csv, 'utf8');
}

// Yksi ajokerta tietyillä filtreillä
async function runOne(page, { label, inOut, types }) {
  await toggleInOut(page, inOut);
  await toggleTypes(page, types);
  await setDateRange(page);
  await clickCalculate(page);
  const map = await parseList(page);
  return { label, map };
}

// -------- main --------
(async () => {
  const browser = await chromium.launch({ headless: !HEADFUL, slowMo: SLOWMO || 0 });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await loginIfNeeded(page);
  // jos login redirect, varmistetaan että ollaan enrollments-sivulla
  if (!page.url().includes('/enrollments')) await page.goto(URL, { waitUntil: 'domcontentloaded' });

  // Aja 3 näkymää:
  const results = {};
  results.harkkaIn = await runOne(page, { label: 'Harjoitukset (IN)', inOut: 'in',  types: { harkka:true, matsi:false, muu:false } });
  results.matsiIn  = await runOne(page, { label: 'Matsit (IN)',       inOut: 'in',  types: { harkka:false, matsi:true,  muu:false } });
  results.outAll   = await runOne(page, { label: 'OUT (kaikki)',      inOut: 'out', types: { harkka:true,  matsi:true,  muu:true  } });

  const t1 = top20(results.harkkaIn.map);
  const t2 = top20(results.matsiIn.map);
  const t3 = top20(results.outAll.map);

  saveCSV('top20_harjoitukset.csv', t1);
  saveCSV('top20_pelit.csv', t2);
  saveCSV('top20_out.csv', t3);

  console.log('\nTop 20 harjoituskävijät:');
  console.table(t1.map(([n,c])=>({ Nimi:n, Käynnit:c })));
  console.log('\nTop 20 pelikäynnit:');
  console.table(t2.map(([n,c])=>({ Nimi:n, Käynnit:c })));
  console.log('\nTop 20 OUT-ilmoitukset:');
  console.table(t3.map(([n,c])=>({ Nimi:n, OUT_ilmoitukset:c })));
  console.log('\n✅ CSV:t kirjoitettu out/-kansioon');

  await browser.close();
})().catch(err => {
  console.error('💥 Virhe:', err.message);
  process.exit(1);
});
