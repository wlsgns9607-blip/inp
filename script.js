/* ========================================
   CUSTOM CURSOR (손가락 모양)
   ======================================== */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

// 트레일 점 (지연 추적)
function animateDot() {
    dotX += (mouseX - dotX) * 0.15;
    dotY += (mouseY - dotY) * 0.15;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    requestAnimationFrame(animateDot);
}
animateDot();

// 호버 가능한 요소에 커서 효과
document.querySelectorAll('[data-hover], a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorDot.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorDot.classList.remove('hover');
    });
});

// 클릭 효과
document.addEventListener('mousedown', () => cursor.classList.add('click'));
document.addEventListener('mouseup', () => cursor.classList.remove('click'));

// 어두운 섹션에서 커서 색상 반전
const darkSections = document.querySelectorAll('.skills-section, .philosophy-section, footer');

const darkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            cursor.classList.add('on-dark');
        }
    });
}, { threshold: [0, 0.3, 0.6, 1] });

// 마우스가 어두운 영역 위에 있는지 체크 (더 정확함)
function checkCursorBg() {
    const el = document.elementFromPoint(mouseX, mouseY);
    if (!el) return;
    const darkParent = el.closest('.skills-section, .philosophy-section, footer, .keyword-card:hover, .cta-email:hover, .mbti-letter, .exp-card, .portrait-wrap');

    // 실제로 어두운 배경인 영역만
    const isOnDark = !!el.closest('.skills-section, .philosophy-section, footer');
    cursor.classList.toggle('on-dark', isOnDark);
}

document.addEventListener('mousemove', checkCursorBg);

/* ========================================
   SKILL BAR ANIMATION
   ======================================== */
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.skill-bar');
            bars.forEach((bar, i) => {
                const val = bar.dataset.value;
                const fill = bar.querySelector('.skill-fill');
                const numEl = bar.querySelector('.num');

                // 막대 채움
                setTimeout(() => {
                    fill.style.width = val + '%';
                    bar.classList.add('animated');
                    // 숫자 카운터
                    animateNumber(numEl, parseInt(val), 1400);
                }, i * 120);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-grid .skill-group').forEach(g => skillObserver.observe(g));

/* ========================================
   RADAR CHART ANIMATION
   ======================================== */
const radarWrap = document.getElementById('radarWrap');

if (radarWrap) {
    const radarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                radarWrap.classList.add('in-view');
                radarObserver.unobserve(radarWrap);
            }
        });
    }, { threshold: 0.4 });

    radarObserver.observe(radarWrap);
}

/* ========================================
   STRENGTH SCORE COUNTER
   ======================================== */
const strengthObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.strength-item');
            items.forEach((item, i) => {
                const numEl = item.querySelector('.num');
                const target = parseInt(numEl.dataset.target);
                setTimeout(() => {
                    animateNumber(numEl, target, 1200);
                }, i * 150 + 600);
            });
            strengthObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const strengthList = document.querySelector('.strength-list');
if (strengthList) strengthObserver.observe(strengthList);

/* ========================================
   NUMBER COUNTER UTIL
   ======================================== */
function animateNumber(el, target, duration) {
    const start = 0;
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * eased);
        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }
    requestAnimationFrame(update);
}

/* ========================================
   FADE UP ON SCROLL
   ======================================== */
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section-header, .keyword-card, .exp-card').forEach(el => {
    el.classList.add('fade-up');
    fadeObserver.observe(el);
});

/* ========================================
   INTERACTIVE DETAIL MODAL FOR EXPERIENCE & KEYWORDS
   ======================================== */
