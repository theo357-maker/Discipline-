// install-prompt.js - Version corrigée avec détection précise
class InstallPrompt {
    constructor() {
        this.deferredPrompt = null;
        this.isStandalone = this.checkIfStandalone();
        this.platform = this.detectPlatform();
        this.browser = this.detectBrowser();
        
        console.log('📱 Plateforme détectée:', this.platform);
        console.log('🌐 Navigateur détecté:', this.browser);
        
        this.init();
    }

    detectPlatform() {
        const userAgent = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();
        
        // Détection iOS précise
        if (/ipad|iphone|ipod/.test(userAgent) && !window.MSStream) {
            return 'ios';
        }
        
        // Détection Android précise
        if (/android/.test(userAgent)) {
            return 'android';
        }
        
        // Détection Windows
        if (platform.includes('win') || userAgent.includes('win')) {
            return 'windows';
        }
        
        // Détection Mac
        if (platform.includes('mac') || userAgent.includes('mac')) {
            return 'mac';
        }
        
        // Détection Linux
        if (platform.includes('linux') && !userAgent.includes('android')) {
            return 'linux';
        }
        
        return 'unknown';
    }

    detectBrowser() {
        const userAgent = navigator.userAgent;
        
        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
            return { name: 'Chrome', icon: 'fab fa-chrome', color: '#4285F4' };
        } else if (userAgent.includes('Firefox')) {
            return { name: 'Firefox', icon: 'fab fa-firefox', color: '#FF7139' };
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            return { name: 'Safari', icon: 'fab fa-safari', color: '#0066FF' };
        } else if (userAgent.includes('Edg')) {
            return { name: 'Edge', icon: 'fab fa-edge', color: '#0078D7' };
        } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
            return { name: 'Opera', icon: 'fab fa-opera', color: '#FF1B2D' };
        } else {
            return { name: 'Navigateur', icon: 'fas fa-globe', color: '#3498db' };
        }
    }

    checkIfStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone ||
               document.referrer.includes('android-app://');
    }

    init() {
        if (this.isStandalone) {
            console.log('✅ Application déjà installée');
            return;
        }
        
        // Événement pour Chrome/Edge/Opera sur Windows/Android/Linux/Mac
        if (this.platform !== 'ios') {
            window.addEventListener('beforeinstallprompt', (e) => {
                console.log('📱 Événement beforeinstallprompt disponible');
                e.preventDefault();
                this.deferredPrompt = e;
                
                // Afficher le prompt après 3 secondes
                setTimeout(() => {
                    this.showInstallPrompt();
                }, 3000);
            });
        }
        
        // Pour iOS - Toujours afficher le prompt (pas d'API beforeinstallprompt)
        if (this.platform === 'ios') {
            setTimeout(() => {
                this.showInstallPrompt();
            }, 3000);
        }
        
        // Pour les autres navigateurs sans support beforeinstallprompt
        setTimeout(() => {
            if (!this.deferredPrompt && this.platform !== 'ios') {
                this.showInstallPrompt();
            }
        }, 5000);
    }

    showInstallPrompt() {
        if (this.isStandalone) return;
        
        console.log('📲 Affichage du prompt adapté à:', this.platform, this.browser.name);
        
        const modal = this.createModal();
        document.body.appendChild(modal);
        
        this.addAnimationStyles();
        this.setupModalEvents();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'install-prompt-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            animation: fadeIn 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 30px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            animation: slideUp 0.3s ease;
            position: relative;
        `;

        // Message personnalisé selon la plateforme
        const content = this.getPlatformSpecificContent();
        modalContent.innerHTML = content;

        modal.appendChild(modalContent);
        return modal;
    }

    getPlatformSpecificContent() {
        let message, buttonText, instructions;
        
        switch (this.platform) {
            case 'ios':
                message = `
                    <div style="margin-bottom: 20px;">
                        <i class="fab fa-apple" style="font-size: 48px; color: #000; margin-bottom: 15px;"></i>
                        <h2 style="color: #2c3e50; margin-bottom: 10px;">Installation sur iPhone/iPad</h2>
                        <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
                            Pour installer l'application sur votre appareil Apple :
                        </p>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: left;">
                            <ol style="margin: 0; padding-left: 20px;">
                                <li>Ouvrez cette page dans <strong>Safari</strong></li>
                                <li>Appuyez sur <span style="color: #007AFF;">Partager</span> <i class="fas fa-share-alt"></i></li>
                                <li>Faites défiler et sélectionnez <span style="color: #007AFF;">"Sur l'écran d'accueil"</span></li>
                                <li>Appuyez sur <span style="color: #007AFF;">"Ajouter"</span></li>
                            </ol>
                        </div>
                    </div>
                `;
                buttonText = 'Voir les instructions détaillées';
                instructions = 'ios';
                break;

            case 'android':
                if (this.browser.name === 'Chrome') {
                    message = `
                        <div style="margin-bottom: 20px;">
                            <i class="fab fa-android" style="font-size: 48px; color: #3DDC84; margin-bottom: 15px;"></i>
                            <h2 style="color: #2c3e50; margin-bottom: 10px;">Installation sur Android</h2>
                            <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
                                Installez l'application pour un accès rapide depuis votre écran d'accueil.
                            </p>
                        </div>
                    `;
                    buttonText = 'Installer maintenant';
                    instructions = 'chrome';
                } else {
                    message = `
                        <div style="margin-bottom: 20px;">
                            <i class="fab fa-android" style="font-size: 48px; color: #3DDC84; margin-bottom: 15px;"></i>
                            <h2 style="color: #2c3e50; margin-bottom: 10px;">Installation sur Android</h2>
                            <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
                                Ouvrez dans Chrome pour l'installation automatique,
                                ou cherchez "Ajouter à l'écran d'accueil" dans le menu de ${this.browser.name}.
                            </p>
                        </div>
                    `;
                    buttonText = 'Comment installer';
                    instructions = 'android';
                }
                break;

            case 'windows':
                message = `
                    <div style="margin-bottom: 20px;">
                        <i class="fab fa-windows" style="font-size: 48px; color: #0078D7; margin-bottom: 15px;"></i>
                        <h2 style="color: #2c3e50; margin-bottom: 10px;">Installation sur Windows</h2>
                        <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
                            Installez l'application comme un programme natif sur votre PC.
                            Cliquez sur "Installer" pour commencer.
                        </p>
                    </div>
                `;
                buttonText = 'Installer l\'application';
                instructions = 'windows';
                break;

            case 'mac':
                message = `
                    <div style="margin-bottom: 20px;">
                        <i class="fab fa-apple" style="font-size: 48px; color: #000; margin-bottom: 15px;"></i>
                        <h2 style="color: #2c3e50; margin-bottom: 10px;">Installation sur Mac</h2>
                        <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
                            Installez l'application sur votre Mac pour un accès rapide depuis le Dock.
                        </p>
                    </div>
                `;
                buttonText = 'Installer';
                instructions = 'mac';
                break;

            default:
                message = `
                    <div style="margin-bottom: 20px;">
                        <i class="${this.browser.icon}" style="font-size: 48px; color: ${this.browser.color}; margin-bottom: 15px;"></i>
                        <h2 style="color: #2c3e50; margin-bottom: 10px;">Installer l'application</h2>
                        <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
                            Pour une meilleure expérience, installez notre application.
                            Cherchez l'option d'installation dans ${this.browser.name}.
                        </p>
                    </div>
                `;
                buttonText = 'Comment installer';
                instructions = 'general';
        }

        return `
            ${message}
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="install-button" 
                        data-instructions="${instructions}"
                        style="background: linear-gradient(135deg, ${this.browser.color}, #2c3e50);
                               color: white;
                               border: none;
                               padding: 15px 30px;
                               border-radius: 50px;
                               font-size: 16px;
                               font-weight: 600;
                               cursor: pointer;
                               transition: transform 0.2s, box-shadow 0.2s;">
                    ${buttonText}
                </button>
                
                <button id="later-button" 
                        style="background: transparent;
                               color: #666;
                               border: 1px solid #ddd;
                               padding: 12px 30px;
                               border-radius: 50px;
                               font-size: 14px;
                               cursor: pointer;
                               transition: all 0.2s;">
                    Plus tard
                </button>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                <i class="fas fa-shield-alt"></i> Installation sécurisée • 
                <small>Plateforme: ${this.platform} • Navigateur: ${this.browser.name}</small>
            </p>
        `;
    }

    setupModalEvents() {
        const modal = document.getElementById('install-prompt-modal');
        
        document.getElementById('install-button').addEventListener('click', (e) => {
            const instructionsType = e.target.dataset.instructions;
            this.handleInstall(instructionsType);
        });

        document.getElementById('later-button').addEventListener('click', () => {
            this.closeModal();
            localStorage.setItem('install_prompt_closed', Date.now().toString());
            
            // Afficher à nouveau dans 24 heures
            setTimeout(() => {
                if (!this.isStandalone) {
                    this.showInstallPrompt();
                }
            }, 24 * 60 * 60 * 1000);
        });

        // Empêcher la fermeture facile
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.showPulseAnimation();
                this.showMandatoryMessage();
            }
        });
    }

    showPulseAnimation() {
        const modal = document.getElementById('install-prompt-modal');
        if (modal) {
            modal.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                modal.style.animation = '';
            }, 500);
        }
    }

    showMandatoryMessage() {
        // Afficher un message temporaire
        const message = document.createElement('div');
        message.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: #e74c3c;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            animation: fadeInOut 2s ease;
            white-space: nowrap;
        `;
        message.textContent = '⚠️ Installation recommandée pour continuer';
        
        const modalContent = document.querySelector('#install-prompt-modal > div');
        modalContent.appendChild(message);
        
        setTimeout(() => message.remove(), 2000);
    }

    async handleInstall(instructionsType) {
        console.log('🔄 Tentative d\'installation pour:', instructionsType);
        
        switch(instructionsType) {
            case 'ios':
                this.showIOSInstructions();
                break;
                
            case 'chrome':
            case 'windows':
            case 'mac':
                if (this.deferredPrompt) {
                    await this.handleNativeInstall();
                } else {
                    this.showBrowserInstructions();
                }
                break;
                
            case 'android':
                this.showAndroidInstructions();
                break;
                
            default:
                this.showGeneralInstructions();
        }
        
        this.closeModal();
    }

    async handleNativeInstall() {
        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log(`Résultat installation: ${outcome}`);
            
            if (outcome === 'accepted') {
                this.showSuccessMessage();
            }
            
            this.deferredPrompt = null;
        } catch (error) {
            console.error('Erreur installation native:', error);
            this.showBrowserInstructions();
        }
    }

    showIOSInstructions() {
        const modal = this.createDetailedModal(
            '🍎 Installation sur iOS',
            'fab fa-apple',
            '#000',
            [
                'Ouvrez cette page dans <strong>Safari</strong> (pas dans Chrome/Firefox)',
                'Appuyez sur l\'icône <span style="color: #007AFF;">Partager</span> <i class="fas fa-share-alt"></i> en bas',
                'Faites défiler vers le bas dans le menu de partage',
                'Sélectionnez <span style="color: #007AFF;">"Sur l\'écran d\'accueil"</span>',
                'Appuyez sur <span style="color: #007AFF;">"Ajouter"</span> en haut à droite',
                'L\'icône apparaîtra sur votre écran d\'accueil'
            ]
        );
        
        document.body.appendChild(modal);
    }

    showAndroidInstructions() {
        const modal = this.createDetailedModal(
            '🤖 Installation sur Android',
            'fab fa-android',
            '#3DDC84',
            [
                'Assurez-vous d\'utiliser <strong>Chrome</strong> comme navigateur',
                'Appuyez sur le menu (trois points) en haut à droite',
                'Sélectionnez <span style="color: #34C759;">"Installer l\'application"</span> ou "Ajouter à l\'écran d\'accueil"',
                'Confirmez l\'installation',
                'L\'icône apparaîtra sur votre écran d\'accueil'
            ]
        );
        
        document.body.appendChild(modal);
    }

    showBrowserInstructions() {
        const modal = this.createDetailedModal(
            `🌐 Installation sur ${this.browser.name}`,
            this.browser.icon,
            this.browser.color,
            [
                `Cherchez l'option d'installation dans ${this.browser.name}`,
                'Généralement dans le menu (trois points ou lignes)',
                'Sélectionnez "Installer l\'application" ou "Ajouter à l\'écran d\'accueil"',
                'Confirmez l\'installation si demandé',
                'L\'icône apparaîtra sur votre bureau ou écran d\'accueil'
            ]
        );
        
        document.body.appendChild(modal);
    }

    showGeneralInstructions() {
        const modal = this.createDetailedModal(
            '📱 Installation de l\'application',
            'fas fa-mobile-alt',
            '#3498db',
            [
                'Cette application peut être installée comme une application native',
                'Cherchez l\'option "Installer" dans votre navigateur',
                'Sur mobile: Menu → Ajouter à l\'écran d\'accueil',
                'Sur ordinateur: Menu → Installer l\'application',
                'Une fois installée, elle fonctionnera hors ligne'
            ]
        );
        
        document.body.appendChild(modal);
    }

    createDetailedModal(title, icon, color, steps) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            animation: fadeIn 0.3s ease;
        `;

        let stepsHTML = '';
        steps.forEach((step, index) => {
            stepsHTML += `
                <div style="display: flex; align-items: flex-start; margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                    <div style="width: 30px; height: 30px; background: ${color}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
                        ${index + 1}
                    </div>
                    <div style="text-align: left; flex: 1;">
                        <div style="color: #555; line-height: 1.5;">${step}</div>
                    </div>
                </div>
            `;
        });

        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 30px; width: 90%; max-width: 500px; animation: slideUp 0.3s ease; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; align-items: center; margin-bottom: 20px; gap: 15px;">
                    <i class="${icon}" style="font-size: 40px; color: ${color};"></i>
                    <h2 style="margin: 0; color: #2c3e50;">${title}</h2>
                </div>
                
                <div style="margin-bottom: 25px;">
                    ${stepsHTML}
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button id="close-instructions" 
                            style="flex: 1; background: ${color}; color: white; border: none; padding: 15px; border-radius: 10px; font-weight: 600; cursor: pointer;">
                        J\'ai compris
                    </button>
                </div>
            </div>
        `;

        modal.querySelector('#close-instructions').addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        });

        return modal;
    }

    showSuccessMessage() {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(39, 174, 96, 0.3);
            z-index: 999999;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        toast.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 20px;"></i>
            <div>
                <strong>Installation réussie !</strong>
                <p style="margin: 5px 0 0 0; font-size: 14px;">L'application a été installée avec succès.</p>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    closeModal() {
        const modal = document.getElementById('install-prompt-modal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    }

    addAnimationStyles() {
        if (document.getElementById('install-animations')) return;
        
        const style = document.createElement('style');
        style.id = 'install-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }
            
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialisation
let installPrompt;

// Vérifier si on doit afficher le prompt
function shouldShowPrompt() {
    if (installPrompt?.isStandalone) return false;
    
    const lastClosed = localStorage.getItem('install_prompt_closed');
    if (lastClosed) {
        const timeSinceClosed = Date.now() - parseInt(lastClosed);
        // Afficher seulement après 1 heure minimum
        return timeSinceClosed > (60 * 60 * 1000);
    }
    
    return true;
}

// Initialiser après le chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (shouldShowPrompt()) {
                installPrompt = new InstallPrompt();
            }
        }, 1000);
    });
} else {
    setTimeout(() => {
        if (shouldShowPrompt()) {
            installPrompt = new InstallPrompt();
        }
    }, 1000);
}

// Exposer pour un déclenchement manuel
window.showInstallPrompt = function() {
    if (!installPrompt) {
        installPrompt = new InstallPrompt();
    } else if (!installPrompt.isStandalone) {
        installPrompt.showInstallPrompt();
    }
};
