// 스킬 바 애니메이션
const observerOptions = {
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-bar');
            skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const value = bar.dataset.value;
                    const fill = bar.querySelector('.skill-fill');
                    fill.style.width = value + '%';
                }, index * 100);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    observer.observe(skillsSection);
}

// 강점 숫자 카운터 애니메이션
const strengthObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const strengthScores = entry.target.querySelectorAll('.strength-score');
            strengthScores.forEach((score, index) => {
                const targetValue = parseInt(score.textContent);
                let currentValue = 0;
                
                setTimeout(() => {
                    const interval = setInterval(() => {
                        if (currentValue < targetValue) {
                            currentValue += Math.ceil((targetValue - currentValue) / 10);
                            if (currentValue > targetValue) currentValue = targetValue;
                            score.textContent = currentValue + '%';
                        } else {
                            clearInterval(interval);
                        }
                    }, 50);
                }, index * 150);
            });
            strengthObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const strengthsSection = document.querySelector('.strengths');
if (strengthsSection) {
    strengthObserver.observe(strengthsSection);
}

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 네비게이션 활성화 상태 업데이트
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
});
