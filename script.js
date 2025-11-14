// ===== SNOW EFFECT =====
(function() {
    const canvas = document.getElementById('snow-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const snowflakes = [];

    // Create snowflakes
    for (let i = 0; i < 150; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            wind: Math.random() * 0.5 - 0.25,
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();

        snowflakes.forEach((flake) => {
            ctx.moveTo(flake.x, flake.y);
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);

            flake.y += flake.speed;
            flake.x += flake.wind;

            if (flake.y > canvas.height) {
                flake.y = 0;
                flake.x = Math.random() * canvas.width;
            }

            if (flake.x > canvas.width) {
                flake.x = 0;
            } else if (flake.x < 0) {
                flake.x = canvas.width;
            }
        });

        ctx.fill();
        requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
})();

// ===== YOUTUBE PLAYER =====
(function() {
    let player;
    let isReady = false;
    let isMuted = false;
    let currentVolume = 30;

    // Load YouTube iframe API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // YouTube API ready callback
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('youtube-player', {
            videoId: 'WPeO-zvOj9g',
            playerVars: {
                autoplay: 1,
                loop: 1,
                playlist: 'WPeO-zvOj9g',
                controls: 0,
                showinfo: 0,
                modestbranding: 1,
                iv_load_policy: 3,
            },
            events: {
                onReady: onPlayerReady,
            },
        });
    };

    function onPlayerReady(event) {
        event.target.setVolume(currentVolume);
        isReady = true;
        updateVolumeDisplay();
    }

    // Volume controls
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    const muteBtn = document.getElementById('mute-btn');

    if (volumeSlider) {
        volumeSlider.addEventListener('input', function(e) {
            const volume = parseInt(e.target.value);
            currentVolume = volume;
            
            if (player && isReady) {
                player.setVolume(volume);
                if (volume > 0 && isMuted) {
                    isMuted = false;
                    player.unMute();
                }
            }
            
            updateVolumeDisplay();
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener('click', function() {
            if (player && isReady) {
                if (isMuted) {
                    player.unMute();
                    player.setVolume(currentVolume);
                    isMuted = false;
                } else {
                    player.mute();
                    isMuted = true;
                }
                updateVolumeDisplay();
            }
        });
    }

    function updateVolumeDisplay() {
        const displayVolume = isMuted ? 0 : currentVolume;
        
        if (volumeValue) {
            volumeValue.textContent = displayVolume + '%';
        }
        
        if (volumeSlider) {
            volumeSlider.value = displayVolume;
        }
        
        // Update mute button icon
        if (muteBtn) {
            const icon = muteBtn.querySelector('.volume-icon');
            if (icon) {
                if (isMuted || currentVolume === 0) {
                    icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
                } else {
                    icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
                }
            }
        }
    }
})();

// ===== MAIN FUNCTIONALITY =====
(function() {
    // Copy Server IP
    const copyBtn = document.getElementById('copy-ip-btn');
    const serverIP = document.getElementById('server-ip');

    if (copyBtn && serverIP) {
        copyBtn.addEventListener('click', function() {
            const ip = serverIP.textContent;
            
            // Copy to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(ip).then(function() {
                    // Show success message
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copied!';
                    copyBtn.style.background = 'linear-gradient(to right, #10b981, #059669)';
                    
                    setTimeout(function() {
                        copyBtn.textContent = originalText;
                        copyBtn.style.background = 'linear-gradient(to right, #059669, #047857)';
                    }, 2000);
                }).catch(function(err) {
                    console.error('Failed to copy:', err);
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = ip;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copied!';
                    copyBtn.style.background = 'linear-gradient(to right, #10b981, #059669)';
                    
                    setTimeout(function() {
                        copyBtn.textContent = originalText;
                        copyBtn.style.background = 'linear-gradient(to right, #059669, #047857)';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
                
                document.body.removeChild(textArea);
            }
        });
    }

    // Smooth scroll for any future links
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

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    const sections = document.querySelectorAll('.about-section, .staff-section, .server-info-section');
    sections.forEach(section => {
        observer.observe(section);
    });
})();
