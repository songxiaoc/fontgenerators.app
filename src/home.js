const input = document.querySelector('#font-input');
const search = document.querySelector('#style-search');
const results = document.querySelector('#style-results');
const count = document.querySelector('#style-count');
const status = document.querySelector('#copy-status');
const categoryButtons = [...document.querySelectorAll('[data-category]')];
let activeCategory = 'All';
const favoriteIds = new Set();

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => String.fromCodePoint(start + i));
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const digits = '0123456789';
const mapFrom = (chars, mapped) => Object.fromEntries([...chars].map((ch, i) => [ch, mapped[i] || ch]));
const merge = (...maps) => Object.assign({}, ...maps);
const mapText = (text, map) => [...text].map((ch) => map[ch] || map[ch.toUpperCase()] || ch).join('');
const combine = (text, mark) => [...text].map((ch) => ch === ' ' ? ' ' : ch + mark).join('');
const smallCaps = mapFrom(lower + upper, 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ'.repeat(2));
const maps = {
  boldSerif: merge(mapFrom(upper, range(0x1d400, 0x1d419)), mapFrom(lower, range(0x1d41a, 0x1d433)), mapFrom(digits, range(0x1d7ce, 0x1d7d7))),
  italicSerif: merge(mapFrom(upper, range(0x1d434, 0x1d44d)), mapFrom(lower, range(0x1d44e, 0x1d467))),
  boldItalic: merge(mapFrom(upper, range(0x1d468, 0x1d481)), mapFrom(lower, range(0x1d482, 0x1d49b))),
  script: merge(mapFrom(upper, '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵'), mapFrom(lower, range(0x1d4b6, 0x1d4cf))),
  boldScript: merge(mapFrom(upper, range(0x1d4d0, 0x1d4e9)), mapFrom(lower, range(0x1d4ea, 0x1d503))),
  fraktur: merge(mapFrom(upper, '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ'), mapFrom(lower, range(0x1d51e, 0x1d537))),
  doubleStruck: merge(mapFrom(upper, '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ'), mapFrom(lower, range(0x1d552, 0x1d56b)), mapFrom(digits, range(0x1d7d8, 0x1d7e1))),
  boldFraktur: merge(mapFrom(upper, range(0x1d56c, 0x1d585)), mapFrom(lower, range(0x1d586, 0x1d59f))),
  sans: merge(mapFrom(upper, range(0x1d5a0, 0x1d5b9)), mapFrom(lower, range(0x1d5ba, 0x1d5d3)), mapFrom(digits, range(0x1d7e2, 0x1d7eb))),
  sansBold: merge(mapFrom(upper, range(0x1d5d4, 0x1d5ed)), mapFrom(lower, range(0x1d5ee, 0x1d607)), mapFrom(digits, range(0x1d7ec, 0x1d7f5))),
  sansItalic: merge(mapFrom(upper, range(0x1d608, 0x1d621)), mapFrom(lower, range(0x1d622, 0x1d63b))),
  sansBoldItalic: merge(mapFrom(upper, range(0x1d63c, 0x1d655)), mapFrom(lower, range(0x1d656, 0x1d66f))),
  monospace: merge(mapFrom(upper, range(0x1d670, 0x1d689)), mapFrom(lower, range(0x1d68a, 0x1d6a3)), mapFrom(digits, range(0x1d7f6, 0x1d7ff))),
  fullwidth: merge(mapFrom(upper, range(0xff21, 0xff3a)), mapFrom(lower, range(0xff41, 0xff5a)), mapFrom(digits, range(0xff10, 0xff19))),
  circled: merge(mapFrom(upper, range(0x24b6, 0x24cf)), mapFrom(lower, range(0x24d0, 0x24e9)), mapFrom(digits, ['⓪','①','②','③','④','⑤','⑥','⑦','⑧','⑨'])),
  negativeCircled: merge(mapFrom(upper, range(0x1f150, 0x1f169)), mapFrom(digits, ['⓿','❶','❷','❸','❹','❺','❻','❼','❽','❾'])),
  squared: mapFrom(upper, range(0x1f130, 0x1f149)),
  parenthesized: merge(mapFrom(lower, range(0x249c, 0x24b5)), mapFrom(digits.slice(1), range(0x2474, 0x247c)))
};

const styles = [
  ['bold-serif','Bold Serif','Bold',['Social','Gaming'], t=>mapText(t,maps.boldSerif)],
  ['bold-sans','Bold Sans','Bold',['Social','Discord'], t=>mapText(t,maps.sansBold)],
  ['bold-italic','Bold Italic','Bold',['Social'], t=>mapText(t,maps.boldItalic)],
  ['double-struck','Double Struck','Bold',['Gaming'], t=>mapText(t,maps.doubleStruck)],
  ['heavy-brackets','Heavy Brackets','Bold',['Discord'], t=>`【${t}】`],
  ['strong-stars','Strong Stars','Bold',['Social/Gaming'], t=>`★ ${mapText(t,maps.sansBold)} ★`],
  ['cursive-script','Cursive Script','Cursive',['Social'], t=>mapText(t,maps.script)],
  ['bold-script','Bold Script','Cursive',['Social'], t=>mapText(t,maps.boldScript)],
  ['italic-serif','Italic Serif','Cursive',['Social'], t=>mapText(t,maps.italicSerif)],
  ['soft-cursive','Soft Cursive','Cursive',['Social'], t=>`♡ ${mapText(t,maps.script)} ♡`],
  ['script-sparkle','Script Sparkle','Cursive',['Social'], t=>`✧ ${mapText(t,maps.script)} ✧`],
  ['fraktur','Fraktur','Fancy',['Gaming'], t=>mapText(t,maps.fraktur)],
  ['bold-fraktur','Bold Fraktur','Fancy',['Gaming'], t=>mapText(t,maps.boldFraktur)],
  ['monospace','Monospace','Fancy',['Discord'], t=>mapText(t,maps.monospace)],
  ['circled','Circled','Fancy',['Social'], t=>mapText(t,maps.circled)],
  ['negative-circled','Dark Circled','Fancy',['Gaming'], t=>mapText(t,maps.negativeCircled)],
  ['squared-caps','Squared Caps','Fancy',['Gaming'], t=>mapText(t.toUpperCase(),maps.squared)],
  ['parenthesized','Parenthesized','Fancy',['Social'], t=>mapText(t.toLowerCase(),maps.parenthesized)],
  ['fullwidth','Fullwidth','Aesthetic',['Social'], t=>mapText(t,maps.fullwidth)],
  ['wide-spaced','Wide Spaced','Aesthetic',['Social'], t=>[...t].join(' ')],
  ['dot-spaced','Dot Spaced','Aesthetic',['Social'], t=>[...t].join(' · ')],
  ['small-caps','Small Caps','Aesthetic',['Discord','Gaming'], t=>mapText(t,smallCaps)],
  ['lower-aesthetic','Lowercase Aesthetic','Aesthetic',['Social'], t=>t.toLowerCase().split('').join(' ')],
  ['upper-aesthetic','Uppercase Aesthetic','Aesthetic',['Gaming'], t=>t.toUpperCase().split('').join(' ')],
  ['underline','Underline','Aesthetic',['Social'], t=>combine(t,'\u0332')],
  ['double-underline','Double Underline','Aesthetic',['Social'], t=>combine(t,'\u0333')],
  ['overline','Overline','Aesthetic',['Social'], t=>combine(t,'\u0305')],
  ['strike','Strike Through','Aesthetic',['Discord'], t=>combine(t,'\u0336')],
  ['slash','Slash Through','Aesthetic',['Discord'], t=>combine(t,'\u0337')],
  ['sparkle','Sparkle Wrap','Symbols',['Social'], t=>`✨ ${t} ✨`],
  ['star-wave','Star Wave','Symbols',['Gaming'], t=>`★彡 ${t} 彡★`],
  ['arrow','Arrow Wrap','Symbols',['Discord'], t=>`➜ ${t} ←`],
  ['hearts','Heart Wrap','Symbols',['Social'], t=>`♡ ${t} ♡`],
  ['diamonds','Diamond Wrap','Symbols',['Gaming'], t=>`◆ ${t} ◆`],
  ['moon','Moon Wrap','Symbols',['Social'], t=>`☾ ${t} ☽`],
  ['spark-bars','Spark Bars','Symbols',['Discord'], t=>`| ✦ ${t} ✦ |`],
  ['discord-code','Discord Code','Discord',['Discord'], t=>`\`${t}\``],
  ['discord-channel','Discord Channel','Discord',['Discord'], t=>`# ${t.toLowerCase().replace(/\s+/g,'-')}`],
  ['discord-role','Discord Role','Discord',['Discord'], t=>`@${t.replace(/\s+/g,'')}`],
  ['discord-announcement','Discord Announcement','Discord',['Discord'], t=>`>>> ${t}`],
  ['gaming-runes','Gaming Runes','Social/Gaming',['Gaming'], t=>`᚛${t}᚜`],
  ['gaming-clan','Gaming Clan Tag','Social/Gaming',['Gaming'], t=>`『${t}』`],
  ['social-bio','Social Bio','Social/Gaming',['Social'], t=>`･ﾟ: * ${t} * :ﾟ･`],
  ['creator-tag','Creator Tag','Social/Gaming',['Social'], t=>`「${t}」`],
  ['username-clean','Username Clean','Social/Gaming',['Gaming'], t=>t.trim().replace(/\s+/g,'_')]
].map(([id,name,category,tags,transform]) => ({id,name,category,tags,transform}));

function escapeHtml(s){return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function setStatus(message){ status.textContent = message; }
function matches(style, q){
  const haystack = [style.name, style.category, ...style.tags, style.id].join(' ').toLowerCase();
  return haystack.includes(q.trim().toLowerCase());
}
function encoding(style) { return style.id.toUpperCase().replaceAll('-', '_'); }
function selectElementText(node) {
  if (!node) return;
  const range = document.createRange();
  range.selectNodeContents(node);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  node.focus({ preventScroll: true });
}
function render(){
  const text = input.value || 'Your Text';
  const q = search.value || '';
  const visible = styles.filter(s => (activeCategory === 'All' || s.category === activeCategory || s.tags.includes(activeCategory)) && matches(s, q));
  count.textContent = `${visible.length} STYLES SHOWN · ${styles.length} REAL TRANSFORMS`;
  results.innerHTML = visible.map((style, index) => {
    const output = style.transform(text);
    const featured = index === 2 ? ' is-featured' : '';
    const favorite = favoriteIds.has(style.id);
    const newBadge = index === 0 ? '<span class="style-new">NEW</span>' : '';
    return `<article class="style-row${featured}" data-style-id="${style.id}">
      <div class="style-row-head">
        <div>
          <div class="style-title-line"><span class="style-encoding">ENCODING: ${encoding(style)}</span>${newBadge}</div>
          <div class="tagline">${escapeHtml(style.category)} · ${style.tags.map(escapeHtml).join(' · ')}</div>
        </div>
      </div>
      <div class="style-actions">
        <button type="button" class="icon-action-btn${favorite ? ' is-on' : ''}" data-favorite="${style.id}" aria-pressed="${favorite}" aria-label="Favorite ${escapeHtml(style.name)} style"><span class="material-symbols-outlined">${favorite ? 'star' : 'star_border'}</span></button>
        <button type="button" class="icon-copy" data-copy="${style.id}" aria-label="Copy ${escapeHtml(style.name)} style"><span class="material-symbols-outlined">content_copy</span></button>
      </div>
      <div class="style-output" data-output tabindex="0" aria-label="${escapeHtml(style.name)} generated style preview">${escapeHtml(output)}</div>
    </article>`;
  }).join('') || '<p class="empty-state">No styles match that filter. Try All, Bold, Cursive, Fancy, Aesthetic, Symbols, Discord, or Social / Gaming.</p>';
}
async function copyStyle(id){
  const style = styles.find(s => s.id === id);
  if (!style) return;
  const value = style.transform(input.value || 'Your Text');
  const row = document.querySelector(`[data-style-id="${id}"]`);
  const button = row?.querySelector('[data-copy]');
  const icon = button?.querySelector('.material-symbols-outlined');
  try {
    await navigator.clipboard.writeText(value);
    row?.classList.add('copied');
    button?.classList.add('copied');
    if (icon) icon.textContent = 'check';
    setStatus(`Copied ${style.name}.`);
    setTimeout(() => {
      row?.classList.remove('copied');
      button?.classList.remove('copied');
      if (icon) icon.textContent = 'content_copy';
    }, 1500);
  } catch (err) {
    selectElementText(row?.querySelector('[data-output]'));
    setStatus('Copy failed. The generated output is selected so you can copy it manually.');
  }
}
function toggleFavorite(id) {
  if (favoriteIds.has(id)) favoriteIds.delete(id); else favoriteIds.add(id);
  render();
  const style = styles.find(s => s.id === id);
  if (style) setStatus(`${favoriteIds.has(id) ? 'Favorited' : 'Removed favorite'} ${style.name}.`);
}
input.addEventListener('input', render);
search.addEventListener('input', render);
categoryButtons.forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  categoryButtons.forEach(b => b.classList.toggle('active', b === button));
  render();
}));
results.addEventListener('click', e => {
  const copyButton = e.target.closest('[data-copy]');
  if (copyButton) return copyStyle(copyButton.dataset.copy);
  const favoriteButton = e.target.closest('[data-favorite]');
  if (favoriteButton) return toggleFavorite(favoriteButton.dataset.favorite);
});
render();
