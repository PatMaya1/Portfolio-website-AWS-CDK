// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Navegación Mobile
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle del menú móvil
    burger.addEventListener('click', function() {
        nav.classList.toggle('active');
        burger.classList.toggle('active');
    });
    
    // Cerrar el menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            burger.classList.remove('active');
        });
    });
    
    // Scroll to Top Button
    const scrollBtn = document.querySelector('.scroll-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Animación de scroll suave para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animación para las barras de habilidades
    const skillBars = document.querySelectorAll('.skill-level');
    
    function animateSkills() {
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            let width = '0%';
            
            switch(level) {
                case 'basic':
                    width = '35%';
                    break;
                case 'intermediate':
                    width = '65%';
                    break;
                case 'professional':
                    width = '85%';
                    break;
                case 'native':
                    width = '100%';
                    break;
            }
            
            bar.style.width = width;
        });
    }
    
    // Animación al hacer scroll
    let skillsAnimated = false;
    
    window.addEventListener('scroll', function() {
        const skillsSection = document.getElementById('habilidades');
        if (skillsSection) {
            const sectionTop = skillsSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75 && !skillsAnimated) {
                animateSkills();
                skillsAnimated = true;
            }
        }
    });
    
    // Manejar el envío del formulario de contacto
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // En un caso real, aquí se enviaría la información del formulario a un backend
            // Como esto es una demostración, simplemente mostraremos un mensaje de éxito
            
            // Validar los campos
            if (!name || !email || !subject || !message) {
                formMessage.innerHTML = "Por favor, completa todos los campos.";
                formMessage.className = "form-message error";
                formMessage.style.display = "block";
                return;
            }
            
            // Validar el formato del email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formMessage.innerHTML = "Por favor, introduce un email válido.";
                formMessage.className = "form-message error";
                formMessage.style.display = "block";
                return;
            }
            
            // Simulación de envío con un pequeño delay
            formMessage.innerHTML = "Enviando mensaje...";
            formMessage.className = "form-message";
            formMessage.style.display = "block";
            
            setTimeout(function() {
                formMessage.innerHTML = "¡Mensaje enviado con éxito! Gracias por contactarme.";
                formMessage.className = "form-message success";
                contactForm.reset();
            }, 1500);
        });
    }
    
    // Efecto de escritura para el héroe
    const subtitle = document.querySelector('.subtitle');
    const originalText = subtitle.textContent;
    
    function typeWriter(element, text, i = 0) {
        if (i === 0) {
            element.textContent = '';
        }
        
        if (i < text.length) {
            element.textContent += text.charAt(i);
            setTimeout(function() {
                typeWriter(element, text, i + 1);
            }, 100);
        }
    }
    
    // Iniciar la animación después de un pequeño retraso
    setTimeout(function() {
        typeWriter(subtitle, originalText);
    }, 500);
    
    // Animación de aparición para las tarjetas de proyectos
    const projectCards = document.querySelectorAll('.project-card');
    
    function checkVisibility() {
        projectCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight * 0.85) {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }
        });
    }
    
    // Configurar los estilos iniciales
    projectCards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
    
    // Verificar la visibilidad al cargar y al hacer scroll
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Verificar al cargar la página
    
    // Año actual en el footer
    const yearSpan = document.querySelector('.footer-bottom p');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.innerHTML = `&copy; ${currentYear} Patricio Maya. Todos los derechos reservados.`;
    }
});