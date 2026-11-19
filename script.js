document.documentElement.classList.add('js-ready');

// ==========================================
// 1. JAM LOKAL TANGERANG SELATAN (WIB)
// ==========================================
const wibClock = document.getElementById('wibClock');

function updateWibClock() {
  if (!wibClock) return;
  const now = new Date();
  const formatted = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  });
  wibClock.textContent = `${formatted} WIB`;
}

updateWibClock();
setInterval(updateWibClock, 15000);

// ==========================================
// 2. THEME SWITCHER (MODE KERTAS / TINTA)
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const metaThemeColor = document.getElementById('metaThemeColor');
const THEME_KEY = 'ega_portfolio_theme';

function applyTheme(theme) {
  const normalized = theme === 'ink' ? 'ink' : 'paper';
  document.documentElement.setAttribute('data-theme', normalized);
  if (themeLabel) {
    themeLabel.textContent = normalized === 'ink' ? 'Mode Kertas' : 'Mode Tinta';
  }
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', normalized === 'ink' ? '#131311' : '#f4f1ea');
  }
}

try {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);
} catch {
  // Abaikan jika storage dibatasi
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'ink' ? 'paper' : 'ink';
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Abaikan jika storage dibatasi
    }
  });
}

// ==========================================
// 3. MENU NAVIGASI MOBILE
// ==========================================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const siteHeader = document.getElementById('top');

function closeMobileMenu() {
  if (!menuToggle || !mobileMenu) return;
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isHidden = mobileMenu.hidden;
    mobileMenu.hidden = !isHidden;
    menuToggle.setAttribute('aria-expanded', String(isHidden));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('click', (e) => {
    if (!mobileMenu.hidden && siteHeader && !siteHeader.contains(e.target)) {
      closeMobileMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 780 && !mobileMenu.hidden) {
      closeMobileMenu();
    }
  });
}

// ==========================================
// 4. SCROLL REVEAL & NAV ACTIVE STATE
// ==========================================
const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-list a');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
          });
        }
      });
    },
    { rootMargin: '-35% 0px -55% 0px' }
  );
  sections.forEach((sec) => navObserver.observe(sec));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

