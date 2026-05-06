// tresor.js — fetches the encrypted gift card, derives an AES-256-GCM
// key from the entered password (PBKDF2-SHA256, 600k iterations),
// decrypts in the browser, and reveals the PDF. The plaintext PDF
// never lives on disk or in git.
//
// Wire format (matches scripts/encrypt-present.mjs):
//   salt(16) | iv(12) | ciphertext+tag(rest)

(function () {
  const ENC_PATH = '/assets/present/Geschenkkarte.enc';
  const PBKDF2_ITERATIONS = 600000;
  const SALT_LEN = 16;
  const IV_LEN = 12;

  const tresor = document.getElementById('tresor');
  const form = document.getElementById('tresorForm');
  const input = document.getElementById('tresorPw');
  const status = document.getElementById('tresor-status');
  const reveal = document.getElementById('tresorReveal');
  const pdfFrame = document.getElementById('tresorPdf');
  const dlLink = document.getElementById('tresorDl');
  if (!tresor || !form || !input) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  let encryptedBlob = null;
  let unlocked = false;

  async function loadBlob() {
    if (encryptedBlob) return encryptedBlob;
    const res = await fetch(ENC_PATH, { cache: 'force-cache' });
    if (!res.ok) throw new Error('Tresor-Inhalt nicht erreichbar (HTTP ' + res.status + ').');
    encryptedBlob = new Uint8Array(await res.arrayBuffer());
    return encryptedBlob;
  }

  async function deriveKey(password, salt) {
    const baseKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
  }

  async function unlock(password) {
    const blob = await loadBlob();
    const salt = blob.slice(0, SALT_LEN);
    const iv = blob.slice(SALT_LEN, SALT_LEN + IV_LEN);
    const ctWithTag = blob.slice(SALT_LEN + IV_LEN);
    const key = await deriveKey(password, salt);
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ctWithTag
    );
    return new Blob([plaintext], { type: 'application/pdf' });
  }

  function setStatus(msg) { status.textContent = msg || ''; }

  function showWrong() {
    tresor.classList.remove('is-spinning', 'is-open');
    tresor.classList.add('is-wrong');
    setStatus('Hmm. Falsches Zauberwort.');
    setTimeout(() => tresor.classList.remove('is-wrong'), 900);
    input.focus();
    input.select();
  }

  function showOpen(pdfBlob) {
    const url = URL.createObjectURL(pdfBlob);
    pdfFrame.src = url;
    dlLink.href = url;
    tresor.classList.remove('is-spinning', 'is-wrong');
    tresor.classList.add('is-open');
    reveal.hidden = false;
    setStatus('Offen!');
    unlocked = true;
    // Slight delay so the door-swing has a moment before scrolling.
    setTimeout(() => {
      reveal.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (unlocked) return;

    const pw = input.value.trim();
    if (!pw) { input.focus(); return; }

    submitBtn.disabled = true;
    tresor.classList.remove('is-wrong');
    // Restart the spin animation cleanly even if it was just running.
    tresor.classList.remove('is-spinning');
    void tresor.offsetWidth;
    tresor.classList.add('is-spinning');
    setStatus('Knack… knack…');

    try {
      const pdfBlob = await unlock(pw);
      showOpen(pdfBlob);
    } catch (err) {
      // crypto.subtle.decrypt throws OperationError on auth-tag mismatch
      // (i.e. wrong password OR corrupted blob).
      if (err && err.name === 'OperationError') {
        showWrong();
      } else {
        tresor.classList.remove('is-spinning');
        setStatus('Fehler: ' + (err && err.message ? err.message : err));
      }
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
