// 펫 스킨(옛 → 새)에서 추가된 data-cms 속성을 우리 파일의 같은 자리 태그에 붙인다.
// 사용: node port-attrs.js <펫 옛 파일> <펫 새 파일> <우리 파일>
// 방식: 여는 태그를 순서대로 뽑아 "태그이름 + class" 로 짝을 맞춘다 (LCS). 옛→새에서 늘어난 속성을 우리 태그에 추가.
const fs = require('fs');
const [,, oldF, newF, ourF] = process.argv;
const TAG = /<([a-zA-Z][a-zA-Z0-9-]*)(\s[^<>]*?)?(\/?)>/g;
function tags(s) {
  const out = []; let m;
  TAG.lastIndex = 0;
  while ((m = TAG.exec(s))) {
    const attrs = m[2] || '';
    const cls = (attrs.match(/\sclass="([^"]*)"/) || [])[1] || '';
    const id = (attrs.match(/\sid="([^"]*)"/) || [])[1] || '';
    out.push({ i: m.index, len: m[0].length, name: m[1].toLowerCase(), attrs, key: m[1].toLowerCase() + '.' + cls.split(/\s+/).filter(c => !/^(is-|cz-reveal)/.test(c)).sort().join('.') + (id ? '#' + id : '') });
  }
  return out;
}
function attrMap(a) { const m = {}; const re = /\s([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:="([^"]*)")?/g; let x; while ((x = re.exec(a))) m[x[1]] = x[0]; return m; }
function lcs(a, b) { // key 배열 정렬
  const n = a.length, m = b.length, dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i].key === b[j].key ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const pairs = []; let i = 0, j = 0;
  while (i < n && j < m) { if (a[i].key === b[j].key) { pairs.push([i, j]); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
  return pairs;
}
const O = fs.readFileSync(oldF, 'utf8'), N = fs.readFileSync(newF, 'utf8'), U = fs.readFileSync(ourF, 'utf8');
const to = tags(O), tn = tags(N), tu = tags(U);
// 1) 옛 ↔ 새 : 추가된 속성
const onPairs = lcs(to, tn);
const added = new Map(); // 옛 태그 index → [추가 속성 문자열]
const oldIdx = new Set();
for (const [i, j] of onPairs) {
  oldIdx.add(i);
  const a = attrMap(to[i].attrs), b = attrMap(tn[j].attrs);
  const plus = Object.keys(b).filter(k => /^data-cms/.test(k) && !(k in a)).map(k => b[k]);
  if (plus.length) added.set(i, plus);
}
// 새 파일에만 있는 태그 중 data-cms 가 있는 것 (새로 생긴 요소) — 보고만 한다
const newOnly = tn.filter((t, j) => !onPairs.some(p => p[1] === j) && /data-cms/.test(t.attrs));
// 2) 옛 ↔ 우리 : 같은 자리 태그
const ouPairs = lcs(to, tu);
const inserts = []; const missed = [];
const map = new Map(ouPairs);
for (const [i, plus] of added) {
  const j = map.get(i);
  if (j == null) { missed.push(to[i].key + ' ' + plus.join('')); continue; }
  const t = tu[j]; const have = attrMap(t.attrs);
  const add = plus.filter(p => !(p.trim().split('=')[0] in have));
  if (!add.length) continue;
  const at = t.i + t.len - (U[t.i + t.len - 2] === '/' ? 2 : 1); // '>' 또는 '/>' 앞
  inserts.push([at, add.join('')]);
}
let out = U;
inserts.sort((a, b) => b[0] - a[0]).forEach(([at, s]) => { out = out.slice(0, at) + s + out.slice(at); });
fs.writeFileSync(ourF, out);
console.log(JSON.stringify({ file: ourF.split('/').slice(-2).join('/'), added: added.size, inserted: inserts.length, missed, newOnly: newOnly.map(t => t.key + ' ' + (t.attrs.match(/data-cms[^\s>]*="[^"]*"/g) || []).join(' ')) }, null, 1));
