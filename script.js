// Firebase Configuration - Updated for v9 compat
const firebaseConfig = {
    apiKey: "AIzaSyB7kBEABll2aYvC-FCpry8NqvdaD5fAAHk",
    authDomain: "lakliech-devs-website.firebaseapp.com",
    projectId: "lakliech-devs-website",
    storageBucket: "lakliech-devs-website.firebasestorage.app",
    messagingSenderId: "1068035653292",
    appId: "1:1068035653292:web:290f98da3852d1963fa909"
};

// Initialize Firebase (make sure this runs after the scripts are loaded)
let auth, db;

// Declare firebase and emailjs
var firebase;
var emailjs;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    
    // Then initialize the rest of the app
    initializeApp();
    setupEventListeners();
    setupNavigation();
    initializeAnimations();
});

// EmailJS Configuration
emailjs.init({
    publicKey: "BVzsVy73KeIP0ZhFp"
});

// App data
const apps = {
    'moyo-match': {
        name: 'Moyo Match',
        url: 'https://play.google.com/store/apps/details?id=com.lakliech.moyo_match',
        commission: 0.15
    },
    'penzivibe': {
        name: 'PenziVibe',
        url: 'https://play.google.com/store/apps/details?id=com.lakliech.penzii_vibe',
        commission: 0.15
    },
    'sabbathgpt': {
        name: 'SabbathGPT',
        url: 'https://play.google.com/store/apps/details?id=com.lakliech.sabbath_gpt',
        commission: 0.15
    },
    'mathflash': {
        name: 'MathFlash Guru',
        url: 'https://play.google.com/store/apps/details?id=com.lakliech.math_flash',
        commission: 0.15
    },
    'mathrpg': {
        name: 'Math RPG Adventure',
        url: 'https://play.google.com/store/apps/details?id=com.lakliech.math_rpg_adventure1',
        commission: 0.15
    },
    'waterintake': {
        name: 'WaterIntake Tracker',
        url: 'https://play.google.com/store/apps/details?id=com.lakliech.my_water_tracker',
        commission: 0.15
    }
};

// Global variables
let currentUser = null;
let currentAppForSharing = null;

// DOM Elements
const authBtn = document.getElementById('authBtn');
const affiliateSignup = document.getElementById('affiliateSignup');
const affiliatePanel = document.getElementById('affiliatePanel');
const contactForm = document.getElementById('contactForm');
const shareModal = document.getElementById('shareModal');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize the application
function initializeApp() {
    // Check authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            updateAuthUI(true);
            loadAffiliateData();
        } else {
            currentUser = null;
            updateAuthUI(false);
        }
    });

    // Track referral clicks
    trackReferralClick();
}

// Initialize animations and scroll effects
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.app-card, .affiliate-card, .contact-card').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero background elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.gradient-orb');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Authentication
    authBtn.addEventListener('click', handleAuth);
    affiliateSignup.addEventListener('click', handleAffiliateSignup);

    // Contact form
    contactForm.addEventListener('submit', handleContactForm);

    // Modal
    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', () => {
        shareModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            shareModal.style.display = 'none';
        }
    });

    // Smooth scrolling for navigation links
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

    // Enhanced scroll effects
    window.addEventListener('scroll', handleScroll);
}

// Enhanced scroll handler
function handleScroll() {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;
    
    // Navbar effects
    if (scrolled > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 8px 32px rgba(15, 23, 42, 0.12)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
        navbar.style.backdropFilter = 'blur(10px)';
    }
}

// Setup navigation
function setupNavigation() {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            // Reset hamburger animation
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// Handle authentication
async function handleAuth() {
    if (currentUser) {
        // Sign out
        try {
            await auth.signOut();
            showMessage('Signed out successfully', 'success');
        } catch (error) {
            showMessage('Error signing out: ' + error.message, 'error');
        }
    } else {
        // Sign in
        await signInWithGoogle();
    }
}

// Handle affiliate signup
async function handleAffiliateSignup() {
    if (!currentUser) {
        await signInWithGoogle();
    }
    
    if (currentUser) {
        await createAffiliateAccount();
    }
}

// Sign in with Google
async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        showMessage('Welcome to our premium partnership program!', 'success');
        return result.user;
    } catch (error) {
        showMessage('Error signing in: ' + error.message, 'error');
        return null;
    }
}

