// ===== PLANAC - JS GLOBAL =====

// Toggle mobile menu
function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

// Phone mask
document.addEventListener('DOMContentLoaded', function() {
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            else v = v.replace(/^(\d*)/, '($1');
            e.target.value = v;
        });
    }
});

// Form submission
function handleSubmit(e, productName) {
    e.preventDefault();
    const f = e.target;
    const msg = `*Solicitação de Orçamento - ${productName}*\n\n*Nome:* ${f.nome.value}\n*E-mail:* ${f.email.value}\n*Telefone:* ${f.telefone.value}\n*Cidade:* ${f.cidade.value}\n*Tipo:* ${f.tipo.value || 'Não especificado'}\n\n*Detalhes:*\n${f.mensagem.value}`;
    window.open(`https://api.whatsapp.com/send/?phone=5543984182582&text=${encodeURIComponent(msg)}`, '_blank');
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
