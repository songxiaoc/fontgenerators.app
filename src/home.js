const input = document.querySelector('#font-input');
const search = document.querySelector('#style-search');
const results = document.querySelector('#style-results');
const count = document.querySelector('#style-count');
const status = document.querySelector('#copy-status');
const categoryButtons = [...document.querySelectorAll('[data-category]')];
let activeCategory = 'All';
let statusTimer = null;
let statusFadeTimer = null;
const favoriteStorageKey = 'fontgenerators.favoriteStyles.v1';
function readFavoriteIds() {
  try {
    const stored = globalThis.localStorage?.getItem(favoriteStorageKey);
    const ids = stored ? JSON.parse(stored) : [];
    return Array.isArray(ids) ? ids.filter(id => typeof id === 'string') : [];
  } catch (err) {
    return [];
  }
}
const favoriteIds = new Set(readFavoriteIds());
function saveFavoriteIds() {
  try {
    globalThis.localStorage?.setItem(favoriteStorageKey, JSON.stringify([...favoriteIds]));
  } catch (err) {
    setStatus('Favorites changed for this session, but browser storage is unavailable.');
  }
}

const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const digits = '0123456789';
const sections = ['Bold', 'Cursive', 'Fancy', 'Italic', 'Stylish', 'Cool', 'Strikethrough', 'Underline', 'Cursed', 'Big', 'Discord', 'WhatsApp', 'Twitter'];
const cp = (...codes) => String.fromCodePoint(...codes);
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => String.fromCodePoint(start + i));
const codes = (...values) => values.map(value => String.fromCodePoint(value)).join('');
const mapFrom = (chars, mapped) => {
  const mappedChars = Array.isArray(mapped) ? mapped : [...mapped];
  return Object.fromEntries([...chars].map((ch, i) => [ch, mappedChars[i] || ch]));
};
const mapFromCodes = (chars, values) => mapFrom(chars, codes(...values));
const merge = (...maps) => Object.assign({}, ...maps);
const hash = (value) => [...value].reduce((total, ch) => ((total * 31) + ch.charCodeAt(0)) >>> 0, 7);
const textChars = (text) => [...text];
const mapText = (text, map) => textChars(text).map((ch) => map[ch] || map[ch.toLowerCase()] || map[ch.toUpperCase()] || ch).join('');
const combine = (text, mark, map = null) => textChars(map ? mapText(text, map) : text).map((ch) => ch === ' ' ? ' ' : ch + mark).join('');
const spaced = (text, glue = ' ') => textChars(text).join(glue);
const alternate = (text, first, second) => textChars(text).map((ch, i) => ch === ' ' ? '  ' : ch + (i % 2 ? second : first)).join('');
const wrapChars = (text, before, after, map = null) => textChars(map ? mapText(text, map) : text).map(ch => `${before}${ch}${after}`).join('');
const wrapWords = (text, before, after, map = null) => text.split(/(\s+)/).map(part => part.trim() ? `${before}${map ? mapText(part, map) : part}${after}` : part).join('');
const bracketBig = (text, before = cp(0x300e), after = cp(0x300f), map = maps?.fullwidth) => textChars(map ? mapText(text, map) : text.toUpperCase()).map(ch => ch === ' ' ? '   ' : `${before}${ch}${after}`).join('');
const italicLowerCodes = [0x1d44e,0x1d44f,0x1d450,0x1d451,0x1d452,0x1d453,0x1d454,0x210e,0x1d456,0x1d457,0x1d458,0x1d459,0x1d45a,0x1d45b,0x1d45c,0x1d45d,0x1d45e,0x1d45f,0x1d460,0x1d461,0x1d462,0x1d463,0x1d464,0x1d465,0x1d466,0x1d467];
const scriptUpperCodes = [0x1d49c,0x212c,0x1d49e,0x1d49f,0x2130,0x2131,0x1d4a2,0x210b,0x2110,0x1d4a5,0x1d4a6,0x2112,0x2133,0x1d4a9,0x1d4aa,0x1d4ab,0x1d4ac,0x211b,0x1d4ae,0x1d4af,0x1d4b0,0x1d4b1,0x1d4b2,0x1d4b3,0x1d4b4,0x1d4b5];
const scriptLowerCodes = [0x1d4b6,0x1d4b7,0x1d4b8,0x1d4b9,0x212f,0x1d4bb,0x210a,0x1d4bd,0x1d4be,0x1d4bf,0x1d4c0,0x1d4c1,0x1d4c2,0x1d4c3,0x2134,0x1d4c5,0x1d4c6,0x1d4c7,0x1d4c8,0x1d4c9,0x1d4ca,0x1d4cb,0x1d4cc,0x1d4cd,0x1d4ce,0x1d4cf];