const expModal = document.getElementById('expModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalBgNum = document.getElementById('modalBgNum');
const modalIcon = document.getElementById('modalIcon');
const modalBridge = document.getElementById('modalBridge');
const modalDesc = document.getElementById('modalDesc');
const modalBullets = document.getElementById('modalBullets');

const modalData = {
    "디테일링 세차": {
        num: "01",
        meta: "CAREER · 2 YEARS",
        bridge: "“불필요한 공정을 걷어낸다 → 불필요한 UI를 걷어낸다”",
        desc: "가성비와 효율을 중심으로 불필요한 공정을 과감히 걷어내고, 차량 상태에 따라 가장 시급한 오염을 먼저 해결하는 '선택과 집중'의 맞춤형 서비스 프로세스를 직접 정립했습니다.",
        bullets: [
            "<strong>공정 최적화 (Process Tuning)</strong>: 세차 과정에서 불필요한 딜레이를 계산해 세차 작업 시간을 30% 감축.",
            "<strong>페르소나 맞춤 케어</strong>: 오염도가 다르고 차주 성향이 다른 차량들을 면밀하게 해부하여 시급한 케어 포인트 선정.",
            "<strong>본질주의 기획 연계</strong>: 세차의 본질이 '깨끗함'이듯, UI의 본질은 '편리함'이라는 관점을 도출하여 화면 설계에 적용."
        ],
        icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 40 L12 28 Q14 24 18 24 L46 24 Q50 24 52 28 L56 40"/>
            <path d="M8 40 L8 48 L16 48 L16 44"/>
            <path d="M56 40 L56 48 L48 48 L48 44"/>
            <path d="M16 44 L48 44"/>
            <circle cx="20" cy="44" r="4" fill="currentColor"/>
            <circle cx="44" cy="44" r="4" fill="currentColor"/>
            <path d="M18 24 L22 16 L42 16 L46 24"/>
        </svg>`
    },
    "미식가": {
        num: "02",
        meta: "PASSION · ONGOING",
        bridge: "“재료의 본질과 밸런스 → 디자인의 본질과 균형”",
        desc: "단순히 짠맛·단맛이 아닌 재료의 본질과 셰프의 의도, 화려함보다 맛의 밸런스를 중심으로 음식을 봅니다. 이 관점이 곧 디자인 철학으로 이어집니다.",
        bullets: [
            "<strong>균형 감각 (Perfect Balance)</strong>: 텍스처, 산미, 단맛의 조화로움을 예리하게 포착해 내는 풍미 분석력.",
            "<strong>사용자 감동 설계</strong>: 레스토랑의 접객(Service UX)부터 플레이팅(UI), 맛(Core BX)까지 이어지는 통합 여정 분석.",
            "<strong>미니멀리즘 디자인 철학</strong>: 기교 부리지 않고 주재료의 본질적인 풍미만으로 감동을 주는 요리 기법을 화면 설계의 근간으로 사용."
        ],
        icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 8 L20 28 Q20 32 24 32 L24 56"/>
            <path d="M26 8 L26 24"/>
            <path d="M32 8 L32 24"/>
            <path d="M26 24 Q26 28 24 28"/>
            <path d="M32 24 Q32 28 24 28"/>
            <path d="M44 8 Q42 8 42 12 L42 32 Q42 36 46 36 L46 56"/>
        </svg>`
    }
};

if (expModal) {
    document.querySelectorAll('.exp-card').forEach(card => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal-id');
            const data = modalData[modalId];
            if (!data) return;
            
            modalTitle.textContent = modalId;
            modalMeta.textContent = data.meta;
            modalBgNum.textContent = data.num;
            modalIcon.innerHTML = data.icon;
            modalBridge.textContent = data.bridge;
            modalDesc.textContent = data.desc;
            
            modalBullets.innerHTML = '';
            data.bullets.forEach(bullet => {
                const li = document.createElement('li');
                li.innerHTML = bullet;
                modalBullets.appendChild(li);
            });
            
            expModal.classList.add('active');
            
            // 커서에 hover 클래스를 추가하여 호버 손가락 반응 유지
            const cursor = document.getElementById('cursor');
            if (cursor) cursor.classList.add('hover');
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            expModal.classList.remove('active');
        });
    }

    // 바깥 영역 클릭시 닫기
    expModal.addEventListener('click', (e) => {
        if (e.target === expModal) {
            expModal.classList.remove('active');
        }
    });

    // ESC 키 입력 시 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && expModal.classList.contains('active')) {
            expModal.classList.remove('active');
        }
    });
}

/* ========================================
   IMAGE LAZY LOADING FADE-IN EFFECT
   ======================================== */
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
        img.classList.add('loaded');
    } else {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    }
});



