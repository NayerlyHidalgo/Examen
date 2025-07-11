// JavaScript para la página de inicio - Tattoo Shop
// Efectos y animaciones interactivas

class HomePage {
    constructor() {
        this.init();
    }

    init() {
        console.log('🏠 Inicializando página de inicio');
        this.setupPageLoader();
        this.setupScrollEffects();
        this.setupCounterAnimations();
        this.setupNavbarEffects();
        this.setupParallaxEffects();
        this.setupSmoothScroll();
        this.setupButtonEffects();
        this.setupHoverEffects();
    }

    // Page Loader
    setupPageLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loader.classList.add('fade-out');
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }, 1000);
            });
        }
    }

    // Efectos de scroll
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observar elementos que deben aparecer al hacer scroll
        document.querySelectorAll('.feature-card, .stat-card').forEach(el => {
            el.classList.add('scroll-fade-in');
            observer.observe(el);
        });
    }

    // Animaciones de contador
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Animar contador individual
    animateCounter(element) {
        const targetText = element.textContent;
        const target = parseInt(targetText) || 0;
        const duration = 2000; // 2 segundos
        const step = target / (duration / 16); // 60 FPS
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // Efectos de navbar
    setupNavbarEffects() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Ocultar/mostrar navbar en scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });
    }

    // Efectos de parallax
    setupParallaxEffects() {
        const heroSection = document.querySelector('.hero-section');
        const stars = document.querySelector('.stars');
        const twinkling = document.querySelector('.twinkling');
        
        if (heroSection && stars) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                if (stars) stars.style.transform = `translateY(${rate}px)`;
                if (twinkling) twinkling.style.transform = `translateY(${rate * 0.3}px)`;
            });
        }
    }

    // Scroll suave
    setupSmoothScroll() {
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

        // Scroll indicator
        const scrollIndicator = document.querySelector('.hero-scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Efectos de botones
    setupButtonEffects() {
        const buttons = document.querySelectorAll('.hero-btn, .btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Efecto de ondas
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.width = '0';
                ripple.style.height = '0';
                
                this.appendChild(ripple);
                
                // Animar ripple
                setTimeout(() => {
                    ripple.style.width = '300px';
                    ripple.style.height = '300px';
                    ripple.style.opacity = '0';
                }, 10);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });

            // Efecto de hover mejorado
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Efectos de hover mejorados
    setupHoverEffects() {
        const cards = document.querySelectorAll('.feature-card, .stat-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            });
        });
    }

    // Efectos de partículas flotantes
    createFloatingParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'floating-particles';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        document.querySelector('.hero-section').appendChild(particlesContainer);

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            particlesContainer.appendChild(particle);
        }

        // Añadir estilos de animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // Efectos de texto dinámico
    setupDynamicText() {
        const textElement = document.querySelector('.gradient-text');
        if (textElement) {
            const texts = [
                'Gestión de Inventario',
                'Facturación Inteligente',
                'Control Total',
                'Gestión Profesional'
            ];
            
            let currentIndex = 0;
            
            setInterval(() => {
                textElement.style.opacity = '0';
                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % texts.length;
                    textElement.textContent = texts[currentIndex];
                    textElement.style.opacity = '1';
                }, 300);
            }, 3000);
        }
    }

    // Efectos de mouse seguidor
    setupMouseFollower() {
        const follower = document.createElement('div');
        follower.className = 'mouse-follower';
        follower.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(240, 147, 251, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(follower);

        document.addEventListener('mousemove', (e) => {
            follower.style.left = e.clientX - 10 + 'px';
            follower.style.top = e.clientY - 10 + 'px';
        });

        // Cambiar tamaño en hover de elementos interactivos
        document.querySelectorAll('a, button, .hero-btn').forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.style.transform = 'scale(2)';
                follower.style.backgroundColor = 'rgba(102, 126, 234, 0.7)';
            });
            
            el.addEventListener('mouseleave', () => {
                follower.style.transform = 'scale(1)';
                follower.style.backgroundColor = 'rgba(240, 147, 251, 0.5)';
            });
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const homepage = new HomePage();
    
    // Crear efectos adicionales después de un delay
    setTimeout(() => {
        homepage.createFloatingParticles();
        homepage.setupDynamicText();
        homepage.setupMouseFollower();
    }, 2000);
});

// Funciones de utilidad globales
window.TattooShop = {
    // Formatear moneda
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Formatear fecha
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Navegar a página
    navigateTo: (url) => {
        window.location.href = url;
    },

    // Mostrar notificación
    showNotification: (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
};

console.log('✅ Página de inicio cargada correctamente');

    // Efectos de partículas
    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.querySelector('.hero-section').appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Efectos de hover mejorados
    setupHoverEffects() {
        const cards = document.querySelectorAll('.feature-card, .stat-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            });
        });
    }

    // Efectos de clic en botones
    setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Efecto de ondas
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Lazy loading para imágenes
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Efectos de tema oscuro/claro
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                
                // Guardar preferencia
                localStorage.setItem('theme', 
                    document.body.classList.contains('dark-theme') ? 'dark' : 'light'
                );
            });
        }

        // Aplicar tema guardado
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }

    // Efectos de escritura en tiempo real
    setupRealTimeTyping() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            const text = element.dataset.typing;
            const speed = parseInt(element.dataset.speed) || 50;
            
            element.textContent = '';
            let i = 0;
            
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, speed);
        });
    }

    // Efectos de estadísticas en tiempo real
    setupRealTimeStats() {
        const statsElements = document.querySelectorAll('.stat-number');
        
        // Simular actualización de estadísticas cada 30 segundos
        setInterval(() => {
            statsElements.forEach(stat => {
                const current = parseInt(stat.textContent.replace(/,/g, ''));
                const variation = Math.floor(Math.random() * 10) - 5; // ±5
                const newValue = Math.max(0, current + variation);
                
                this.animateCounterUpdate(stat, newValue);
            });
        }, 30000);
    }

    // Animar actualización de contador
    animateCounterUpdate(element, newValue) {
        const currentValue = parseInt(element.textContent.replace(/,/g, ''));
        const difference = newValue - currentValue;
        const steps = 20;
        const stepValue = difference / steps;
        
        let currentStep = 0;
        
        const updateInterval = setInterval(() => {
            currentStep++;
            const value = Math.floor(currentValue + (stepValue * currentStep));
            element.textContent = value.toLocaleString();
            
            if (currentStep >= steps) {
                clearInterval(updateInterval);
                element.textContent = newValue.toLocaleString();
            }
        }, 50);
    }

    // Efectos de notificaciones
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Efectos de carga de la página
    setupPageLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-icon">
                    <i class="fas fa-dragon"></i>
                </div>
                <div class="loader-text">Cargando Tattoo Shop...</div>
                <div class="loader-progress">
                    <div class="loader-bar"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(loader);
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 1000);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});

// Funciones de utilidad globales
window.TattooShop = {
    // Formatear moneda
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Formatear fecha
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Navegar a página
    navigateTo: (url) => {
        window.location.href = url;
    },

    // Mostrar modal
    showModal: (title, content) => {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
};

console.log('✅ Página de inicio cargada correctamente');