const maps = {
  boldSerif: merge(mapFrom(upper, range(0x1d400, 0x1d419)), mapFrom(lower, range(0x1d41a, 0x1d433)), mapFrom(digits, range(0x1d7ce, 0x1d7d7))),
  italicSerif: merge(mapFrom(upper, range(0x1d434, 0x1d44d)), mapFromCodes(lower, italicLowerCodes)),
  boldItalic: merge(mapFrom(upper, range(0x1d468, 0x1d481)), mapFrom(lower, range(0x1d482, 0x1d49b))),
  script: merge(
    mapFromCodes(upper, scriptUpperCodes),
    mapFromCodes(lower, scriptLowerCodes)
  ),
  boldScript: merge(mapFrom(upper, range(0x1d4d0, 0x1d4e9)), mapFrom(lower, range(0x1d4ea, 0x1d503))),
  fraktur: merge(
    mapFromCodes(upper, [0x1d504,0x1d505,0x212d,0x1d507,0x1d508,0x1d509,0x1d50a,0x210c,0x2111,0x1d50d,0x1d50e,0x1d50f,0x1d510,0x1d511,0x1d512,0x1d513,0x1d514,0x211c,0x1d516,0x1d517,0x1d518,0x1d519,0x1d51a,0x1d51b,0x1d51c,0x2128]),
    mapFrom(lower, range(0x1d51e, 0x1d537))
  ),
  doubleStruck: merge(
    mapFromCodes(upper, [0x1d538,0x1d539,0x2102,0x1d53b,0x1d53c,0x1d53d,0x1d53e,0x210d,0x1d540,0x1d541,0x1d542,0x1d543,0x1d544,0x2115,0x1d546,0x2119,0x211a,0x211d,0x1d54a,0x1d54b,0x1d54c,0x1d54d,0x1d54e,0x1d54f,0x1d550,0x2124]),
    mapFrom(lower, range(0x1d552, 0x1d56b)),
    mapFrom(digits, range(0x1d7d8, 0x1d7e1))
  ),
  boldFraktur: merge(mapFrom(upper, range(0x1d56c, 0x1d585)), mapFrom(lower, range(0x1d586, 0x1d59f))),
  sans: merge(mapFrom(upper, range(0x1d5a0, 0x1d5b9)), mapFrom(lower, range(0x1d5ba, 0x1d5d3)), mapFrom(digits, range(0x1d7e2, 0x1d7eb))),
  sansBold: merge(mapFrom(upper, range(0x1d5d4, 0x1d5ed)), mapFrom(lower, range(0x1d5ee, 0x1d607)), mapFrom(digits, range(0x1d7ec, 0x1d7f5))),
  sansItalic: merge(mapFrom(upper, range(0x1d608, 0x1d621)), mapFrom(lower, range(0x1d622, 0x1d63b))),
  sansBoldItalic: merge(mapFrom(upper, range(0x1d63c, 0x1d655)), mapFrom(lower, range(0x1d656, 0x1d66f))),
  monospace: merge(mapFrom(upper, range(0x1d670, 0x1d689)), mapFrom(lower, range(0x1d68a, 0x1d6a3)), mapFrom(digits, range(0x1d7f6, 0x1d7ff))),
  fullwidth: merge(mapFrom(upper, range(0xff21, 0xff3a)), mapFrom(lower, range(0xff41, 0xff5a)), mapFrom(digits, range(0xff10, 0xff19))),
  circled: merge(mapFrom(upper, range(0x24b6, 0x24cf)), mapFrom(lower, range(0x24d0, 0x24e9)), mapFromCodes(digits, [0x24ea,0x2460,0x2461,0x2462,0x2463,0x2464,0x2465,0x2466,0x2467,0x2468])),
  negativeCircled: merge(mapFrom(upper, range(0x1f150, 0x1f169)), mapFromCodes(digits, [0x24ff,0x2776,0x2777,0x2778,0x2779,0x277a,0x277b,0x277c,0x277d,0x277e])),
  squared: mapFrom(upper, range(0x1f130, 0x1f149)),
  smallCaps: mapFromCodes(lower + upper, [0x1d00,0x0299,0x1d04,0x1d05,0x1d07,0xa730,0x0262,0x029c,0x026a,0x1d0a,0x1d0b,0x029f,0x1d0d,0x0274,0x1d0f,0x1d18,0x0071,0x0280,0x0073,0x1d1b,0x1d1c,0x1d20,0x1d21,0x0078,0x028f,0x1d22,0x1d00,0x0299,0x1d04,0x1d05,0x1d07,0xa730,0x0262,0x029c,0x026a,0x1d0a,0x1d0b,0x029f,0x1d0d,0x0274,0x1d0f,0x1d18,0x0071,0x0280,0x0073,0x1d1b,0x1d1c,0x1d20,0x1d21,0x0078,0x028f,0x1d22]),
  superscript: merge(mapFromCodes(lower + upper, [0x1d43,0x1d47,0x1d9c,0x1d48,0x1d49,0x1da0,0x1d4d,0x02b0,0x2071,0x02b2,0x1d4f,0x02e1,0x1d50,0x207f,0x1d52,0x1d56,0x0071,0x02b3,0x02e2,0x1d57,0x1d58,0x1d5b,0x02b7,0x02e3,0x02b8,0x1dbb,0x1d43,0x1d47,0x1d9c,0x1d48,0x1d49,0x1da0,0x1d4d,0x02b0,0x2071,0x02b2,0x1d4f,0x02e1,0x1d50,0x207f,0x1d52,0x1d56,0x0071,0x02b3,0x02e2,0x1d57,0x1d58,0x1d5b,0x02b7,0x02e3,0x02b8,0x1dbb]), mapFromCodes(digits, [0x2070,0x00b9,0x00b2,0x00b3,0x2074,0x2075,0x2076,0x2077,0x2078,0x2079])),
  flipped: mapFrom('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀𐐒ƆᗡƎℲ⅁HIſꓘ⅂WNOԀὉᴚS⊥∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86')
};