// Create affiliate account
async function createAffiliateAccount() {
    if (!currentUser) return;

    try {
        const affiliateData = {
            userId: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName,
            referralCode: generateReferralCode(),
            totalClicks: 0,
            totalConversions: 0,
            totalEarnings: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('affiliates').doc(currentUser.uid).set(affiliateData, { merge: true });
        
        showMessage('Elite partnership account created successfully!', 'success');
        loadAffiliateData();
    } catch (error) {
        showMessage('Error creating partnership account: ' + error.message, 'error');
    }
}

// Generate referral code
function generateReferralCode() {
    return 'PREMIUM' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Update authentication UI
function updateAuthUI(isSignedIn) {
    if (isSignedIn) {
        authBtn.innerHTML = '<i class="fas fa-user-check"></i><span>Account</span>';
        affiliateSignup.style.display = 'none';
        affiliatePanel.style.display = 'block';
    } else {
        authBtn.innerHTML = '<i class="fas fa-user-circle"></i><span>Sign In</span>';
        affiliateSignup.style.display = 'block';
        affiliatePanel.style.display = 'none';
    }
}

// Load affiliate data
async function loadAffiliateData() {
    if (!currentUser) return;

    try {
        const doc = await db.collection('affiliates').doc(currentUser.uid).get();
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('totalClicks').textContent = data.totalClicks || 0;
            document.getElementById('totalConversions').textContent = data.totalConversions || 0;
            document.getElementById('totalEarnings').textContent = '$' + (data.totalEarnings || 0).toFixed(2);
            
            generateReferralLinks(data.referralCode);
        }
    } catch (error) {
        console.error('Error loading affiliate data:', error);
    }
}
// Generate referral links that go directly to Play Store
function generateReferralLinks(referralCode) {
    const referralLinksContainer = document.getElementById('referralLinks');
    referralLinksContainer.innerHTML = '';

    Object.keys(apps).forEach(appKey => {
        const app = apps[appKey];
        // Create referral URL that includes tracking and redirects to Play Store
        const referralUrl = `${window.location.origin}?ref=${referralCode}&app=${appKey}&redirect=playstore`;
        
        const linkElement = document.createElement('div');
        linkElement.className = 'referral-link-item';
        linkElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 16px; background: rgba(255,255,255,0.1); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                <div style="flex: 1;">
                    <span style="font-weight: 600; display: block;">${app.name}</span>
                    <small style="opacity: 0.8;">Tracks clicks & redirects to Play Store</small>
                </div>
                <button onclick="copyToClipboard('${referralUrl}')" class="btn btn-primary" style="padding: 8px 16px; font-size: 14px;">
                    <i class="fas fa-copy"></i> <span>Copy Link</span>
                </button>
            </div>
        `;
        referralLinksContainer.appendChild(linkElement);
    });
}

// Handle contact form submission
async function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        to_email: 'lakliech.devs@proton.me'
    };

    try {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading"></div> <span>Sending...</span>';
        submitBtn.disabled = true;

        await emailjs.send('service_ss3b6a8', 'template_8yoia9l', templateParams);
        
        showMessage('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
        contactForm.reset();
    } catch (error) {
        showMessage('Error sending message. Please try again or contact us directly.', 'error');
    } finally {
        // Reset button state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-rocket"></i><span>Launch Project Discussion</span>';
        submitBtn.disabled = false;
    }
}

// Share app functionality
function shareApp(appKey) {
    if (!currentUser) {
        showMessage('Please sign in to access our premium partnership program', 'error');
        handleAuth();
        return;
    }

    currentAppForSharing = appKey;
    const app = apps[appKey];
    
    // Get user's referral code
    db.collection('affiliates').doc(currentUser.uid).get()
        .then(doc => {
            if (doc.exists) {
                const referralCode = doc.data().referralCode;
                // Create referral URL that redirects to Play Store
                const referralUrl = `${window.location.origin}?ref=${referralCode}&app=${appKey}&redirect=playstore`;
                
                document.getElementById('referralLink').value = referralUrl;
                shareModal.style.display = 'block';
            } else {
                showMessage('Please complete your partnership signup first', 'error');
                createAffiliateAccount();
            }
        })
        .catch(error => {
            console.error('Error getting affiliate data:', error);
            showMessage('Error loading partnership data. Please try again.', 'error');
        });
}
// Copy referral link
function copyReferralLink() {
    const referralLink = document.getElementById('referralLink');
    referralLink.select();
    copyToClipboard(referralLink.value);
    showMessage('Premium referral link copied to clipboard!', 'success');
}

// Copy to clipboard utility
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Link copied successfully');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        console.log('Fallback: Link copied to clipboard');
    } catch (err) {
        console.error('Fallback: Unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

// Updated social sharing functions
function shareToWhatsApp() {
    const referralLink = document.getElementById('referralLink').value;
    const app = apps[currentAppForSharing];
    const message = `🚀 Check out ${app.name} - a premium mobile app! Download it from Play Store: ${referralLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    trackShare('whatsapp');
}

function shareToTwitter() {
    const referralLink = document.getElementById('referralLink').value;
    const app = apps[currentAppForSharing];
    const message = `🚀 Discover ${app.name} - premium mobile experience! #MobileApp #PremiumApps`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`;
    window.open(twitterUrl, '_blank');
    trackShare('twitter');
}

function shareToFacebook() {
    const referralLink = document.getElementById('referralLink').value;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    window.open(facebookUrl, '_blank');
    trackShare('facebook');
}

function shareToTikTok() {
    const referralLink = document.getElementById('referralLink').value;
    const app = apps[currentAppForSharing];
    
    copyToClipboard(referralLink);
    showMessage(`🎬 Link copied! Share this link on TikTok - it will track clicks and redirect to ${app.name} on Play Store!`, 'success');
    trackShare('tiktok');
}

function shareToInstagram() {
    const referralLink = document.getElementById('referralLink').value;
    const app = apps[currentAppForSharing];
    
    copyToClipboard(referralLink);
    showMessage(`📸 Link copied! Share this link on Instagram - it will track clicks and redirect to ${app.name} on Play Store!`, 'success');
    trackShare('instagram');
}
// Helper function to get current user's referral code
async function getCurrentUserReferralCode() {
    if (!currentUser) return null;
    
    try {
        const doc = await db.collection('affiliates').doc(currentUser.uid).get();
        return doc.exists ? doc.data().referralCode : null;
    } catch (error) {
        console.error('Error getting referral code:', error);
        return null;
    }
}
// Track sharing activity
async function trackShare(platform) {
    if (!currentUser) return;

    try {
        await db.collection('shares').add({
            userId: currentUser.uid,
            appKey: currentAppForSharing,
            platform: platform,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error tracking share:', error);
    }
}

// Track referral clicks and redirect to Play Store
function trackReferralClick() {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    const appKey = urlParams.get('app');
    const shouldRedirect = urlParams.get('redirect');

    if (referralCode && appKey && apps[appKey]) {
        console.log('Referral detected:', { referralCode, appKey, shouldRedirect }); // Debug log

        // Track the click in Firebase
        db.collection('clicks').add({
            referralCode: referralCode,
            appKey: appKey,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            redirectType: shouldRedirect || 'website',
            redirected: shouldRedirect === 'playstore'
        }).then(() => {
            // Update affiliate click count
            return db.collection('affiliates').where('referralCode', '==', referralCode).get();
        }).then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const currentClicks = doc.data().totalClicks || 0;
                doc.ref.update({
                    totalClicks: currentClicks + 1
                });
            });
        }).catch(error => {
            console.error('Error tracking referral click:', error);
        });

        // If redirect=playstore, go directly to Play Store
        if (shouldRedirect === 'playstore') {
            // Show tracking message
            showMessage('🎉 Referral tracked! Redirecting to Play Store...', 'success');

            // Create Play Store URL with referral tracking
            const playStoreUrl = createPlayStoreReferralUrl(apps[appKey].url, referralCode);
            
            console.log('Redirecting to:', playStoreUrl); // Debug log

            // Redirect to Play Store after short delay
            setTimeout(() => {
                window.location.href = playStoreUrl;
            }, 2000);
        } else {
            // Original behavior - show welcome message for website visits
            showMessage('🎉 Welcome! You\'re about to experience a premium mobile app!', 'success');
            
            // Optional: Still redirect to Play Store after showing the website
            setTimeout(() => {
                window.open(apps[appKey].url, '_blank');
            }, 3000);
        }
    }
}
// Create Play Store URL with referral tracking
function createPlayStoreReferralUrl(basePlayStoreUrl, referralCode) {
    try {
        // Extract the app ID from the Play Store URL
        const appIdMatch = basePlayStoreUrl.match(/id=([^&]+)/);
        const appId = appIdMatch ? appIdMatch[1] : '';
        
        console.log('Creating referral URL for app:', appId, 'with code:', referralCode); // Debug log
        
        // Create referral URL with UTM parameters and referrer tracking
        const referralUrl = `${basePlayStoreUrl}&referrer=utm_source%3Dlakliech_affiliate%26utm_medium%3Dreferral%26utm_campaign%3D${referralCode}%26utm_content%3Dshare_earn`;
        
        return referralUrl;
    } catch (error) {
        console.error('Error creating referral URL:', error);
        // Fallback to original URL
        return basePlayStoreUrl;
    }
}
// Track conversions (when user actually downloads the app)
async function trackConversion(referralCode, appKey) {
    try {
        await db.collection('conversions').add({
            referralCode: referralCode,
            appKey: appKey,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Update affiliate conversion count and earnings
        const affiliatesQuery = await db.collection('affiliates').where('referralCode', '==', referralCode).get();
        
        affiliatesQuery.forEach(doc => {
            const data = doc.data();
            const currentConversions = data.totalConversions || 0;
            const currentEarnings = data.totalEarnings || 0;
            const commission = apps[appKey].commission;
            const appPrice = 2.99; // Assuming average app price for commission calculation
            const commissionAmount = appPrice * commission;

            doc.ref.update({
                totalConversions: currentConversions + 1,
                totalEarnings: currentEarnings + commissionAmount
            });
        });
    } catch (error) {
        console.error('Error tracking conversion:', error);
    }
}

// Enhanced message system
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    // Add icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    messageDiv.innerHTML = `${icon} <span>${message}</span>`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 120px;
        right: 24px;
        z-index: 9999;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        box-shadow: 0 8px 32px rgba(15, 23, 42, 0.12);
        backdrop-filter: blur(10px);
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;

    document.body.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 400);
    }, 5000);
}

// Add enhanced CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization - Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Error handling for Firebase operations
window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    showMessage('An unexpected error occurred. Please try again.', 'error');
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    // Close modal with Escape key
    if (e.key === 'Escape' && shareModal.style.display === 'block') {
        shareModal.style.display = 'none';
    }
    
    // Toggle mobile menu with Enter key on hamburger
    if (e.key === 'Enter' && e.target === hamburger) {
        navMenu.classList.toggle('active');
    }
});

// Enhanced focus management for accessibility
function manageFocus() {
    const focusableElements = document.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="email"], input[type="radio"], input[type="checkbox"], select'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid #667eea';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = 'none';
        });
    });
}

// Initialize focus management
document.addEventListener('DOMContentLoaded', manageFocus);

// Analytics and performance tracking
function initializeAnalytics() {
    // Track page views
    db.collection('analytics').add({
        type: 'page_view',
        page: window.location.pathname,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
    }).catch(error => {
        console.error('Error tracking page view:', error);
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
        }
    });

    // Track scroll depth on page unload
    window.addEventListener('beforeunload', () => {
        if (maxScroll > 0) {
            navigator.sendBeacon('/api/analytics', JSON.stringify({
                type: 'scroll_depth',
                depth: maxScroll,
                timestamp: Date.now()
            }));
        }
    });
}

// Initialize analytics when page loads
document.addEventListener('DOMContentLoaded', initializeAnalytics);

console.log('🚀 Lakliech Devs Premium Website initialized successfully!');
