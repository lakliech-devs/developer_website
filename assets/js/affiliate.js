document.addEventListener('DOMContentLoaded', () => {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAKTXHiGjo0er0Q3aiAQEcTAAgkSsReeRM",
        authDomain: "vite-9aa92.firebaseapp.com",
        projectId: "vite-9aa92",
        storageBucket: "vite-9aa92.firebasestorage.app",
        messagingSenderId: "739936214897",
        appId: "1:739936214897:web:cf884cdbaa02f537e8e0d0",
        measurementId: "G-F8668YLN4Z"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Ensure CountUp library is available
    const ensureCountUp = () => {
        return new Promise((resolve) => {
            if (typeof CountUp !== 'undefined') {
                console.log("CountUp loaded successfully from local assets");
                resolve(true);
                return;
            }

            console.warn("CountUp not found in local assets, using fallback animation");
            defineFallbackCountUp();
            resolve(false);

            // Fallback implementation with smooth animation
            function defineFallbackCountUp() {
                window.CountUp = function(target, endVal, options = {}) {
                    const element = document.getElementById(target);
                    if (!element) {
                        console.error(`Element with ID ${target} not found`);
                        return;
                    }
                    const prefix = options.prefix || '';
                    const decimalPlaces = options.decimalPlaces || 0;
                    const duration = options.duration || 2; // seconds
                    const startVal = 0;
                    const frameDuration = 1000 / 60; // 60 FPS
                    const totalFrames = Math.round((duration * 1000) / frameDuration);
                    let currentFrame = 0;

                    this.start = () => {
                        const update = () => {
                            currentFrame++;
                            const progress = currentFrame / totalFrames;
                            const currentVal = startVal + (endVal - startVal) * Math.min(progress, 1);
                            element.textContent = prefix + currentVal.toFixed(decimalPlaces);
                            if (currentFrame < totalFrames) {
                                requestAnimationFrame(update);
                            }
                        };
                        requestAnimationFrame(update);
                    };

                    this.update = (newVal) => {
                        currentFrame = 0;
                        endVal = newVal;
                        this.start();
                    };
                };
            }
        });
    };

    // App configurations
    const apps = {
        math_flash: {
            name: "Math Flash",
            description: "Boost your math skills with fun challenges!",
            package: "com.lakliech.math_flash",
            url: "https://play.google.com/store/apps/details?id=com.lakliech.math_flash",
            marketUrl: "market://details?id=com.lakliech.math_flash"
        },
        moyo_match: {
            name: "Moyo Match",
            description: "Connect hearts with this exciting matching game!",
            package: "com.lakliech.moyo_match",
            url: "https://play.google.com/store/apps/details?id=com.lakliech.moyo_match",
            marketUrl: "market://details?id=com.lakliech.moyo_match"
        },
        sabbath_gpt: {
            name: "Sabbath GPT",
            description: "Explore faith with AI-powered insights.",
            package: "com.lakliech.sabbath_gpt",
            url: "https://play.google.com/store/apps/details?id=com.lakliech.sabbath_gpt",
            marketUrl: "market://details?id=com.lakliech.sabbath_gpt"
        },
        penzii_vibe: {
            name: "Penzii Vibe",
            description: "Vibe with music and creativity!",
            package: "com.lakliech.penzii_vibe",
            url: "https://play.google.com/store/apps/details?id=com.lakliech.penzii_vibe",
            marketUrl: "market://details?id=com.lakliech.penzii_vibe"
        },
        my_water_tracker: {
            name: "My Water Tracker",
            description: "Stay hydrated with daily reminders.",
            package: "com.lakliech.my_water_tracker",
            url: "https://play.google.com/store/apps/details?id=com.lakliech.my_water_tracker",
            marketUrl: "market://details?id=com.lakliech.my_water_tracker"
        }
    };

    // Affiliate Form Submission
    const affiliateForm = document.getElementById('affiliateForm');
    if (affiliateForm) {
        affiliateForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const social = document.getElementById('social').value;
            const paypal = document.getElementById('paypal').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate passwords
            if (password !== confirmPassword) {
                alert("Passwords don't match");
                return;
            }

            try {
                // Create user
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const userId = userCredential.user.uid;

                // Generate promo code
                const promoCode = `LK${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

                // Wait for auth state to fully update
                await new Promise((resolve) => {
                    const unsubscribe = auth.onAuthStateChanged((user) => {
                        if (user) {
                            unsubscribe();
                            resolve(user);
                        }
                    });
                    setTimeout(() => resolve(null), 2000);
                });

                // Write to Firestore
                await db.collection('affiliates').doc(userId).set({
                    name,
                    email,
                    social,
                    paypal,
                    promoCode,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                // Initialize app stats
                const batch = db.batch();
                for (const appId of Object.keys(apps)) {
                    const appRef = db.collection('affiliates').doc(userId).collection('apps').doc(appId);
                    batch.set(appRef, {
                        appId,
                        clicks: 0,
                        downloads: 0,
                        commission: 0
                    });
                }
                await batch.commit();

                // Initialize weekly history
                const currentWeek = getWeekNumber();
                await db.collection('affiliates').doc(userId).collection('history').doc(`week${currentWeek}`).set({
                    week: currentWeek,
                    downloads: 0
                });

                // Send verification email
                await userCredential.user.sendEmailVerification();

                alert(`Success! Your promo code is ${promoCode}. Check your email to verify and see app links in your dashboard.`);
                affiliateForm.reset();
                updateAuthUI(true);
                document.querySelector('.dashboard').scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                const messages = {
                    'auth/email-already-in-use': 'This email is already registered.',
                    'auth/weak-password': 'Password must be at least 6 characters.',
                    'auth/invalid-email': 'Invalid email format.'
                };
                alert(messages[error.code] || `Error: ${error.message}`);
                console.error('Registration error:', error);
            }
        });
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = loginForm.username.value;
            const password = loginForm.loginPassword.value;

            try {
                await auth.signInWithEmailAndPassword(email, password);
                loginForm.reset();
            } catch (error) {
                const messages = {
                    'auth/user-not-found': 'No account found with this email.',
                    'auth/wrong-password': 'Incorrect password.'
                };
                alert(messages[error.code] || `Login failed: ${error.message}`);
                console.error('Login error:', error);
            }
        });
    }

    // Forgot Password
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = prompt('Enter your email to reset password:');
            if (email) {
                auth.sendPasswordResetEmail(email)
                    .then(() => {
                        alert('Password reset email sent! Check your inbox.');
                    })
                    .catch((error) => {
                        const messages = {
                            'auth/invalid-email': 'Invalid email format.',
                            'auth/user-not-found': 'No account found with this email.'
                        };
                        alert(messages[error.code] || `Error: ${error.message}`);
                        console.error('Password reset error:', error);
                    });
            }
        });
    }

    // Auth State Listener
    auth.onAuthStateChanged(async (user) => {
        updateAuthUI(!!user);

        const dashboardContent = document.getElementById('dashboardContent');
        const loginForm = document.getElementById('loginForm');

        if (user && dashboardContent && loginForm) {
            loginForm.classList.add('d-none');
            dashboardContent.classList.remove('d-none');

            try {
                // Ensure CountUp is available
                const countUpLoaded = await ensureCountUp();
                if (!countUpLoaded) {
                    console.warn("CountUp library failed to load, using fallback");
                }

                const doc = await db.collection('affiliates').doc(user.uid).get();
                if (!doc.exists) {
                    console.log('No affiliate data found for this user');
                    return;
                }

                const affiliateData = doc.data();
                document.getElementById('affiliateName').textContent = affiliateData.name;
                document.getElementById('promoCode').textContent = affiliateData.promoCode;

                // Initialize counters
                let clicksCounter, downloadsCounter, commissionCounter;
                try {
                    clicksCounter = new CountUp('clicks', 0, { duration: 2 });
                    downloadsCounter = new CountUp('downloads', 0, { duration: 2 });
                    commissionCounter = new CountUp('commission', 0, { prefix: '$', decimalPlaces: 2, duration: 2 });
                    if (!clicksCounter || !downloadsCounter || !commissionCounter) {
                        throw new Error("Failed to initialize CountUp instances");
                    }
                } catch (error) {
                    console.error("CountUp initialization error:", error);
                }

                // Populate and update app links table
                const linksTable = document.getElementById('appLinksTable').querySelector('tbody');
                const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

                const updateTable = (appDocs) => {
                    linksTable.innerHTML = '';
                    let totalClicks = 0, totalDownloads = 0, totalCommission = 0;
                    const tableCounters = {};

                    appDocs.forEach(doc => {
                        const appData = doc.data();
                        const appId = appData.appId;
                        const appInfo = apps[appId] || { name: appId, url: '#', marketUrl: '#' };
                        totalClicks += appData.clicks || 0;
                        totalDownloads += appData.downloads || 0;
                        totalCommission += appData.commission || 0;

                        const baseUrl = isMobile ? appInfo.marketUrl : appInfo.url;
                        const link = `${baseUrl}&referrer=${encodeURIComponent(affiliateData.promoCode)}`;
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${appInfo.name}</td>
                            <td>
                                <div class="link-container">
                                    <span class="link-text"><a href="${link}" target="_blank">${link}</a></span>
                                    <button class="copy-btn" data-link="${link}" title="Copy Link">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </td>
                            <td id="clicks-${appId}">${appData.clicks || 0}</td>
                            <td id="downloads-${appId}">${appData.downloads || 0}</td>
                            <td id="commission-${appId}">$${(appData.commission || 0).toFixed(2)}</td>
                        `;
                        linksTable.appendChild(row);

                        // Initialize table counters
                        try {
                            tableCounters[appId] = {
                                clicks: new CountUp(`clicks-${appId}`, appData.clicks || 0, { duration: 2 }),
                                downloads: new CountUp(`downloads-${appId}`, appData.downloads || 0, { duration: 2 }),
                                commission: new CountUp(`commission-${appId}`, appData.commission || 0, { prefix: '$', decimalPlaces: 2, duration: 2 })
                            };
                        } catch (error) {
                            console.error(`Error initializing table counters for ${appId}:`, error);
                        }
                    });

                    // Update total stats
                    try {
                        clicksCounter.update(totalClicks);
                        downloadsCounter.update(totalDownloads);
                        commissionCounter.update(totalCommission);
                    } catch (error) {
                        console.error("Error updating total counters:", error);
                        document.getElementById('clicks').textContent = totalClicks;
                        document.getElementById('downloads').textContent = totalDownloads;
                        document.getElementById('commission').textContent = `$${totalCommission.toFixed(2)}`;
                    }

                    // Add copy-to-clipboard functionality
                    document.querySelectorAll('.copy-btn').forEach(button => {
                        button.addEventListener('click', () => {
                            const link = button.getAttribute('data-link');
                            navigator.clipboard.writeText(link).then(() => {
                                button.innerHTML = '<i class="fas fa-check"></i>';
                                setTimeout(() => {
                                    button.innerHTML = '<i class="fas fa-copy"></i>';
                                }, 1000);
                            }).catch(err => {
                                console.error('Failed to copy link:', err);
                                alert('Failed to copy link. Please copy it manually.');
                            });
                        });
                    });

                    return { totalClicks, totalDownloads, totalCommission, tableCounters };
                };

                // Initial table population
                const appDocs = await db.collection('affiliates').doc(user.uid).collection('apps').get();
                updateTable(appDocs);

                // Real-time updates
                const unsubscribe = db.collection('affiliates').doc(user.uid).collection('apps').onSnapshot((snapshot) => {
                    const { tableCounters } = updateTable(snapshot);
                    snapshot.docChanges().forEach(change => {
                        const appData = change.doc.data();
                        const appId = appData.appId;
                        if (tableCounters[appId]) {
                            try {
                                tableCounters[appId].clicks.update(appData.clicks || 0);
                                tableCounters[appId].downloads.update(appData.downloads || 0);
                                tableCounters[appId].commission.update(appData.commission || 0);
                            } catch (error) {
                                console.error(`Error updating table counters for ${appId}:`, error);
                            }
                        }
                    });
                }, error => {
                    console.error("Error in real-time updates:", error);
                });

                if (logoutButton) {
                    logoutButton.addEventListener('click', () => {
                        unsubscribe();
                    });
                }

                // History chart
                try {
                    if (typeof Chart === 'undefined') {
                        console.warn("Chart.js not available");
                        return;
                    }

                    const currentWeek = getWeekNumber();
                    await db.collection('affiliates').doc(user.uid).collection('history').doc(`week${currentWeek}`).set(
                        { week: currentWeek, downloads: 0 }, { merge: true }
                    );

                    const historySnapshot = await db.collection('affiliates').doc(user.uid).collection('history')
                        .orderBy('week').limit(4).get();

                    const labels = [];
                    const data = [];
                    historySnapshot.forEach(doc => {
                        const historyData = doc.data();
                        labels.push(`Week ${historyData.week}`);
                        data.push(historyData.downloads || 0);
                    });

                    if (labels.length === 0) {
                        labels.push('Week 1', 'Week 2', 'Week 3', 'Week 4');
                        data.push(0, 0, 0, 0);
                    }

                    const chartElement = document.getElementById('performanceChart');
                    if (!chartElement) {
                        console.warn("Performance chart element not found");
                        return;
                    }

                    const ctx = chartElement.getContext('2d');
                    if (window.performanceChart && typeof window.performanceChart.destroy === 'function') {
                        window.performanceChart.destroy();
                    }

                    window.performanceChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Downloads',
                                data: data,
                                borderColor: '#FF6B6B',
                                fill: false
                            }]
                        },
                        options: {
                            scales: {
                                y: { beginAtZero: true }
                            }
                        }
                    });
                } catch (chartError) {
                    console.error('Error rendering chart:', chartError);
                }
            } catch (error) {
                console.error('Error fetching affiliate data:', error);
            }
        } else if (loginForm && dashboardContent) {
            loginForm.classList.remove('d-none');
            dashboardContent.classList.add('d-none');
        }
    });

    // Logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.signOut().catch(error => {
                console.error('Sign-out error:', error);
            });
            if (window.performanceChart && typeof window.performanceChart.destroy === 'function') {
                window.performanceChart.destroy();
            }
            window.performanceChart = null;
        });
    }

    // Menu Handlers
    const loginMenuItem = document.getElementById('loginMenuItem');
    const logoutMenuItem = document.getElementById('logoutMenuItem');

    if (loginMenuItem) {
        loginMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.dashboard').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (logoutMenuItem) {
        logoutMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut().catch(error => {
                console.error('Sign-out error:', error);
            });
        });
    }

    // Update UI based on auth state
    function updateAuthUI(isLoggedIn) {
        if (loginMenuItem && logoutMenuItem) {
            loginMenuItem.classList.toggle('d-none', isLoggedIn);
            logoutMenuItem.classList.toggle('d-none', !isLoggedIn);
        }
    }

    // Track affiliate click
    window.trackAffiliateClick = async function(promoCode, appId) {
        try {
            if (!promoCode.match(/^[A-Z0-9]{8,12}$/)) {
                throw new Error(`Invalid promoCode format: ${promoCode}`);
            }
            if (!Object.keys(apps).includes(appId)) {
                throw new Error(`Invalid appId: ${appId}`);
            }

            if (!auth.currentUser) {
                await auth.signInAnonymously();
                // Wait for auth state to propagate
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const querySnapshot = await db.collection('affiliates')
                .where('promoCode', '==', promoCode)
                .limit(1)
                .get();

            if (!querySnapshot.empty) {
                const affiliateDoc = querySnapshot.docs[0];
                await affiliateDoc.ref.collection('apps').doc(appId).update({
                    clicks: firebase.firestore.FieldValue.increment(1)
                });
                console.log(`Tracked click for ${appId} with promo ${promoCode}`);
            } else {
                console.warn(`No affiliate found with promo code ${promoCode}`);
            }
        } catch (error) {
            console.error('Error tracking click:', error);
        }
    };

    // Record download
    window.recordDownload = async function(promoCode, appId) {
        try {
            if (!promoCode.match(/^[A-Z0-9]{8,12}$/)) {
                throw new Error(`Invalid promoCode format: ${promoCode}`);
            }
            if (!Object.keys(apps).includes(appId)) {
                throw new Error(`Invalid appId: ${appId}`);
            }

            if (!auth.currentUser) {
                await auth.signInAnonymously();
                // Wait for auth state to propagate
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const weekNumber = getWeekNumber();
            const querySnapshot = await db.collection('affiliates')
                .where('promoCode', '==', promoCode)
                .limit(1)
                .get();

            if (!querySnapshot.empty) {
                const affiliateDoc = querySnapshot.docs[0];
                const batch = db.batch();

                const appRef = affiliateDoc.ref.collection('apps').doc(appId);
                batch.update(appRef, {
                    downloads: firebase.firestore.FieldValue.increment(1),
                    commission: firebase.firestore.FieldValue.increment(0.05)
                });

                const historyRef = affiliateDoc.ref.collection('history').doc(`week${weekNumber}`);
                batch.set(historyRef, {
                    week: weekNumber,
                    downloads: firebase.firestore.FieldValue.increment(1)
                }, { merge: true });

                await batch.commit();
                console.log(`Recorded download for ${appId} with promo ${promoCode}`);
            } else {
                console.warn(`No affiliate found with promo code ${promoCode}`);
            }
        } catch (error) {
            console.error('Error recording download:', error);
        }
    };

    // Get week number
    function getWeekNumber() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        return Math.ceil((((now - start) / 86400000) + start.getDay() + 1) / 7);
    }
});