const styleLines = `
Classic|classic|Instagram,Bold,TikTok,Twitter,Facebook,Discord,WhatsApp
Vintage|vintage|Instagram,Bold,Fancy,Stylish,TikTok,Twitter,Facebook,Discord,WhatsApp,Italic
Fancy and Loud|fancy-and-loud|Instagram,Bold,Fancy,Stylish,TikTok,Twitter,Facebook,Discord,WhatsApp,Italic,Cursive
Modern|modern|Instagram,Bold,TikTok,Twitter,Facebook,Discord,WhatsApp
Swanky|swanky|Instagram,Bold,Fancy,Stylish,TikTok,Twitter,Facebook,Discord,WhatsApp,Italic
The North|the-north|Instagram,Bold,Fancy,Stylish,TikTok,Twitter,Facebook,Discord,WhatsApp,Italic,Cursive
Hooky|hooky|Instagram,Bold,Fancy,Twitter,Facebook,Discord,WhatsApp,Big
Chroma|chroma|Instagram,Bold,Stylish,TikTok,Twitter,Facebook,Discord,WhatsApp,Small
Sumptuous Scholar|sumptuous-scholar|Bold,Big,Italic,Cursive
Heracles|heracles|Bold,Cool
Two Fancy|two-fancy|Bold,Fancy,Facebook,WhatsApp,Creepy,Cursive
Loud Scholar|loud-scholar|Bold
Chopstix|chopstix|Bold,Glitch,Stylish,Strikethrough,Cursed,Creepy,Italic
Sleepy|sleepy|Bold,Italic
Flower Crown|flower-crown|Bold,Cursive
Blocked Quotes|blocked-quotes|Bold
Double Bubble|double-bubble|Bold,Big
Classic Gulls|classic-gulls|Bold
Kodak|kodak|Bold,Stylish
Oh|oh|Bold,Italic
Heart King|heart-king|Bold,Fancy,Big
This or That|this-or-that|Bold,Stylish
Fancy|fancy|Instagram,Fancy,TikTok,Twitter,Facebook,Discord,WhatsApp,Italic,Cursive
Medieval Times|medieval-times|TikTok,Twitter,Facebook,Discord,WhatsApp,Italic,Cursive
Lonely Mountain|lonely-mountain|Glitch,Discord,Weird,Cursed,Creepy,Italic,Cursive
Manga|manga|Instagram,Glitch,Cool,TikTok,Twitter,Facebook,Discord,WhatsApp,Big,Creepy,Cursive
Cop Out|cop-out|Cool,Weird,Italic,Cursive
Haiku|haiku|Glitch,Cool,Big,Cursive
Half Sequoyah|half-sequoyah|Fancy,Cursed,Cursive
Inu San|inu-san|Glitch,Big,Cursive
Radagast|radagast|Fancy,Cursed,Cursive
Wavey|wavey|Cursive
Ramen|ramen|Glitch,Big,Cursed,Cursive
Art Greco|art-greco|Instagram,TikTok,Twitter,Facebook,Discord,WhatsApp,Cursive
French Fry|french-fry|Fancy,Small,Cursive
Wakka Wakka|wakka-wakka|Fancy,Cursive
Fancy Bubbles|fancy-bubbles|Cursive
Milli Cyrilli|milli-cyrilli|Fancy,Discord,WhatsApp,Weird,Cursed,Creepy,Cursive
Galactic|galactic|Fancy,Big,Cursive
Drippy|drippy|Weird,Cursive
Frizzle|frizzle|Instagram,Fancy,Cool,Stylish,TikTok,Twitter,Facebook,Discord,WhatsApp,Cursed,Creepy,Cursive
Stylin'|stylin|Fancy,Stylish,Cursed,Cursive
Deluxe Scholar|deluxe-scholar|Fancy,Italic
Aesthetic|aesthetic|Instagram,Fancy,Cool,Stylish,TikTok,Twitter,Facebook,Discord,WhatsApp,Big
Rosetta Stone|rosetta-stone|Fancy,Glitch,Weird,Big,Cursed,Creepy
Bode|bode|Fancy,Big
Starry Night|starry-night|Fancy,Cool,Big
C.R.E.A.M.|cream|Instagram,Fancy,Glitch,Cool,TikTok,Twitter,Facebook,Discord,WhatsApp,Strikethrough,Weird,Cursed,Creepy
Icy|icy|Fancy,Glitch,Cool,Cursed
Robin Hood|robin-hood|Fancy
Carriage Return|carriage-return|Fancy,Cool,Discord,WhatsApp,Small
Palmistry|palmistry|Fancy,Stylish,TikTok,Twitter,Facebook,Discord,WhatsApp
Yeet|yeet|Fancy,Glitch,Stylish,Cursed,Creepy
Chic|chic|Instagram,TikTok,Twitter,Facebook,Discord,WhatsApp,Italic
Dapper|dapper|Instagram,TikTok,Twitter,Facebook,Discord,WhatsApp,Italic
Chic Meow|chic-meow|Underline,Italic
Well Rounded|well-rounded|Italic
Evil Intent|evil-intent|Cursed,Italic
Dapper Lanes|dapper-lanes|Italic
Slippy Dapper|slippy-dapper|Italic
Every Bubble|every-bubble|Glitch,Cool,Weird,Italic
Lightning|extra-bright|Italic
Tilded|tilded|Cool,Italic
Santa Hat|santa-hat|Italic
Chic Guidance|chic-guidance|Italic
Dapper Ellipses|dapper-ellipses|Italic
Mustachioed|mustachioed|Italic
Dapper Slashes|dapper-slashes|Italic
Silicon|silicon|Instagram,Stylish,TikTok,Twitter,Facebook,Discord,WhatsApp,Small
Choo Choo|choo-choo|Stylish,Big
Mono|mono|Instagram,Stylish,TikTok,Twitter,Facebook,Discord,WhatsApp,Small
Shhhhhh|shhhhhh|Stylish,Big
Big Brother|big-brother|Glitch,Stylish,Big
Doric|doric|Stylish,Big
Smelly|smelly|Stylish
Dicey|dicey|Stylish,Big
Flash Mob|flash-mob|Stylish,Big
I See Ew|i-see-ew|Glitch,Stylish,TikTok,Twitter,Weird,Big
White Tie|white-tie|Stylish,TikTok,Twitter,Small
Night Sky|night-sky|Stylish,TikTok,Discord,WhatsApp,Big
Black Tie|black-tie|Stylish,Discord,Small
Olive You|olive-you|Cool,Cursed,Creepy
Circle Back|circle-back|Instagram,Cool
Zalgo|zalgo|Zalgo
Up Top|up-top|Instagram,Cool,TikTok,Twitter,Facebook,Discord,WhatsApp,Small,Weird
Vogue|vogue|Cool,Big
Invisible Ink|invisible-ink|Cool,Weird,Cursed
Joker Boy|joker-boy|Instagram,Glitch,Cool,TikTok,Twitter,Facebook,WhatsApp,Weird,Creepy
Evening Dress|evening-dress|Cool,Facebook,Small
Pinky Out|pinky-out|Cool,Creepy
Across the Board|across-the-board|Glitch,Cool,Small,Weird
Shuriken|shuriken|Glitch,Cool,Strikethrough,Creepy
Tuxedo|tuxedo|Instagram,Cool,Facebook,Small
Strike|strike|Instagram,TikTok,Twitter,Facebook,Discord,WhatsApp,Strikethrough
Vintage Strikes|vintage-strikes|Strikethrough
Chic Strikes|chic-strikes|Strikethrough
Classic Slashes|classic-slashes|Strikethrough
Chic Slashes|chic-slashes|Strikethrough
Silicon Slashes|silicon-slashes|Strikethrough,Small
Slippy|slippy|Strikethrough
Swanky Slips|swanky-slips|Strikethrough
Slippy Vintage|slippy-vintage|Strikethrough
Underhill|underhill|Instagram,TikTok,Twitter,Facebook,Discord,WhatsApp,Underline
Dashing|dashing|Underline
Counter Dashing|counter-dashing|Underline,Upside Down
Dapper Dashing|dapper-dashing|Underline
Silicon Dash|silicon-dash|Underline,Small
Chic Lanes|chic-lanes|Underline
Green Shell|green-shell|Underline
Skyline|skyline|Underline
Guidance|guidance|Underline
Swanky Guidance|swanky-guidance|Underline
Classic Guidance|classic-guidance|Underline
Vintage Guidance|vintage-guidance|Underline
Silicon Guidance|silicon-guidance|Underline
Vintage Ellipses|vintage-ellipses|Underline
Swanky Ellipses|swanky-ellipses|Underline
Silicon Ellipses|silicon-ellipses|Underline,Small
Underhand|underhand|Underline
Underhand Chic|underhand-chic|Underline
Swanky Underhand|swanky-underhand|Underline
Dapper Gulls|dapper-gulls|Underline
Vintage Gulls|vintage-gulls|Underline
Swanky Gulls|swanky-gulls|Underline
Chic Gulls|chic-gulls|Underline
Silicon Gulls|silicon-gulls|Underline,Small
Meow|meow|Underline
Modern Meow|modern-meow|Underline
Swanky Meow|swanky-meow|Underline
Silicon Meow|silicon-meow|Underline
Reverse Curse|reverse-curse|Glitch,Upside Down,Cursed
Slither|slither|Upside Down,Weird,Cursed,Creepy
Lil Cthulu|lil-cthulu|Cursed,Creepy
Flat Pack|flat-pack|Cursed
Flip Flop|flip-flop|Instagram,Glitch,TikTok,Twitter,Facebook,Discord,WhatsApp,Upside Down,Weird,Cursed
Mini Me|mini-me|Glitch,Small,Cursed
Bounce|bounce|Twitter,Upside Down,Weird,Big,Cursed,Creepy
Hit|hit|Big
Nut|nut|Weird,Big
Beach Birds|beach-birds|Big
Electric|electric|Glitch,Big
Watch Out|watch-out|Instagram,TikTok,Twitter,Facebook,Discord,WhatsApp,Small
`.trim();

