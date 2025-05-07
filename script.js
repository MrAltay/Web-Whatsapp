// Partikül efekti ayarları
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#25D366'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#25D366',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// Form işlemleri
document.getElementById('whatsappForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    const statusDiv = document.getElementById('status');
    
    // Telefon numarası formatını kontrol et
    if (!phone.match(/^[0-9]{10,15}$/)) {
        statusDiv.className = 'error';
        statusDiv.textContent = 'Lütfen geçerli bir telefon numarası girin (örn: 905xxxxxxxxx)';
        return;
    }
    
    try {
        statusDiv.className = '';
        statusDiv.textContent = 'Mesaj gönderiliyor...';
        
        const response = await fetch('send_message.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: phone,
                message: message
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            statusDiv.className = 'success';
            statusDiv.textContent = 'Mesaj başarıyla gönderildi!';
            document.getElementById('whatsappForm').reset();
        } else {
            statusDiv.className = 'error';
            let errorMessage = data.error || 'Bir hata oluştu!';
            
            // Debug bilgilerini konsola yazdır
            if (data.debug_info) {
                console.error('Debug Bilgileri:', data.debug_info);
                errorMessage += ' (Detaylar için konsolu kontrol edin)';
            }
            
            statusDiv.textContent = errorMessage;
        }
    } catch (error) {
        console.error('Hata:', error);
        statusDiv.className = 'error';
        statusDiv.textContent = 'Bir hata oluştu! Lütfen tekrar deneyin.';
    }
}); 