// ============================================
// МедСовет — Основной скрипт
// ============================================

// ========== БАЗА ЗНАНИЙ ИИ ==========
const medicalKnowledge = {
    'головная боль': {
        keywords: ['голова', 'болит', 'головная', 'мигрень'],
        response: `**Возможные причины головной боли:**
• Стресс и переутомление
• Повышенное или пониженное давление
• Мигрень
• Обезвоживание

**Что сделать:**
1. Измерьте давление
2. Выпейте воды
3. Парацетамол или ибупрофен (если нет противопоказаний)
4. Отдохните в тёмной комнате

🚩 **Срочно к врачу:** если боль внезапная, очень сильная, с нарушением речи.`
    },
    'температура': {
        keywords: ['температура', 'жар', 'лихорадка'],
        response: `**Температура — защитная реакция.**

**До 38°C:** не сбивать, обильное питьё, отдых.
**Выше 38.5°C:** парацетамол 500 мг или ибупрофен 200-400 мг.

🚑 **Скорую:** если >40°C, судороги, спутанность сознания.`
    },
    'простуда': {
        keywords: ['простуда', 'орви', 'насморк', 'кашель', 'горло'],
        response: `**ОРВИ — вирусная инфекция.**

• Обильное тёплое питьё
• Промывание носа солевым раствором
• Парацетамол при температуре
• Отдых и проветривание

Антибиотики при ОРВИ бесполезны. Если симптомы >7 дней — к терапевту.`
    },
    'давление': {
        keywords: ['давление', 'тонометр', 'гипертония'],
        response: `**Норма:** 120/80 мм рт.ст.

**Повышенное (>140/90):** исключить кофе и соль, глубокое дыхание, измерить повторно через 15 мин.
**Пониженное (<90/60):** выпить крепкий чай, съесть солёное, лечь с приподнятыми ногами.

⚠️ Ведите дневник давления для врача.`
    },
    'аллергия': {
        keywords: ['аллергия', 'чихаю', 'сыпь', 'пыльца'],
        response: `**Аллергия — реакция иммунной системы.**

• Антигистаминные (цетиризин, лоратадин)
• Промывание носа физраствором
• Исключить контакт с аллергеном

🚑 **Скорую:** если отёк губ/языка, затруднение дыхания.`
    },
    'бессонница': {
        keywords: ['бессонница', 'сон', 'не сплю', 'заснуть'],
        response: `**Гигиена сна:**
1. Ложитесь и вставайте в одно время
2. За час до сна — без телефона
3. Проветрите комнату (18-20°C)
4. Тёплый душ
5. Без кофеина после 15:00

Если бессонница >3 недель — к сомнологу.`
    },
    'тревога': {
        keywords: ['тревога', 'паника', 'страх', 'нервы', 'стресс'],
        response: `**При панической атаке:**
1. Напомните себе: "Это пройдёт, я в безопасности"
2. Дыхание квадратом: вдох 4 сек, задержка 4, выдох 4, задержка 4
3. Заземление: найдите 5 предметов вокруг, 4 звука, 3 ощущения
4. Умойтесь холодной водой

👨‍⚕️ Панические атаки лечатся — обратитесь к психотерапевту.`
    }
};

function findAnswer(query) {
    const q = query.toLowerCase();
    let bestMatch = null, bestScore = 0;
    for (const [key, data] of Object.entries(medicalKnowledge)) {
        let score = 0;
        for (const kw of data.keywords) { if (q.includes(kw)) score += kw.length; }
        if (q.includes(key)) score += 2;
        if (score > bestScore) { bestScore = score; bestMatch = data; }
    }
    return bestScore > 1 ? bestMatch.response : null;
}

function generateFallback(q) {
    if (q.length < 10) return 'Опишите подробнее. Что беспокоит?';
    if (q.includes('что делать')) return 'Уточните симптомы — и я помогу точнее. А пока: не паникуйте, оцените серьёзность, при сомнениях — к терапевту.';
    return 'Рекомендую проконсультироваться с врачом. Перейдите во вкладку **«Врачи»** — там вы найдёте специалистов.';
}