const fontbStyles = styleLines.split('\n').map(line => {
  const [name, id, categoryText] = line.split('|');
  const tags = categoryText.split(',');
  const category = sections.find(section => tags.includes(section)) || tags[0] || 'Fancy';
  return { id, name, category, tags };
});

const basePool = ['boldSerif', 'boldItalic', 'boldScript', 'sansBold', 'sansBoldItalic', 'boldFraktur', 'doubleStruck', 'monospace', 'fullwidth'];
const pickMap = (style, pool = basePool) => maps[pool[hash(style.id) % pool.length]];
const hasTag = (style, tag) => style.tags.includes(tag);
const zalgoMarks = ['\u030d','\u030e','\u0304','\u0305','\u033f','\u0311','\u0306','\u0310','\u0352','\u0357','\u0351','\u0307','\u0308','\u030a','\u0342','\u0343','\u0344','\u034a','\u034b','\u034c','\u0303','\u0302','\u030c','\u0350','\u0300','\u0301','\u030b','\u030f','\u0312','\u0313','\u0314','\u033d','\u0309','\u0363','\u0364','\u0365','\u0366','\u0367','\u0368','\u0369','\u036a','\u036b','\u036c','\u036d','\u036e','\u036f','\u0316','\u0317','\u0318','\u0319','\u031c','\u031d','\u031e','\u031f','\u0320','\u0324','\u0325','\u0326','\u0329','\u032a','\u032b','\u032c','\u032d','\u032e','\u032f','\u0330','\u0331','\u0332','\u0333','\u0339','\u033a','\u033b','\u033c','\u0345','\u0347','\u0348','\u0349','\u034d','\u034e','\u0353','\u0354','\u0355','\u0356','\u0359','\u035a'];
const zalgo = (text, intensity = 4) => textChars(text).map((ch, index) => {
  if (ch === ' ') return ch;
  const offset = (index + ch.charCodeAt(0)) % zalgoMarks.length;
  return ch + Array.from({ length: intensity }, (_, i) => zalgoMarks[(offset + i * 7) % zalgoMarks.length]).join('');
}).join('');
const flip = (text) => textChars(mapText(text, maps.flipped)).reverse().join('');

