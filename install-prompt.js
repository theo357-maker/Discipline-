// install-prompt.js - Gestionnaire d'installation PWA multi-plateformes
class InstallPrompt {
    constructor() {
        this.deferredPrompt = null;
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone || 
                          document.referrer.includes('android-app://');
        this.installEvent = null;
        
        this.init();
    }

    init() {
        console.log('🔧 Initialisation du prompt d\'installation');
        
        // Événement pour Chrome/Edge/Opera
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 Événement beforeinstallprompt déclenché');
            e.preventDefault();
            this.deferredPrompt = e;
            this.installEvent = e;
            
            // Afficher le prompt après un délai
            setTimeout(() => {
                this.showInstallPrompt();
            }, 3000);
        });

        // Pour iOS - Vérifier si on peut afficher le prompt d'installation
        if (this.isIOS) {
            setTimeout(() => {
                this.showIOSInstallPrompt();
            }, 3000);
        }

        // Pour les autres navigateurs qui ne supportent pas beforeinstallprompt
        if (!this.deferredPrompt && !this.isIOS) {
            setTimeout(() => {
                this.showGenericInstallPrompt();
            }, 3000);
        }

        // Détecter si l'application est déjà installée
        if (this.isStandalone) {
            console.log('✅ Application déjà installée');
            return;
        }
    }

    showInstallPrompt() {
        if (this.isStandalone) return;
        
        console.log('📲 Affichage du prompt d\'installation');
        
        // Créer le modal d'installation
        const modal = document.createElement('div');
        modal.id = 'install-prompt-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
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
        `;

        // Déterminer le message selon l'appareil
        let installMessage = '';
        let installButtonText = '';
        
        if (this.isIOS) {
            installMessage = `
                <div style="margin-bottom: 20px;">
                    <i class="fas fa-mobile-alt" style="font-size: 48px; color: #3498db; margin-bottom: 15px;"></i>
                    <h2 style="color: #2c3e50; margin-bottom: 10px;">Installer l'application</h2>
                    <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
                        Pour une meilleure expérience, installez notre application :
                    </p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: left;">
                        <p style="margin: 5px 0;"><strong>Sur iPhone/iPad :</strong></p>
                        <ol style="margin: 10px 0; padding-left: 20px;">
                            <li>Appuyez sur le bouton <span style="color: #3498db;">Partager</span> <i class="fas fa-share-alt"></i></li>
                            <li>Faites défiler vers le bas</li>
                            <li>Sélectionnez <span style="color: #3498db;">"Sur l'écran d'accueil"</span></li>
                            <li>Appuyez sur <span style="color: #3498db;">"Ajouter"</span></li>
                        </ol>
                    </div>
                </div>
            `;
            installButtonText = 'Voir les instructions';
        } else if (navigator.userAgent.includes('Chrome')) {
            installMessage = `
                <div style="margin-bottom: 20px;">
                    <i class="fas fa-chrome" style="font-size: 48px; color: #4285F4; margin-bottom: 15px;"></i>
                    <h2 style="color: #2c3e50; margin-bottom: 10px;">Installer l'application</h2>
                    <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
                        Installez l'application pour un accès rapide et une meilleure expérience.
                        Vous pourrez y accéder depuis votre écran d'accueil.
                    </p>
                </div>
            `;
            installButtonText = 'Installer maintenant';
        } else if (navigator.userAgent.includes('Firefox')) {
            installMessage = `
                <div style="margin-bottom: 20px;">
                    <i class="fab fa-firefox" style="font-size: 48px; color: #FF7139; margin-bottom: 15px;"></i>
                    <h2 style="color: #2c3e50; margin-bottom: 10px;">Installer l'application</h2>
                    <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
                        Dans Firefox, cliquez sur le menu (trois lignes) et sélectionnez
                        "Installer" ou "Ajouter à l'écran d'accueil".
                    </p>
                </div>
            `;
            installButtonText = 'Commencer l\'installation';
        } else if (navigator.userAgent.includes('Safari') && !this.isIOS) {
            installMessage = `
                <div style="margin-bottom: 20px;">
                    <i class="fab fa-safari" style="font-size: 48px; color: #0066FF; margin-bottom: 15px;"></i>
                    <h2 style="color: #2c3e50; margin-bottom: 10px;">Installer l'application</h2>
                    <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
                        Dans Safari, cliquez sur "Partager" et sélectionnez
                        "Ajouter à l'écran d'accueil".
                    </p>
                </div>
            `;
            installButtonText = 'Voir comment installer';
        } else if (navigator.userAgent.includes('Edge')) {
            installMessage = `
                <div style="margin-bottom: 20px;">
                    <i class="fab fa-edge" style="font-size: 48px; color: #0078D7; margin-bottom: 15px;"></i>
                    <h2 style="color: #2c3e50; margin-bottom: 10px;">Installer l'application</h2>
                    <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
                        Dans Edge, cliquez sur le menu (trois points) et sélectionnez
                        "Applications" puis "Installer cette application".
                    </p>
                </div>
            `;
            installButtonText = 'Installer l\'application';
        } else {
            installMessage = `
                <div style="margin-bottom: 20px;">
                    <i class="fas fa-download" style="font-size: 48px; color: #3498db; margin-bottom: 15px;"></i>
                    <h2 style="color: #2c3e50; margin-bottom: 10px;">Installer l'application</h2>
                    <p style="color: #555; margin-bottom: 20px; line-height: 1.6;">
                        Pour une meilleure expérience, installez notre application.
                        Consultez les instructions d'installation pour votre navigateur.
                    </p>
                </div>
            `;
            installButtonText = 'Comment installer';
        }

        modalContent.innerHTML = `
            ${installMessage}
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="install-button" 
                        style="background: linear-gradient(135deg, #3498db, #2c3e50);
                               color: white;
                               border: none;
                               padding: 15px 30px;
                               border-radius: 50px;
                               font-size: 16px;
                               font-weight: 600;
                               cursor: pointer;
                               transition: transform 0.2s, box-shadow 0.2s;">
                    ${installButtonText}
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
                <i class="fas fa-shield-alt"></i> Installation sécurisée • Aucune donnée personnelle requise
            </p>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Ajouter les styles d'animation
        this.addAnimationStyles();

        // Gérer les clics
        document.getElementById('install-button').addEventListener('click', () => {
            this.handleInstall();
        });

        document.getElementById('later-button').addEventListener('click', () => {
            this.closeModal();
            // Afficher à nouveau dans 24 heures
            setTimeout(() => this.showInstallPrompt(), 24 * 60 * 60 * 1000);
        });

        // Empêcher la fermeture en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                // Ne pas fermer - le prompt est obligatoire
                this.showPulseAnimation();
            }
        });
    }

    showIOSInstallPrompt() {
        if (this.isStandalone) return;
        
        console.log('🍎 Affichage du prompt d\'installation iOS');
        this.showInstallPrompt();
    }

    showGenericInstallPrompt() {
        if (this.isStandalone) return;
        
        console.log('🌐 Affichage du prompt d\'installation générique');
        this.showInstallPrompt();
    }

    showPulseAnimation() {
        const modal = document.getElementById('install-prompt-modal');
        if (modal) {
            modal.style.animation = 'none';
            setTimeout(() => {
                modal.style.animation = 'pulse 0.5s ease';
            }, 10);
            
            setTimeout(() => {
                modal.style.animation = '';
            }, 500);
        }
    }

    async handleInstall() {
        console.log('🔄 Démarrage de l\'installation');
        
        if (this.deferredPrompt) {
            // Pour Chrome/Edge/Opera
            this.deferredPrompt.prompt();
            
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log(`Résultat de l'installation: ${outcome}`);
            
            this.deferredPrompt = null;
            
            if (outcome === 'accepted') {
                this.showSuccessMessage();
            }
        } else if (this.isIOS) {
            // Pour iOS - Afficher les instructions détaillées
            this.showIOSInstructions();
        } else {
            // Pour les autres navigateurs
            this.showGeneralInstructions();
        }
        
        this.closeModal();
    }

    showIOSInstructions() {
        const modal = document.createElement('div');
        modal.id = 'ios-instructions-modal';
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
        `;

        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 30px; width: 90%; max-width: 400px; text-align: center;">
                <h2 style="color: #2c3e50; margin-bottom: 20px;">
                    <i class="fab fa-apple"></i> Installation sur iOS
                </h2>
                
                <div style="margin-bottom: 25px;">
                    <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                        <div style="width: 40px; height: 40px; background: #007AFF; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                            1
                        </div>
                        <div style="text-align: left; flex: 1;">
                            <strong>Appuyez sur Partager</strong>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                                <i class="fas fa-share-alt"></i> Icône de partage en bas
                            </p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                        <div style="width: 40px; height: 40px; background: #34C759; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                            2
                        </div>
                        <div style="text-align: left; flex: 1;">
                            <strong>Faites défiler vers le bas</strong>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                                Jusqu'à voir "Sur l'écran d'accueil"
                            </p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 25px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                        <div style="width: 40px; height: 40px; background: #FF9500; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                            3
                        </div>
                        <div style="text-align: left; flex: 1;">
                            <strong>Sélectionnez "Ajouter"</strong>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                                L'application sera installée
                            </p>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button id="close-ios-instructions" 
                            style="flex: 1; background: #3498db; color: white; border: none; padding: 15px; border-radius: 10px; font-weight: 600; cursor: pointer;">
                        J'ai compris
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('close-ios-instructions').addEventListener('click', () => {
            modal.remove();
        });
    }

    showGeneralInstructions() {
        const modal = document.createElement('div');
        modal.id = 'general-instructions-modal';
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
        `;

        const browser = this.detectBrowser();
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 30px; width: 90%; max-width: 400px; text-align: center;">
                <h2 style="color: #2c3e50; margin-bottom: 20px;">
                    <i class="${browser.icon}"></i> Installation sur ${browser.name}
                </h2>
                
                <div style="margin-bottom: 25px; text-align: left;">
                    <p style="color: #555; margin-bottom: 15px; line-height: 1.6;">
                        ${browser.instructions}
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-top: 15px;">
                        <p style="margin: 0; color: #666; font-size: 14px;">
                            <i class="fas fa-lightbulb"></i> Astuce : L'application fonctionnera hors ligne
                        </p>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button id="close-general-instructions" 
                            style="flex: 1; background: #3498db; color: white; border: none; padding: 15px; border-radius: 10px; font-weight: 600; cursor: pointer;">
                        Fermer
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('close-general-instructions').addEventListener('click', () => {
            modal.remove();
        });
    }

    detectBrowser() {
        const userAgent = navigator.userAgent;
        
        if (userAgent.includes('Chrome')) {
            return {
                name: 'Chrome',
                icon: 'fab fa-chrome',
                instructions: 'Cliquez sur l\'icône "Installer l\'application" dans la barre d\'adresse ou dans le menu (trois points) > "Installer l\'application".'
            };
        } else if (userAgent.includes('Firefox')) {
            return {
                name: 'Firefox',
                icon: 'fab fa-firefox',
                instructions: 'Cliquez sur le menu (trois lignes) en haut à droite, puis sélectionnez "Installer" ou "Ajouter à l\'écran d\'accueil".'
            };
        } else if (userAgent.includes('Safari')) {
            return {
                name: 'Safari',
                icon: 'fab fa-safari',
                instructions: 'Cliquez sur "Partager" dans la barre d\'outils, puis sélectionnez "Ajouter à l\'écran d\'accueil".'
            };
        } else if (userAgent.includes('Edge')) {
            return {
                name: 'Microsoft Edge',
                icon: 'fab fa-edge',
                instructions: 'Cliquez sur le menu (trois points) en haut à droite, puis "Applications" > "Installer cette application".'
            };
        } else {
            return {
                name: 'votre navigateur',
                icon: 'fas fa-globe',
                instructions: 'Cherchez l\'option "Installer l\'application" ou "Ajouter à l\'écran d\'accueil" dans les paramètres de votre navigateur.'
            };
        }
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
        const style = document.createElement('style');
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
        `;
        document.head.appendChild(style);
    }
}

// Initialiser le prompt d'installation
let installPrompt;

// Attendre que la page soit chargée
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            installPrompt = new InstallPrompt();
        }, 1000);
    });
} else {
    setTimeout(() => {
        installPrompt = new InstallPrompt();
    }, 1000);
}

// Exposer l'objet globalement pour un accès manuel
window.installPrompt = installPrompt;
