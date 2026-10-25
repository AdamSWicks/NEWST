/* New Street Clothing: recoverable Klaviyo embed loading and submission. */
(() => {
  const embed = document.querySelector('.klaviyo-form-TCY79p');
  if (!embed) return;
  const key = 'newstreet-signup-retry';
  const panel = document.createElement('div');
  panel.setAttribute('role', 'status');
  panel.setAttribute('aria-live', 'polite');
  panel.style.cssText = 'max-width:780px;margin:16px auto;color:#E9E8E4;font:14px/1.6 Arial,Helvetica,sans-serif;text-align:center;';
  const message = document.createElement('p');
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.textContent = 'Retry signup';
  retry.style.cssText = 'padding:12px 20px;min-height:44px;border:1px solid #B79B7D;background:#0C0D0E;color:#E9E8E4;font:inherit;cursor:pointer;';
  panel.append(message, retry);
  panel.hidden = true;
  embed.after(panel);
  let pending = false, submitTimer, loadTimer, lastEmail = '', restored = false;
  let saved, restoreRequested = false;
  try { saved = JSON.parse(sessionStorage.getItem(key)); sessionStorage.removeItem(key); } catch (_) {}
  if (saved && Date.now() - saved.time < 10 * 60 * 1000 && typeof saved.email === 'string') { lastEmail = saved.email; restoreRequested = true; }
  function show(text) { message.textContent = text; panel.hidden = false; retry.disabled = !navigator.onLine; }
  function hide() { panel.hidden = true; }
  function input() { return embed.querySelector('input[type="email"]'); }
  function success() { return !input() && /ONE MORE STEP/i.test(embed.textContent); }
  function offline() { show('You’re offline. Reconnect, then choose Retry signup. Your email will be kept; nothing will be submitted automatically.'); }
  function remember() { const field = input(); if (field) lastEmail = field.value; }
  function guard(event) {
    const target = event.target;
    const submit = event.type === 'submit' || (event.type === 'click' && target.closest('button')) || (event.type === 'keydown' && event.key === 'Enter');
    if (!submit || !embed.contains(target)) return;
    remember();
    if (!navigator.onLine) { event.preventDefault(); event.stopImmediatePropagation(); offline(); return; }
    const field = input();
    if (!field || !field.validity.valid || pending) return;
    pending = true;
    hide();
    clearTimeout(submitTimer);
    submitTimer = setTimeout(() => {
      if (success()) return;
      show('We haven’t been able to confirm your signup. Check your inbox first. If no confirmation arrived, choose Retry signup. Your email will be kept.');
    }, 15000);
  }
  // Window capture runs before the embed's own handlers, including React delegation.
  ['submit', 'click', 'keydown'].forEach(type => window.addEventListener(type, guard, true));
  embed.addEventListener('input', remember, true);
  function observe() {
    if (success()) { pending = false; clearTimeout(submitTimer); clearTimeout(loadTimer); lastEmail = ''; hide(); return; }
    const field = input();
    if (field) {
      clearTimeout(loadTimer);
      if (restoreRequested && !restored && lastEmail) {
        restored = true;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(field, lastEmail);
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        show('Your email has been restored. Select Request early access to try again.');
      }
    }
  }
  new MutationObserver(observe).observe(embed, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
  function startLoadingCheck() {
    clearTimeout(loadTimer);
    if (input() || success()) return;
    loadTimer = setTimeout(() => {
      if (!input() && !success()) show('The signup form is taking longer than expected. Check your connection, then choose Retry signup.');
    }, 15000);
  }
  retry.addEventListener('click', () => {
    if (!navigator.onLine) { offline(); return; }
    remember();
    try { sessionStorage.setItem(key, JSON.stringify({ email: lastEmail, time: Date.now() })); }
    catch (_) { show('Your browser could not keep the email for a refresh. Copy it before refreshing the page.'); return; }
    location.reload();
  });
  window.addEventListener('offline', () => { remember(); if (!success()) offline(); });
  window.addEventListener('online', () => {
    if (!panel.hidden) show('You’re back online. Choose Retry signup to reload the form with your email.');
  });
  // Preview forms load lazily; start the timeout only when signup is approached.
  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { startLoadingCheck(); visibility.disconnect(); }
    }, { rootMargin: '200px' });
    visibility.observe(embed);
  } else startLoadingCheck();
  observe();
  if (!navigator.onLine && !success()) offline();
})();