function transformStyle(style, text) {
  const id = style.id;
  if (id === 'classic') return mapText(text, maps.boldSerif);
  if (id === 'vintage') return mapText(text, maps.boldItalic);
  if (id === 'fancy-and-loud') return mapText(text, maps.boldScript);
  if (id === 'modern') return mapText(text, maps.sansBold);
  if (id === 'swanky') return mapText(text, maps.sansBoldItalic);
  if (id === 'the-north') return mapText(text, maps.boldFraktur);
  if (id === 'hooky') return mapText(text, maps.doubleStruck);
  if (id === 'fancy') return mapText(text, maps.script);
  if (id === 'medieval-times') return mapText(text, maps.fraktur);
  if (id === 'aesthetic') return mapText(text, maps.fullwidth);
  if (id === 'chic') return mapText(text, maps.sansItalic);
  if (id === 'dapper') return mapText(text, maps.italicSerif);
  if (id === 'silicon') return mapText(text, maps.monospace);
  if (id === 'chroma') return mapText(text.toUpperCase(), maps.negativeCircled);
  if (id === 'circle-back') return mapText(text, maps.circled);
  if (id === 'zalgo') return zalgo(text, 6);
  if (id === 'flip-flop' || id === 'counter-dashing' || id === 'reverse-curse' || id === 'slither') return flip(text);
  if (id === 'big-brother') return bracketBig(text, cp(0x3010), cp(0x3011), maps.fullwidth);
  if (id === 'hit') return bracketBig(text, cp(0x2503), cp(0x2503), maps.sansBold);
  if (id === 'nut') return wrapWords(mapText(text, maps.doubleStruck), cp(0x27e6), cp(0x27e7));
  if (id === 'watch-out' || id === 'up-top') return mapText(text, maps.superscript);
  if (id === 'mini-me') return alternate(mapText(text, maps.superscript), '\u00b7', '\u02d9');
  if (id === 'kodak') return wrapChars(text, cp(0x3010), cp(0x3011));
  if (id === 'fancy-bubbles') return wrapChars(text, cp(0x2985), cp(0x2986), maps.script);
  if (id === 'double-bubble') return wrapChars(text, cp(0x2985), cp(0x2986), maps.doubleStruck);
  if (id === 'heart-king') return wrapChars(text, cp(0x2665), cp(0x2665));
  if (id === 'starry-night') return wrapChars(text, cp(0x22c6), cp(0x22c6));
  if (id === 'vogue') return wrapChars(text, cp(0x300e), cp(0x300f));
  if (id === 'doric') return wrapChars(text, cp(0x27e6), cp(0x27e7));
  if (id === 'choo-choo') return wrapChars(text, cp(0x2991), cp(0x2992));
  if (id === 'flash-mob') return wrapChars(text, cp(0x29fc), cp(0x29fd));
  if (id === 'night-sky') return mapText(text, maps.fullwidth).replace(/[aeiou]/gi, ch => mapText(ch, maps.smallCaps));
  if (id === 'black-tie' || id === 'mono' || id === 'evening-dress') return mapText(text.toUpperCase(), maps.negativeCircled);
  if (id === 'white-tie' || id === 'tuxedo') return textChars(text.toUpperCase()).map((ch, i) => ch === ' ' ? ' ' : (i % 2 ? mapText(ch, maps.negativeCircled) : mapText(ch, maps.circled))).join('');

  if (id.includes('slash') || id === 'shuriken') return combine(text, '\u0338', pickMap(style, ['boldSerif', 'sansItalic', 'monospace']));
  if (id.includes('strike') || hasTag(style, 'Strikethrough')) return combine(text, id.includes('slip') ? '\u0334' : '\u0336', pickMap(style, ['boldItalic', 'sansItalic', 'sansBoldItalic', 'monospace']));
  if (id.includes('gulls')) return combine(text, '\u033c', pickMap(style, ['boldSerif', 'boldItalic', 'sansBoldItalic', 'monospace']));
  if (id.includes('guidance')) return combine(text, '\u0362', pickMap(style, ['boldSerif', 'boldItalic', 'sansBoldItalic', 'monospace']));
  if (id.includes('ellipses')) return combine(text, '\u20e8', pickMap(style, ['boldItalic', 'sansBoldItalic', 'monospace']));
  if (id.includes('meow')) return combine(text, '\u035c', pickMap(style, ['sansItalic', 'sansBold', 'monospace']));
  if (id.includes('dashing') || id.includes('dash') || id === 'underhill') return combine(text, '\u0332', pickMap(style, ['italicSerif', 'monospace', 'sansItalic']));
  if (id.includes('lanes')) return combine(text, '\u0333', pickMap(style, ['sansItalic', 'italicSerif']));
  if (id.includes('underhand')) return combine(text, '\u0330', pickMap(style, ['sansItalic', 'sansBoldItalic']));
  if (id === 'skyline') return combine(text, '\u035e');
  if (hasTag(style, 'Underline')) return combine(text, ['\u0332','\u0333','\u0330','\u035c','\u0362'][hash(id) % 5], pickMap(style, ['boldSerif','italicSerif','sansItalic','monospace']));

  if (hasTag(style, 'Cursed') || hasTag(style, 'Glitch') || hasTag(style, 'Creepy')) {
    if (id.includes('mini')) return alternate(mapText(text, maps.superscript), '\u00b7', '\u02d9');
    if (id.includes('flat')) return combine(text, '\ua672');
    if (id.includes('invisible')) return combine(text, '\u0489');
    return zalgo(mapText(text, pickMap(style, ['sansBold','sansBoldItalic','boldFraktur','smallCaps'])), hasTag(style, 'Cursed') ? 3 : 2);
  }

  if (hasTag(style, 'Big')) {
    if (id.includes('bubble') || id.includes('bird')) return wrapChars(text, cp(0x2985), cp(0x2986), maps.doubleStruck);
    if (id.includes('night') || id.includes('bode') || id.includes('galactic')) return mapText(text.toUpperCase(), maps.fullwidth);
    return wrapWords(mapText(text, pickMap(style, ['doubleStruck','boldFraktur','fullwidth','sansBold'])), cp(0x3010), cp(0x3011));
  }

  if (hasTag(style, 'Small')) return mapText(text, maps.smallCaps);
  if (hasTag(style, 'Italic')) return mapText(text, pickMap(style, ['italicSerif','boldItalic','sansItalic','sansBoldItalic']));
  if (hasTag(style, 'Cursive')) return mapText(text, pickMap(style, ['script','boldScript','fraktur','boldFraktur']));
  if (hasTag(style, 'Stylish')) {
    if (id.includes('dicey')) return wrapChars(text, cp(0xa70d), cp(0xa709));
    return wrapChars(mapText(text, pickMap(style, ['sansBold','monospace','fullwidth','circled'])), id.includes('this') ? '' : cp(0x27e6), id.includes('this') ? '\u034d' : cp(0x27e7));
  }
  if (hasTag(style, 'Cool')) return mapText(text, pickMap(style, ['circled','smallCaps','fullwidth','sans','doubleStruck']));
  if (hasTag(style, 'Fancy')) return mapText(text, pickMap(style, ['script','boldScript','fraktur','doubleStruck','fullwidth']));
  if (hasTag(style, 'Bold')) return mapText(text, pickMap(style, ['boldSerif','sansBold','boldItalic','boldScript','boldFraktur']));
  return mapText(text, pickMap(style));
}