// ========== ДАННЫЕ ВРАЧЕЙ ==========
let doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
if (doctors.length === 0) {
    doctors = [
        {
            id: 1, name: 'Иванова Анна Сергеевна', speciality: 'therapist',
            experience: 12, price: 800, photo: '',
            description: 'Врач-терапевт высшей категории. Диагностика и лечение внутренних болезней.',
            reviews: [
                { stars: 5, text: 'Очень внимательный врач! Подробно всё объяснила.', author: 'Марина' },
                { stars: 4, text: 'Хорошая консультация, спасибо.', author: 'Игорь' }
            ]
        },
        {
            id: 2, name: 'Петров Дмитрий Валерьевич', speciality: 'neurologist',
            experience: 8, price: 1200, photo: '',
            description: 'Невролог. Лечение головных болей, остеохондроза, невралгий.',
            reviews: [
                { stars: 5, text: 'Помог с мигренью, которую годами не могли вылечить!', author: 'Ольга' }
            ]
        },
        {
            id: 3, name: 'Сидорова Елена Викторовна', speciality: 'pediatrician',
            experience: 15, price: 600, photo: '',
            description: 'Педиатр с 15-летним стажем. Консультации по детям от 0 до 18 лет.',
            reviews: []
        },
        {
            id: 4, name: 'Козлов Андрей Игоревич', speciality: 'psychiatrist',
            experience: 10, price: 1500, photo: '',
            description: 'Психиатр, психотерапевт. Лечение тревожных расстройств, депрессии.',
            reviews: [
                { stars: 5, text: 'Очень помог в сложный период. Рекомендую.', author: 'Дмитрий' },
                { stars: 5, text: 'Профессионал своего дела.', author: 'Анна' }
            ]
        }
    ];
    localStorage.setItem('doctors', JSON.stringify(doctors));
}

// ========== СОСТОЯНИЕ ==========
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let currentPage = 'home';
let selectedDoctorId = null;
let selectedRating = 0;

// ========== DOM ==========
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const charCount = document.getElementById('charCount');
const themeToggle = document.getElementById('themeToggle');
const doctorsGrid = document.getElementById('doctorsGrid');
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

// ========== ТЁМНАЯ ТЕМА ==========
let darkTheme = localStorage.getItem('darkTheme') === 'true';
function applyTheme() {
    document.body.classList.toggle('dark', darkTheme);
    themeToggle.textContent = darkTheme ? '☀️' : '🌙';
}
themeToggle.addEventListener('click', () => {
    darkTheme = !darkTheme;
    localStorage.setItem('darkTheme', darkTheme);
    applyTheme();
});
applyTheme();

// ========== НАВИГАЦИЯ ==========
function showPage(pageName) {
    currentPage = pageName;
    pages.forEach(p => p.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));
    document.getElementById(`page-${pageName}`).classList.add('active');
    document.querySelector(`[data-page="${pageName}"]`)?.classList.add('active');
    if (pageName === 'doctors') renderDoctors();
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(link.dataset.page);
    });
});

// ========== МОДАЛЬНЫЕ ОКНА ==========
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.close;
        if (id) closeModal(id);
    });
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.style.display = 'none';
    });
});

// ========== ДИСКЛЕЙМЕР ==========
if (!localStorage.getItem('disclaimerAccepted')) {
    openModal('disclaimerModal');
}
document.getElementById('acceptDisclaimer').addEventListener('click', () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    closeModal('disclaimerModal');
});

// ========== ЭКСТРЕННЫЙ ВЫЗОВ ==========
document.getElementById('emergencyBtn').addEventListener('click', () => openModal('emergencyModal'));
document.getElementById('closeEmergency').addEventListener('click', () => closeModal('emergencyModal'));

