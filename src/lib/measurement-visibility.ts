/** Visibility for impressions and section attention; never reads field values. */
export function measurementVisible(el: Element, w: Window, doc: Document, checkCover = true) {
  for (let node: Element | null = el; node; node = node.parentElement) {
    const html = node as HTMLElement;
    if (html.hidden || html.inert || (node.getAttribute?.('aria-hidden') === 'true' && node.getAttribute?.('data-measure-clone') !== 'true')) return false;
    if (typeof w.getComputedStyle === 'function') {
      const style = w.getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse' || Number(style.opacity) <= .05) return false;
    }
  }
  if (!checkCover || typeof doc.elementFromPoint !== 'function') return true;
  const r = el.getBoundingClientRect();
  const left = Math.max(0, r.left), right = Math.min(w.innerWidth, r.right);
  const top = Math.max(0, r.top), bottom = Math.min(w.innerHeight, r.bottom);
  if (right <= left || bottom <= top) return false;
  // A sticky card can cover another card without changing its geometry.
  const samples = [[.5,.5],[.2,.2],[.8,.2],[.2,.8],[.8,.8]];
  let seen = 0;
  for (const [x,y] of samples) {
    const hit = doc.elementFromPoint(left + (right-left)*x, top + (bottom-top)*y);
    if (hit && (hit === el || el.contains?.(hit))) seen++;
  }
  return seen >= 3;
}