// ==========================================
// 5. MODAL STUDI KASUS PROYEK
// ==========================================
const CASE_STUDIES = {
  'kopi-roti': {
    category: 'STUDI KASUS 01 · APLIKASI DESKTOP & BASIS DATA',
    title: 'Kopi & Roti — Sistem Kasir Desktop (Point-of-Sale)',
    context:
      'Usaha kedai kopi dan roti membutuhkan sistem kasir yang cepat dioperasikan pada jam sibuk, mampu membatasi akses berdasarkan operator yang bertugas, serta mencatat riwayat penjualan ke basis data relasional tanpa bergantung pada pencatatan manual.',
    solution:
      'Aplikasi dibangun menggunakan C# (.NET Windows Forms) sebagai antarmuka desktop yang responsif, terhubung ke server database MySQL yang dikelola melalui phpMyAdmin. Setiap transaksi diverifikasi dari akun operator aktif sebelum disimpan ke tabel transaksi dan dikirim ke modul cetak struk termal.',
    flow: [
      { step: 'Langkah 01', label: 'Login & Validasi Operator' },
      { step: 'Langkah 02', label: 'Pemilihan Menu & Hitung Total' },
      { step: 'Langkah 03', label: 'Simpan Transaksi ke MySQL' },
      { step: 'Langkah 04', label: 'Cetak Struk Termal Pelanggan' },
    ],
    highlights: [
      'Otentikasi operator khusus untuk memastikan kejelasan tanggung jawab tiap sesi kasir.',
      'Integrasi CRUD dan pencatatan transaksi langsung ke basis data MySQL melalui phpMyAdmin.',
      'Modul cetak struk termal agar pelanggan menerima bukti pembayaran secara instan.',
    ],
    stack: 'C# · .NET Windows Forms · MySQL · phpMyAdmin · Thermal Receipt Module',
  },
  'upcycle-master': {
    category: 'STUDI KASUS 02 · GENERATIVE AI & SUSTAINABILITY',
    title: 'Upcycle Master — Asisten Cerdas Daur Ulang Limbah',
    context:
      'Banyak sampah rumah tangga seperti kemasan plastik, kardus, atau botol kaca masih dapat dimanfaatkan kembali. Namun, masyarakat sering kesulitan membayangkan cara mengubahnya menjadi barang yang benar-benar berguna dan aman dibuat di rumah.',
    solution:
      'Platform ini dikembangkan menggunakan AWS PartyRock dengan merancang rangkaian widget dan teknik Prompt Engineering yang terstruktur. Pengguna memasukkan jenis limbah yang dimiliki, lalu AI menganalisis karakteristik bahan dan menyusun panduan daur ulang langkah demi langkah.',
    flow: [
      { step: 'Langkah 01', label: 'Input Jenis Limbah Harian' },
      { step: 'Langkah 02', label: 'Klasifikasi & Kelayakan Bahan' },
      { step: 'Langkah 03', label: 'Prompt Chain Ide Fungsional' },
      { step: 'Langkah 04', label: 'Panduan Langkah Kerja Ramah Lingkungan' },
    ],
    highlights: [
      'Struktur prompt dirancang agar keluaran AI tetap praktis, realistis, dan berorientasi fungsi.',
      'Menjembatani pemahaman limbah rumah tangga menjadi produk daur ulang yang bernilai guna.',
      'Antarmuka alur widget interaktif yang cepat diuji tanpa proses instalasi rumit.',
    ],
    stack: 'AWS PartyRock · Generative AI · Prompt Engineering',
  },
  'safe-space': {
    category: 'STUDI KASUS 03 · ARSITEKTUR SISTEM & UI/UX FLOW',
    title: 'Safe-Space — Arsitektur Web Konseling Siswa Anonim',
    context:
      'Banyak siswa membutuhkan tempat untuk berkonsultasi mengenai tekanan belajar maupun persoalan pribadi, tetapi enggan menggunakan layanan formal karena khawatir identitasnya diketahui atau merasa canggung oleh antarmuka yang kaku.',
    solution:
      'Merancang arsitektur sistem web dan User Flow khusus yang menempatkan anonimitas sebagai fondasi utama. Pendekatan antarmuka memadukan navigasi yang minim gesekan dengan penerapan psikologi warna untuk menciptakan rasa tenang dan aman sejak halaman pertama.',
    flow: [
      { step: 'Langkah 01', label: 'Akses Masuk Tanpa Eksposur Identitas' },
      { step: 'Langkah 02', label: 'Pemetaan Topik & Suasana Hati' },
      { step: 'Langkah 03', label: 'Ruang Konseling Bernuansa Tenang' },
      { step: 'Langkah 04', label: 'Ringkasan & Opsi Dukungan Lanjut' },
    ],
    highlights: [
      'Arsitektur sistem dirancang agar siswa tetap terlindungi secara anonim sepanjang alur sesi.',
      'Pemilihan palet berdasarkan psikologi warna untuk membantu meredakan kecemasan awal pengguna.',
      'User Flow ringkas sehingga pengguna dalam kondisi cemas tidak dibebani formulir panjang.',
    ],
    stack: 'System Design · UI/UX User Flow · Web Architecture · Color Psychology',
  },
};

const projectModal = document.getElementById('projectModal');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalCloseBtn = document.getElementById('modalCloseBtn');
let lastFocusedElement = null;

function createModalSection(headingText, contentNode) {
  const sec = document.createElement('section');
  sec.className = 'modal-section';
  const h3 = document.createElement('h3');
  h3.textContent = headingText;
  sec.appendChild(h3);
  sec.appendChild(contentNode);
  return sec;
}

