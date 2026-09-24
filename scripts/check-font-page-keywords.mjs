import { readFileSync } from 'node:fs';
import { fontPages } from '../src/font-page-config.js';

const lengths = { one: 1, two: 2, three: 3, four: 4 };
const stopwords = new Set(`a about above after again against all am an and any are as at be because been before below between both but by can could did do does each few for from further had has have he her hers here him his how i if in into is it its itself just may me more most my no nor not now of off on once one only or other our ours out over same she should so some such than that the their theirs them then there these they this those through to too under until up us very was we were what when where which while who why will with would you your yours`.split(' '));
// Shared writing and interface nouns are excluded on every page so topics compete with distinctive content, not copy mechanics.
const generalUtilityWords = new Set(`accent accents app apps button buttons caption captions character characters chat chats choice choices copy copies copying draft drafts effect effects field fields font fonts free generator generators headline headlines label labels letter letters line lines mark marks message messages name names online paragraph paragraphs paste pasted pasting phrase phrases post posts preview previews profile profiles reader readers result results screen screens sentence sentences short plain style styles symbol symbols text title titles tool tools unicode use used uses using version versions word words`.split(' '));
const rules = [
  'Corpus: built HTML <main> headings, paragraphs, list items and FAQ summaries; exclude #generator and [data-related-tools] sections.',
  'Normalize HTML entities and NFKC; lowercase; remove apostrophes inside words; split other punctuation and hyphens into word boundaries.',
  'Count contiguous 1–4 English-word n-grams within each sentence and visible text block, never across blocks.',
  'All pages share the fixed stopword and general-utility sets in this script; candidates cannot start/end with a stopword and need one other distinctive word.',
  'Target must be eligible, occur at least twice and have a unique highest same-length count.',
  'Corpus needs at least 1,000 words; a target cannot occupy over 8% of corpus words; duplicate content blocks of 8+ words fail.'
];

if (process.argv.includes('--help')) {
  console.log(rules.join('\n'));
  process.exit(0);
}

function decodeEntities(value) {
  const named = { amp: '&', apos: "'", quot: '"', lt: '<', gt: '>', nbsp: ' ', ndash: '–', mdash: '—', hellip: '…' };
  return value.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const code = entity[1].toLowerCase() === 'x' ? Number.parseInt(entity.slice(2), 16) : Number.parseInt(entity.slice(1), 10);
      return Number.isInteger(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ' ';
    }
    return named[entity.toLowerCase()] ?? ' ';
  });
}

function normalizeWords(value) {
  return decodeEntities(value)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/([a-z])'(?=[a-z])/g, '$1')
    .replace(/[^a-z]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function visibleBlocks(html, slug) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!main) throw new Error(`${slug}: missing <main>`);
  const sections = [...main.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi)].map(match => match[0]);
  if (sections.length < 4) throw new Error(`${slug}: expected hero, generator, and substantive content sections`);
  const content = sections.filter(section => {
    const opening = section.match(/^<section\b[^>]*>/i)?.[0] || '';
    return !/\bid=["']generator["']/i.test(opening) && !/\bdata-related-tools(?:\s|>|=)/i.test(opening);
  }).join('\n').replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/gi, ' ');
  const blocks = [...content.matchAll(/<(h[1-6]|p|li|summary)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .flatMap(match => {
      const text = decodeEntities(match[2].replace(/<[^>]*>/g, ' '));
      return text.split(/[.!?;:]+/).map(segment => normalizeWords(segment)).filter(words => words.length);
    });
  if (!blocks.length) throw new Error(`${slug}: no visible content blocks`);
  return blocks;
}

function eligible(words) {
  return !stopwords.has(words[0])
    && !stopwords.has(words.at(-1))
    && words.some(word => !stopwords.has(word) && !generalUtilityWords.has(word));
}

function countNgrams(blocks, length) {
  const counts = new Map();
  for (const words of blocks) {
    for (let index = 0; index <= words.length - length; index++) {
      const candidate = words.slice(index, index + length);
      if (!eligible(candidate)) continue;
      const phrase = candidate.join(' ');
      counts.set(phrase, (counts.get(phrase) || 0) + 1);
    }
  }
  return counts;
}

function rank(counts) {
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

const failures = [];
const verbose = process.argv.includes('--verbose');
if (fontPages.length !== 23 || new Set(fontPages.map(page => page.slug)).size !== 23) throw new Error('keyword acceptance requires exactly 23 configured font pages');
for (const page of fontPages) {
  const html = readFileSync(new URL(`../dist/${page.slug}.html`, import.meta.url), 'utf8');
  const blocks = visibleBlocks(html, page.slug);
  const wordCount = blocks.reduce((sum, words) => sum + words.length, 0);
  if (wordCount < 1000) failures.push(`${page.slug}: ${wordCount} visible content words; minimum is 1000`);
  const blockCounts = new Map();
  for (const words of blocks) {
    if (words.length < 8) continue;
    const key = words.join(' ');
    blockCounts.set(key, (blockCounts.get(key) || 0) + 1);
  }
  const duplicate = [...blockCounts].find(([, count]) => count > 1);
  if (duplicate) failures.push(`${page.slug}: repeated content block (${duplicate[1]}x): ${duplicate[0].slice(0, 90)}`);
  for (const [key, length] of Object.entries(lengths)) {
    const target = page.keywordPhrases?.[key];
    if (typeof target !== 'string' || !target.trim()) {
      failures.push(`${page.slug} ${key}: missing keywordPhrases.${key}`);
      continue;
    }
    const words = normalizeWords(target);
    if (words.length !== length || !eligible(words)) {
      failures.push(`${page.slug} ${key}: target "${target}" must be ${length} eligible English word${length === 1 ? '' : 's'}`);
      continue;
    }
    const phrase = words.join(' ');
    const counts = countNgrams(blocks, length);
    const ranked = rank(counts);
    const targetCount = counts.get(phrase) || 0;
    const leadingCount = ranked[0]?.[1] || 0;
    const competingCount = ranked.find(([candidate]) => candidate !== phrase)?.[1] || 0;
    const density = (100 * targetCount / Math.max(wordCount, 1)).toFixed(2);
    const summary = `${page.slug} ${length}-gram "${phrase}": ${targetCount}/${wordCount} words (${density}%); leader ${leadingCount}; competitors ${ranked.filter(([candidate]) => candidate !== phrase).slice(0, 5).map(([candidate, count]) => `"${candidate}" ${count}`).join(', ') || 'none'}`;
    if (verbose) console.log(summary);
    if (targetCount < 2 || targetCount <= competingCount || targetCount / wordCount > 0.08) {
      failures.push(summary + (targetCount < 2 ? '; target needs at least two occurrences' : targetCount / wordCount > 0.08 ? '; target exceeds 8% concentration cap' : targetCount === competingCount ? '; target is tied for first' : ''));
    }
  }
}

if (failures.length) {
  console.error(`Keyword acceptance failed (${failures.length}). ${rules[0]}\n${failures.map(item => `- ${item}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Keyword acceptance passed: ${fontPages.length} pages × 4 phrase lengths. ${rules[0]}`);
}
