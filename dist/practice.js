// Student practice helpers: option order, short-answer grading and on-device progress.
// Pure functions are exported so scripts/verify.mjs can test them without a browser.

function seededRandom(seedText) {
  let h = 2166136261;
  for (const ch of seedText) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; };
}

// Deterministic per question, so a reload keeps the same order but answers are spread across positions.
export function shuffledOptions(lessonId, qIndex, options) {
  const order = options.map((option, index) => ({option, index}));
  const random = seededRandom(`${lessonId}#${qIndex}`);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export const isAutoGradable = (lesson, q) => q.type === 'short' && (lesson.subject === '수학' || Array.isArray(q.accept));

const toHalfWidth = s => s.replace(/[！-～]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
export const normalizeAnswer = s => toHalfWidth(String(s ?? '')).normalize('NFC').toLowerCase()
  .replace(/(\d),(?=\d{3}(?!\d))/g, '$1').replace(/[\s.。!?]+$/g, '').replace(/\s+/g, '');
const numbers = s => s.match(/\d+(?:[./]\d+)?/g) || [];
const units = s => s.replace(/\d+(?:[./]\d+)?/g, '').replace(/[,·]/g, '');

function matches(expected, given) {
  const e = normalizeAnswer(expected), g = normalizeAnswer(given);
  if (!g) return false;
  if (e === g) return true;
  const en = numbers(e), gn = numbers(g);
  if (!en.length || en.join('|') !== gn.join('|')) return false;
  // Same numbers: accept no unit at all (e.g. "425" for "425권") or exactly the same words/units.
  return units(g) === '' ? en.length === 1 : units(g) === units(e);
}

export function gradeShort(q, input) {
  return [q.answer, ...(q.accept || [])].some(answer => matches(answer, input));
}

const PROGRESS_KEY = 'lg-progress-v1';
const TEACHER_KEY = 'lg-teacher';
function storage() { try { return window.localStorage; } catch { return null; } }

export function readProgress() {
  try { const data = JSON.parse(storage()?.getItem(PROGRESS_KEY) || '{}'); return data && typeof data === 'object' ? data : {}; }
  catch { return {}; }
}
export function markComplete(lessonId) {
  const data = readProgress();
  if (data[lessonId]) return false;
  data[lessonId] = {done: true, at: new Date().toISOString().slice(0, 10)};
  try { storage()?.setItem(PROGRESS_KEY, JSON.stringify(data)); } catch {}
  return true;
}
export function clearProgress() { try { storage()?.removeItem(PROGRESS_KEY); } catch {} }

export function isTeacherMode() { try { return storage()?.getItem(TEACHER_KEY) === '1'; } catch { return false; } }
export function setTeacherMode(on) { try { on ? storage()?.setItem(TEACHER_KEY, '1') : storage()?.removeItem(TEACHER_KEY); } catch {} }