// ========== ИИ-ЧАТ ==========
function addMessage(text, isUser = false) {
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    div.innerHTML = `
        <div class="message-avatar">${isUser ? '👤' : '🤖'}</div>
        <div class="message-content">${formatMessage(text)}</div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessage(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/• (.*?)(?=\n|$)/g, '<li>$1</li>')
        .replace(/\n/g, '<br>');
}

function showTyping() { typingIndicator.style.display = 'block'; chatMessages.scrollTop = chatMessages.scrollHeight; }
function hideTyping() { typingIndicator.style.display = 'none'; }

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    sendBtn.disabled = true;
    userInput.disabled = true;
    addMessage(text, true);
    userInput.value = '';
    charCount.textContent = '0';
    userInput.style.height = 'auto';
    showTyping();
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
    const answer = findAnswer(text) || generateFallback(text);
    hideTyping();
    addMessage(answer);
    sendBtn.disabled = false;
    userInput.disabled = false;
    userInput.focus();
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 130) + 'px';
    charCount.textContent = userInput.value.length;
});

// FAQ
document.querySelector('.faq-scroll')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('faq-btn')) {
        userInput.value = e.target.textContent;
        sendMessage();
    }
});

// ========== ВРАЧИ: ОТОБРАЖЕНИЕ ==========
function getSpecialityLabel(spec) {
    const map = { therapist: 'Терапевт', neurologist: 'Невролог', cardiologist: 'Кардиолог', pediatrician: 'Педиатр', dermatologist: 'Дерматолог', psychiatrist: 'Психиатр' };
    return map[spec] || spec;
}

function getAverageRating(reviews) {
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.stars, 0) / reviews.length;
}

function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += i <= Math.round(rating) ? '★' : '☆';
    }
    return html;
}

function renderDoctors(filterSpec = '', searchQuery = '') {
    let filtered = doctors;
    if (filterSpec) filtered = filtered.filter(d => d.speciality === filterSpec);
    if (searchQuery) filtered = filtered.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

    doctorsGrid.innerHTML = filtered.length ? filtered.map(d => {
        const avg = getAverageRating(d.reviews);
        const reviewsHtml = d.reviews.length ? d.reviews.slice(-2).map(r => `
            <div class="review-item">
                <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
                <div class="review-text">${r.text}</div>
                <div class="review-author">— ${r.author}</div>
            </div>
        `).join('') : '<p style="font-size:12px;color:var(--text-muted);">Пока нет отзывов</p>';

        return `
            <div class="doctor-card">
                <div class="doctor-card-header">
                    <div class="doctor-photo">👨‍⚕️</div>
                    <div>
                        <div class="doctor-card-name">${d.name}</div>
                        <div class="doctor-card-spec">${getSpecialityLabel(d.speciality)} • Стаж ${d.experience} лет</div>
                    </div>
                </div>
                <p style="font-size:13px;color:var(--text-secondary);">${d.description}</p>
                <div class="doctor-card-stats">
                    <span class="stars-display">${renderStars(avg)} ${avg.toFixed(1)}</span>
                    <span>${d.reviews.length} отзывов</span>
                </div>
                <div class="doctor-card-price">${d.price} ₽ / консультация</div>
                <div class="doctor-card-actions">
                    <button class="btn-sm btn-primary" onclick="bookAppointment(${d.id})">📅 Записаться</button>
                    <button class="btn-sm btn-outline-sm" onclick="openReview(${d.id})">⭐ Отзыв</button>
                </div>
                <div class="doctor-reviews">${reviewsHtml}</div>
            </div>
        `;
    }).join('') : '<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">Врачи не найдены</p>';
}

document.getElementById('specialityFilter')?.addEventListener('change', (e) => {
    renderDoctors(e.target.value, document.getElementById('doctorSearch').value);
});
document.getElementById('doctorSearch')?.addEventListener('input', (e) => {
    renderDoctors(document.getElementById('specialityFilter').value, e.target.value);
});

// ========== ЗАПИСЬ К ВРАЧУ ==========
function bookAppointment(doctorId) {
    selectedDoctorId = doctorId;
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;
    document.getElementById('appointmentDoctorName').textContent = doctor.name;
    document.getElementById('appointmentPrice').textContent = `${doctor.price} ₽`;
    openModal('appointmentModal');
}

document.getElementById('confirmAppointment')?.addEventListener('click', () => {
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    if (!date || !time) { alert('Выберите дату и время'); return; }
    const doctor = doctors.find(d => d.id === selectedDoctorId);
    alert(`✅ Запись подтверждена!\n\nВрач: ${doctor.name}\nДата: ${date}\nВремя: ${time}\n\nВрач свяжется с вами.`);
    closeModal('appointmentModal');
});

// ========== ОТЗЫВЫ ==========
function openReview(doctorId) {
    selectedDoctorId = doctorId;
    selectedRating = 0;
    const doctor = doctors.find(d => d.id === doctorId);
    document.getElementById('reviewDoctorName').textContent = `Врач: ${doctor.name}`;
    document.getElementById('reviewText').value = '';
    document.getElementById('reviewAuthor').value = '';
    document.querySelectorAll('#starRating span').forEach(s => s.classList.remove('active'));
    openModal('reviewModal');
}

document.getElementById('starRating')?.addEventListener('click', (e) => {
    const star = parseInt(e.target.dataset.star);
    if (!star) return;
    selectedRating = star;
    document.querySelectorAll('#starRating span').forEach((s, i) => {
        s.classList.toggle('active', i < star);
        s.textContent = i < star ? '★' : '☆';
    });
});

document.getElementById('submitReview')?.addEventListener('click', () => {
    const text = document.getElementById('reviewText').value.trim();
    const author = document.getElementById('reviewAuthor').value.trim() || 'Аноним';
    if (!selectedRating) { alert('Поставьте оценку'); return; }
    if (!text) { alert('Напишите отзыв'); return; }

    const doctor = doctors.find(d => d.id === selectedDoctorId);
    if (doctor) {
        doctor.reviews.push({ stars: selectedRating, text, author });
        localStorage.setItem('doctors', JSON.stringify(doctors));
        renderDoctors(document.getElementById('specialityFilter')?.value || '', document.getElementById('doctorSearch')?.value || '');
    }
    closeModal('reviewModal');
    alert('✅ Спасибо за отзыв!');
});

// ========== РЕГИСТРАЦИЯ ВРАЧА ==========
document.getElementById('openDoctorRegister')?.addEventListener('click', () => openModal('doctorRegisterModal'));

document.getElementById('doctorRegisterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input, select, textarea');
    const values = Array.from(inputs).map(i => i.value);

    const newDoctor = {
        id: Date.now(),
        name: values[0],
        speciality: values[1],
        experience: parseInt(values[2]) || 0,
        license: values[3],
        price: parseInt(values[4]) || 0,
        description: values[5],
        photo: values[6],
        email: values[7],
        password: values[8],
        reviews: []
    };

    if (!newDoctor.name || !newDoctor.speciality || !newDoctor.email || !newDoctor.password) {
        alert('Заполните обязательные поля');
        return;
    }

    doctors.push(newDoctor);
    localStorage.setItem('doctors', JSON.stringify(doctors));
    closeModal('doctorRegisterModal');
    form.reset();
    alert('✅ Регистрация успешна! Теперь вы можете войти в личный кабинет.');
    showPage('doctors');
});

// ========== ВХОД ==========
document.getElementById('loginBtn')?.addEventListener('click', () => openModal('loginModal'));
document.getElementById('showRegister')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('loginModal');
    openModal('doctorRegisterModal');
});

document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    const doctor = doctors.find(d => d.email === email && d.password === password);
    if (doctor) {
        currentUser = doctor;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal('loginModal');
        alert(`✅ Добро пожаловать, ${doctor.name}!`);
        showDoctorCabinet();
    } else {
        alert('Неверный email или пароль');
    }
});

function showDoctorCabinet() {
    if (!currentUser) { alert('Сначала войдите'); return; }
    document.getElementById('cabinetContent').innerHTML = `
        <p><strong>Врач:</strong> ${currentUser.name}</p>
        <p><strong>Специальность:</strong> ${getSpecialityLabel(currentUser.speciality)}</p>
        <p><strong>Стоимость:</strong> ${currentUser.price} ₽</p>
        <p><strong>Отзывов:</strong> ${currentUser.reviews.length}</p>
        <p style="margin-top:12px;color:var(--text-secondary);">Записи пациентов будут отображаться здесь.</p>
    `;
    openModal('doctorCabinetModal');
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
showPage('home');
userInput.focus();