const styles = fontbStyles.map(style => ({
  ...style,
  transform: (text) => transformStyle(style, text)
}));

function escapeHtml(s){return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function setStatus(message){
  if (!status) return;
  status.textContent = message;
  status.dataset.toastVisible = 'true';
  window.clearTimeout(statusTimer);
  window.clearTimeout(statusFadeTimer);
  status.style.setProperty('transition', 'none', 'important');
  status.style.setProperty('visibility', 'visible', 'important');
  status.style.setProperty('opacity', '1', 'important');
  status.style.setProperty('transform', 'translate(-50%, 0)', 'important');
  statusTimer = window.setTimeout(() => {
    status.style.setProperty('transition', 'opacity .35s ease, transform .35s ease', 'important');
    delete status.dataset.toastVisible;
    status.style.removeProperty('opacity');
    status.style.removeProperty('transform');
    statusFadeTimer = window.setTimeout(() => {
      status.style.removeProperty('transition');
      status.style.removeProperty('visibility');
    }, 380);
  }, 2200);
}
function matches(style, q){
  const haystack = [style.name, style.category, ...style.tags, style.id].join(' ').toLowerCase();
  return haystack.includes(q.trim().toLowerCase());
}
function selectElementText(node) {
  if (!node) return;
  const range = document.createRange();
  range.selectNodeContents(node);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  node.focus({ preventScroll: true });
}
function fallbackCopyText(value) {
  const previousFocus = document.activeElement;
  const selection = window.getSelection();
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.setAttribute('data-clarity-mask', 'true');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.width = '2px';
  textarea.style.height = '2px';
  textarea.style.color = 'transparent';
  textarea.style.background = 'transparent';
  textarea.style.border = '0';
  textarea.style.padding = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  let textareaCopied = false;
  try {
    textareaCopied = document.execCommand('copy');
  } finally {
    textarea.remove();
  }
  if (textareaCopied) {
    previousFocus?.focus?.({ preventScroll: true });
    return;
  }

  const editable = document.createElement('div');
  editable.contentEditable = 'true';
  editable.textContent = value;
  editable.setAttribute('aria-hidden', 'true');
  editable.setAttribute('data-clarity-mask', 'true');
  editable.style.position = 'fixed';
  editable.style.top = '0';
  editable.style.left = '0';
  editable.style.width = '2px';
  editable.style.height = '2px';
  editable.style.overflow = 'hidden';
  editable.style.color = 'transparent';
  editable.style.background = 'transparent';
  document.body.appendChild(editable);
  const range = document.createRange();
  range.selectNodeContents(editable);
  selection.removeAllRanges();
  selection.addRange(range);
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } finally {
    selection.removeAllRanges();
    editable.remove();
    previousFocus?.focus?.({ preventScroll: true });
  }
  if (!copied) throw new Error('Fallback copy failed');
}
async function copyText(value) {
  try {
    fallbackCopyText(value);
  } catch (err) {
    if (!navigator.clipboard?.writeText) throw err;
    await navigator.clipboard.writeText(value);
  }
}
function render(){
  const text = input.value || 'Your Text';
  const q = search.value || '';
  const visible = styles.filter(style => {
    const categoryMatch = activeCategory === 'All' || (activeCategory === 'Favorites' ? favoriteIds.has(style.id) : style.category === activeCategory || style.tags.includes(activeCategory));
    return categoryMatch && matches(style, q);
  });
  const favoriteText = favoriteIds.size === 1 ? '1 FAVORITE' : `${favoriteIds.size} FAVORITES`;
  count.textContent = `${visible.length} STYLES SHOWN / ${styles.length} TOTAL STYLES / ${favoriteText}`;
  results.innerHTML = visible.map((style) => {
    const output = style.transform(text);
    const favorite = favoriteIds.has(style.id);
    return `<article class="style-row" data-style-id="${style.id}">
      <div class="style-row-head">
        <div>
          <div class="style-title-line"><span class="style-encoding">${escapeHtml(style.name.toUpperCase())}</span></div>
          <div class="tagline">${escapeHtml(style.category)} / ${style.tags.map(escapeHtml).join(' / ')}</div>
        </div>
      </div>
      <div class="style-actions">
        <button type="button" class="icon-action-btn${favorite ? ' is-on' : ''}" data-favorite="${style.id}" aria-pressed="${favorite}" aria-label="${favorite ? 'Remove' : 'Save'} ${escapeHtml(style.name)} favorite"><span class="material-symbols-outlined">${favorite ? 'star' : 'star_border'}</span></button>
        <button type="button" class="icon-copy" data-copy="${style.id}" aria-label="Copy ${escapeHtml(style.name)} style"><span class="material-symbols-outlined">content_copy</span></button>
      </div>
      <div class="style-output clarity-mask" data-clarity-mask="true" data-output tabindex="0" aria-label="${escapeHtml(style.name)} generated style preview">${escapeHtml(output)}</div>
    </article>`;
  }).join('') || `<p class="empty-state">${activeCategory === 'Favorites' ? 'No favorites yet. Star a style to keep it here.' : 'No styles match that filter. Try another category or search term.'}</p>`;
}
async function copyStyle(id){
  const style = styles.find(s => s.id === id);
  if (!style) return;
  const value = style.transform(input.value || 'Your Text');
  const row = document.querySelector(`[data-style-id="${id}"]`);
  const button = row?.querySelector('[data-copy]');
  const icon = button?.querySelector('.material-symbols-outlined');
  try {
    await copyText(value);
    row?.classList.add('copied');
    button?.classList.add('copied');
    if (icon) icon.textContent = 'check';
    setStatus(`Copied ${style.name}.`);
    window.fgTrack?.('font_style_copied', { style_id: style.id, category: style.category });
    setTimeout(() => {
      row?.classList.remove('copied');
      button?.classList.remove('copied');
      if (icon) icon.textContent = 'content_copy';
    }, 1500);
  } catch (err) {
    selectElementText(row?.querySelector('[data-output]'));
    setStatus('Clipboard blocked by this browser. The text is selected; press Ctrl+C to copy it.');
  }
}
function toggleFavorite(id) {
  if (favoriteIds.has(id)) favoriteIds.delete(id); else favoriteIds.add(id);
  saveFavoriteIds();
  render();
  const style = styles.find(s => s.id === id);
  if (style) setStatus(`${favoriteIds.has(id) ? 'Saved favorite' : 'Removed favorite'} ${style.name}.`);
}
input.addEventListener('input', render);
search.addEventListener('input', render);
categoryButtons.forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  categoryButtons.forEach(b => b.classList.toggle('active', b === button));
  render();
}));
results.addEventListener('pointerdown', e => {
  const copyButton = e.target.closest('[data-copy]');
  if (!copyButton) return;
  e.preventDefault();
  return copyStyle(copyButton.dataset.copy);
});
results.addEventListener('click', e => {
  const copyButton = e.target.closest('[data-copy]');
  if (copyButton) {
    if (e.detail === 0) return copyStyle(copyButton.dataset.copy);
    return;
  }
  const favoriteButton = e.target.closest('[data-favorite]');
  if (favoriteButton) return toggleFavorite(favoriteButton.dataset.favorite);
});
render();