function openCaseStudy(projectKey, triggerEl) {
  const data = CASE_STUDIES[projectKey];
  if (!data || !projectModal || !modalBody) return;

  lastFocusedElement = triggerEl || document.activeElement;
  modalCategory.textContent = data.category;
  modalTitle.textContent = data.title;
  modalBody.innerHTML = '';

  const contextP = document.createElement('p');
  contextP.textContent = data.context;
  modalBody.appendChild(createModalSection('Konteks & Masalah', contextP));

  const solutionP = document.createElement('p');
  solutionP.textContent = data.solution;
  modalBody.appendChild(createModalSection('Pendekatan & Arsitektur Solusi', solutionP));

  const flowGrid = document.createElement('div');
  flowGrid.className = 'modal-flow';
  data.flow.forEach((item) => {
    const box = document.createElement('div');
    box.className = 'modal-flow-step';
    const span = document.createElement('span');
    span.textContent = item.step;
    const strong = document.createElement('strong');
    strong.textContent = item.label;
    box.appendChild(span);
    box.appendChild(strong);
    flowGrid.appendChild(box);
  });
  modalBody.appendChild(createModalSection('Alur Kerja Sistem', flowGrid));

  const list = document.createElement('ul');
  list.className = 'modal-list';
  data.highlights.forEach((point) => {
    const li = document.createElement('li');
    li.textContent = point;
    list.appendChild(li);
  });
  modalBody.appendChild(createModalSection('Poin Implementasi Utama', list));

  const stackP = document.createElement('p');
  stackP.textContent = data.stack;
  modalBody.appendChild(createModalSection('Teknologi & Konsep', stackP));

  projectModal.hidden = false;
  document.body.style.overflow = 'hidden';
  if (modalCloseBtn) modalCloseBtn.focus();
}

function closeCaseStudy() {
  if (!projectModal || projectModal.hidden) return;
  projectModal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

document.querySelectorAll('.btn-case-study').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-project');
    openCaseStudy(key, btn);
  });
});

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeCaseStudy);
}

if (projectModal) {
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeCaseStudy();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCaseStudy();
    closeMobileMenu();
  }
});

// ==========================================
// 6. PEMUTAR AUDIO & VIDEO PERSONAL
// ==========================================
const favAudio = document.getElementById('favAudio');
const musicPlayerCard = document.getElementById('musicPlayerCard');
const audioPlayBtn = document.getElementById('audioPlayBtn');
const iconPlay = document.getElementById('iconPlay');
const iconPause = document.getElementById('iconPause');
const audioStateBadge = document.getElementById('audioStateBadge');
const audioCurrentTime = document.getElementById('audioCurrentTime');
const audioDuration = document.getElementById('audioDuration');
const audioProgressRail = document.getElementById('audioProgressRail');
const audioProgressFill = document.getElementById('audioProgressFill');
const audioFilePicker = document.getElementById('audioFilePicker');
const trackTitleText = document.getElementById('trackTitleText');
const trackArtistText = document.getElementById('trackArtistText');

const favVideo = document.getElementById('favVideo');
const videoPlayBtn = document.getElementById('videoPlayBtn');
const videoStateBadge = document.getElementById('videoStateBadge');
const videoFilePicker = document.getElementById('videoFilePicker');

function formatTime(sec) {
  if (!isFinite(sec) || isNaN(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function setAudioVisualState(state) {
  const isPlaying = state === 'playing';
  if (iconPlay) iconPlay.style.display = isPlaying ? 'none' : 'block';
  if (iconPause) iconPause.style.display = isPlaying ? 'block' : 'none';
  if (musicPlayerCard) musicPlayerCard.classList.toggle('playing', isPlaying);
  if (audioStateBadge) {
    audioStateBadge.classList.toggle('active', isPlaying);
    if (state === 'playing') audioStateBadge.textContent = 'Sedang Diputar';
    else if (state === 'paused') audioStateBadge.textContent = 'Dijeda';
    else if (state === 'error') audioStateBadge.textContent = 'File Tidak Tersedia';
    else audioStateBadge.textContent = 'Siap Diputar';
  }
}

if (favAudio && audioPlayBtn) {
  favAudio.addEventListener('loadedmetadata', () => {
    if (isFinite(favAudio.duration) && audioDuration) {
      audioDuration.textContent = formatTime(favAudio.duration);
    }
  });

  audioPlayBtn.addEventListener('click', () => {
    if (favAudio.paused) {
      if (favVideo && !favVideo.paused) favVideo.pause();
      favAudio.play().catch(() => {
        setAudioVisualState('error');
      });
    } else {
      favAudio.pause();
    }
  });

  favAudio.addEventListener('play', () => {
    if (favVideo && !favVideo.paused) favVideo.pause();
    setAudioVisualState('playing');
  });

  favAudio.addEventListener('pause', () => {
    if (!favAudio.ended) setAudioVisualState('paused');
  });

  favAudio.addEventListener('ended', () => {
    setAudioVisualState('ready');
    if (audioProgressFill) audioProgressFill.style.width = '0%';
    if (audioCurrentTime) audioCurrentTime.textContent = '0:00';
    if (audioProgressRail) audioProgressRail.setAttribute('aria-valuenow', '0');
  });

  favAudio.addEventListener('timeupdate', () => {
    const cur = favAudio.currentTime;
    const dur = isFinite(favAudio.duration) && favAudio.duration > 0 ? favAudio.duration : 326;
    const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
    if (audioCurrentTime) audioCurrentTime.textContent = formatTime(cur);
    if (audioProgressFill) audioProgressFill.style.width = `${pct}%`;
    if (audioProgressRail) audioProgressRail.setAttribute('aria-valuenow', String(Math.round(pct)));
  });

  function seekAudioFromClientX(clientX) {
    if (!audioProgressRail) return;
    const rect = audioProgressRail.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const dur = isFinite(favAudio.duration) && favAudio.duration > 0 ? favAudio.duration : 326;
    favAudio.currentTime = ratio * dur;
    if (audioProgressFill) audioProgressFill.style.width = `${ratio * 100}%`;
  }

  let isSeekingAudio = false;
  let activeAudioObjectUrl = null;

  if (audioProgressRail) {
    audioProgressRail.style.touchAction = 'none';
    audioProgressRail.addEventListener('pointerdown', (e) => {
      isSeekingAudio = true;
      audioProgressRail.setPointerCapture(e.pointerId);
      seekAudioFromClientX(e.clientX);
    });
    audioProgressRail.addEventListener('pointermove', (e) => {
      if (isSeekingAudio) seekAudioFromClientX(e.clientX);
    });
    audioProgressRail.addEventListener('pointerup', () => {
      isSeekingAudio = false;
    });
    audioProgressRail.addEventListener('pointercancel', () => {
      isSeekingAudio = false;
    });
    audioProgressRail.addEventListener('keydown', (e) => {
      const dur = isFinite(favAudio.duration) && favAudio.duration > 0 ? favAudio.duration : 326;
      if (e.key === 'ArrowRight') {
        favAudio.currentTime = Math.min(dur, favAudio.currentTime + 5);
      } else if (e.key === 'ArrowLeft') {
        favAudio.currentTime = Math.max(0, favAudio.currentTime - 5);
      }
    });
  }

  if (audioFilePicker) {
    audioFilePicker.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (activeAudioObjectUrl) URL.revokeObjectURL(activeAudioObjectUrl);
      activeAudioObjectUrl = URL.createObjectURL(file);
      favAudio.src = activeAudioObjectUrl;
      if (trackTitleText) trackTitleText.textContent = file.name.replace(/\.[^/.]+$/, '');
      if (trackArtistText) trackArtistText.textContent = 'File Audio Lokal';
      favAudio.play().catch(() => setAudioVisualState('error'));
    });
  }
}

if (favVideo && videoPlayBtn) {
  let activeVideoObjectUrl = null;
  function syncVideoUI(state) {
    const playing = state === 'playing';
    videoPlayBtn.textContent = playing ? 'Jeda Klip' : 'Putar Klip';
    if (videoStateBadge) {
      videoStateBadge.classList.toggle('active', playing);
      if (state === 'playing') videoStateBadge.textContent = 'Diputar';
      else if (state === 'paused') videoStateBadge.textContent = 'Dijeda';
      else if (state === 'error') videoStateBadge.textContent = 'File Tidak Tersedia';
      else videoStateBadge.textContent = 'Siap Diputar';
    }
  }

  videoPlayBtn.addEventListener('click', () => {
    if (favVideo.paused) {
      if (favAudio && !favAudio.paused) favAudio.pause();
      favVideo.play().catch(() => syncVideoUI('error'));
    } else {
      favVideo.pause();
    }
  });

  favVideo.addEventListener('play', () => {
    if (favAudio && !favAudio.paused) favAudio.pause();
    syncVideoUI('playing');
  });

  favVideo.addEventListener('pause', () => {
    syncVideoUI(favVideo.ended ? 'ready' : 'paused');
  });

  favVideo.addEventListener('ended', () => {
    syncVideoUI('ready');
  });

  if (videoFilePicker) {
    videoFilePicker.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (activeVideoObjectUrl) URL.revokeObjectURL(activeVideoObjectUrl);
      activeVideoObjectUrl = URL.createObjectURL(file);
      favVideo.src = activeVideoObjectUrl;
      favVideo.play().catch(() => syncVideoUI('error'));
    });
  }
}
