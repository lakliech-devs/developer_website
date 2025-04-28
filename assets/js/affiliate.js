import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBXH7JgXIWzi7-jb_GHNvwqXrkgMTd-5_k",
    authDomain: "lakliech-devs.firebaseapp.com",
    projectId: "lakliech-devs",
    storageBucket: "lakliech-devs.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef",
  }

  // Initialize Firebase if available
  let db = null
  let auth = null
  let currentUser = null
  let isFirebaseInitialized = false

  try {
    if (typeof firebase !== "undefined") {
      firebase.initializeApp(firebaseConfig)
      db = firebase.firestore()
      auth = firebase.auth()
      isFirebaseInitialized = true
    } else {
      console.warn("Firebase is not available. Running in demo mode.")
    }
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }

  // App configuration
  const apps = {
    math_flash: {
      name: "Math Flash",
      description: "Educational app for math practice",
      package: "com.lakliech.math_flash",
      url: "https://play.google.com/store/apps/details?id=com.lakliech.math_flash",
      price: 2.99,
    },
    moyo_match: {
      name: "Moyo Match",
      description: "Dating app with video call capabilities",
      package: "com.lakliech.moyo_match",
      url: "https://play.google.com/store/apps/details?id=com.lakliech.moyo_match",
      price: 4.99,
    },
    sabbath_gpt: {
      name: "Sabbath GPT",
      description: "AI-powered spiritual guidance",
      package: "com.lakliech.sabbath_gpt",
      url: "https://play.google.com/store/apps/details?id=com.lakliech.sabbath_gpt",
      price: 3.99,
    },
    penzii_vibe: {
      name: "Penzii Vibe",
      description: "Dating app for meaningful connections",
      package: "com.lakliech.penzii_vibe",
      url: "https://play.google.com/store/apps/details?id=com.lakliech.penzii_vibe",
      price: 4.99,
    },
    my_water_tracker: {
      name: "My Water Tracker",
      description: "Track your daily water intake",
      package: "com.lakliech.my_water_tracker",
      url: "https://play.google.com/store/apps/details?id=com.lakliech.my_water_tracker",
      price: 1.99,
    },
  }

  // DOM elements
  const loginForm = document.getElementById("loginForm")
  const affiliateForm = document.getElementById("affiliateForm")
  const dashboardContent = document.getElementById("dashboardContent")
  const loginMenuItem = document.getElementById("loginMenuItem")
  const logoutMenuItem = document.getElementById("logoutMenuItem")
  const logoutButton = document.getElementById("logoutButton")
  const forgotPasswordLink = document.getElementById("forgotPasswordLink")
  const copyCodeBtn = document.getElementById("copyCodeBtn")

  // Check if user is already logged in
  if (isFirebaseInitialized && auth) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        currentUser = user
        showDashboard()
      } else {
        hideDashboard()
      }
    })
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("username").value
      const password = document.getElementById("loginPassword").value

      if (isFirebaseInitialized && auth) {
        // Real login with Firebase
        auth
          .signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            currentUser = userCredential.user
            showDashboard()
          })
          .catch((error) => {
            showAlert(`Login failed: ${error.message}`, "danger")
          })
      } else {
        // Demo mode login
        if (email === "demo@example.com" && password === "password") {
          currentUser = { email: email, uid: "demo-user-123" }
          showDashboard()
        } else {
          showAlert("Login failed. In demo mode, use demo@example.com / password", "danger")
        }
      }
    })
  }

  // Registration form submission
  if (affiliateForm) {
    affiliateForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirmPassword").value
      const paypal = document.getElementById("paypal").value
      const social = document.getElementById("social").value
      const website = document.getElementById("website").value
      const termsCheck = document.getElementById("termsCheck").checked

      // Validation
      if (!name || !email || !password || !paypal) {
        showAlert("Please fill in all required fields.", "danger")
        return
      }

      if (password !== confirmPassword) {
        showAlert("Passwords do not match.", "danger")
        return
      }

      if (!termsCheck) {
        showAlert("You must agree to the Terms and Conditions.", "danger")
        return
      }

      if (isFirebaseInitialized && auth && db) {
        // Real registration with Firebase
        auth
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user

            // Generate promo code
            const promoCode = generatePromoCode(name)

            // Save user data to Firestore
            return db
              .collection("affiliates")
              .doc(user.uid)
              .set({
                name: name,
                email: email,
                paypal: paypal,
                social: social || "",
                website: website || "",
                promoCode: promoCode,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                stats: {
                  clicks: 0,
                  downloads: 0,
                  commission: 0,
                },
              })
          })
          .then(() => {
            showAlert("Registration successful! You can now log in.", "success")
            affiliateForm.reset()

            // Scroll to login section
            const dashboardSection = document.getElementById("dashboard")
            if (dashboardSection) {
              dashboardSection.scrollIntoView({ behavior: "smooth" })
            }
          })
          .catch((error) => {
            showAlert(`Registration failed: ${error.message}`, "danger")
          })
      } else {
        // Demo mode registration
        showAlert("Registration successful! (Demo Mode) You can now log in with demo@example.com / password", "success")
        affiliateForm.reset()

        // Scroll to login section
        const dashboardSection = document.getElementById("dashboard")
        if (dashboardSection) {
          dashboardSection.scrollIntoView({ behavior: "smooth" })
        }
      }
    })
  }

  // Logout functionality
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (isFirebaseInitialized && auth) {
        auth
          .signOut()
          .then(() => {
            hideDashboard()
          })
          .catch((error) => {
            showAlert(`Logout failed: ${error.message}`, "danger")
          })
      } else {
        currentUser = null
        hideDashboard()
      }
    })
  }

  // Forgot password functionality
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault()

      const email = prompt("Please enter your email address:")
      if (!email) return

      if (isFirebaseInitialized && auth) {
        auth
          .sendPasswordResetEmail(email)
          .then(() => {
            showAlert("Password reset email sent. Check your inbox.", "success")
          })
          .catch((error) => {
            showAlert(`Password reset failed: ${error.message}`, "danger")
          })
      } else {
        showAlert("Password reset email would be sent in production mode.", "info")
      }
    })
  }

  // Copy promo code functionality
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", () => {
      const promoCode = document.getElementById("promoCode").textContent
      navigator.clipboard
        .writeText(promoCode)
        .then(() => {
          copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!'
          setTimeout(() => {
            copyCodeBtn.innerHTML = '<i class="fas fa-copy"></i> Copy'
          }, 2000)
        })
        .catch((err) => {
          console.error("Could not copy text: ", err)
        })
    })
  }

  // Show dashboard content
  function showDashboard() {
    if (loginForm) loginForm.classList.add("d-none")
    if (dashboardContent) dashboardContent.classList.remove("d-none")
    if (loginMenuItem) loginMenuItem.classList.add("d-none")
    if (logoutMenuItem) logoutMenuItem.classList.remove("d-none")

    loadDashboardData()
  }

  // Hide dashboard content
  function hideDashboard() {
    if (loginForm) loginForm.classList.remove("d-none")
    if (dashboardContent) dashboardContent.classList.add("d-none")
    if (loginMenuItem) loginMenuItem.classList.remove("d-none")
    if (logoutMenuItem) logoutMenuItem.classList.add("d-none")
  }

  // Load dashboard data
  function loadDashboardData() {
    if (!dashboardContent) return

    let affiliateData

    if (isFirebaseInitialized && db && currentUser) {
      // Fetch real data from Firestore
      db.collection("affiliates")
        .doc(currentUser.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            affiliateData = doc.data()
            updateDashboardUI(affiliateData)
          } else {
            showAlert("Affiliate data not found.", "danger")
          }
        })
        .catch((error) => {
          console.error("Error getting affiliate data:", error)
          showAlert("Failed to load affiliate data.", "danger")
        })
    } else {
      // Demo data
      affiliateData = {
        name: "Demo User",
        promoCode: "DEMO123",
        stats: {
          clicks: 156,
          downloads: 42,
          commission: 52.5,
        },
        appStats: [
          { appId: "math_flash", clicks: 45, downloads: 12, commission: 17.94 },
          { appId: "moyo_match", clicks: 62, downloads: 18, commission: 44.91 },
          { appId: "sabbath_gpt", clicks: 49, downloads: 12, commission: 23.94 },
        ],
        monthlyStats: [
          { month: "Jan", clicks: 20, downloads: 5, commission: 7.5 },
          { month: "Feb", clicks: 35, downloads: 8, commission: 12.0 },
          { month: "Mar", clicks: 42, downloads: 10, commission: 15.0 },
          { month: "Apr", clicks: 59, downloads: 19, commission: 28.5 },
        ],
      }

      updateDashboardUI(affiliateData)
    }
  }

  // Update dashboard UI with affiliate data
  function updateDashboardUI(data) {
    // Update affiliate name
    const affiliateNameElement = document.getElementById("affiliateName")
    if (affiliateNameElement) {
      affiliateNameElement.textContent = data.name
    }

    // Update promo code
    const promoCodeElement = document.getElementById("promoCode")
    if (promoCodeElement) {
      promoCodeElement.textContent = data.promoCode
    }

    // Update stats with animation
    animateCounter("clicks", data.stats.clicks)
    animateCounter("downloads", data.stats.downloads)
    animateCounter("commission", data.stats.commission, true)

    // Update app links table
    const appLinksTable = document.getElementById("appLinksTable")
    if (appLinksTable) {
      const tbody = appLinksTable.querySelector("tbody")
      tbody.innerHTML = ""

      const appStats = data.appStats || []

      if (appStats.length === 0) {
        // If no app stats, show all apps with zero stats
        Object.keys(apps).forEach((appId) => {
          const app = apps[appId]
          const row = createAppRow(appId, app, data.promoCode, 0, 0, 0)
          tbody.appendChild(row)
        })
      } else {
        // Show app stats
        appStats.forEach((stat) => {
          const app = apps[stat.appId]
          if (app) {
            const row = createAppRow(stat.appId, app, data.promoCode, stat.clicks, stat.downloads, stat.commission)
            tbody.appendChild(row)
          }
        })
      }
    }

    // Create performance chart
    createPerformanceChart(data.monthlyStats || [])
  }

  // Create app row for the table
  function createAppRow(appId, app, promoCode, clicks, downloads, commission) {
    const tr = document.createElement("tr")

    const affiliateLink = `${app.url}&referrer=${encodeURIComponent(promoCode)}`

    tr.innerHTML = `
            <td>${app.name}</td>
            <td>
                <div class="input-group">
                    <input type="text" class="form-control form-control-sm" value="${affiliateLink}" readonly>
                    <button class="btn btn-sm btn-outline-primary copy-link-btn" data-link="${affiliateLink}">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </td>
            <td>${clicks}</td>
            <td>${downloads}</td>
            <td>$${commission.toFixed(2)}</td>
        `

    // Add copy functionality to the button
    const copyBtn = tr.querySelector(".copy-link-btn")
    copyBtn.addEventListener("click", () => {
      navigator.clipboard
        .writeText(affiliateLink)
        .then(() => {
          copyBtn.innerHTML = '<i class="fas fa-check"></i>'
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>'
          }, 2000)
        })
        .catch((err) => {
          console.error("Could not copy text: ", err)
        })
    })

    return tr
  }

  // Create performance chart
  function createPerformanceChart(monthlyStats) {
    const chartCanvas = document.getElementById("performanceChart")
    if (!chartCanvas) return

    // If no monthly stats, create demo data
    if (!monthlyStats || monthlyStats.length === 0) {
      monthlyStats = [
        { month: "Jan", clicks: 20, downloads: 5, commission: 7.5 },
        { month: "Feb", clicks: 35, downloads: 8, commission: 12.0 },
        { month: "Mar", clicks: 42, downloads: 10, commission: 15.0 },
        { month: "Apr", clicks: 59, downloads: 19, commission: 28.5 },
      ]
    }

    // Extract data for chart
    const labels = monthlyStats.map((stat) => stat.month)
    const clicksData = monthlyStats.map((stat) => stat.clicks)
    const downloadsData = monthlyStats.map((stat) => stat.downloads)
    const commissionData = monthlyStats.map((stat) => stat.commission)

    // Check if Chart.js is available
    if (typeof Chart !== "undefined") {
      // Destroy existing chart if it exists
      if (window.performanceChart) {
        window.performanceChart.destroy()
      }

      // Create new chart
      window.performanceChart = new Chart(chartCanvas, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Clicks",
              data: clicksData,
              borderColor: "#1A1E3D",
              backgroundColor: "rgba(26, 30, 61, 0.1)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Downloads",
              data: downloadsData,
              borderColor: "#FF6B6B",
              backgroundColor: "rgba(255, 107, 107, 0.1)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Commission ($)",
              data: commissionData,
              borderColor: "#FFD700",
              backgroundColor: "rgba(255, 215, 0, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || ""
                  if (label) {
                    label += ": "
                  }
                  if (context.dataset.label === "Commission ($)") {
                    label += "$" + context.parsed.y.toFixed(2)
                  } else {
                    label += context.parsed.y
                  }
                  return label
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    } else {
      console.warn("Chart.js is not available. Chart will not be rendered.")
      chartCanvas.parentElement.innerHTML =
        '<div class="alert alert-warning">Chart visualization is not available in demo mode.</div>'
    }
  }

  // Animate counter
  function animateCounter(elementId, value, isCurrency = false) {
    const element = document.getElementById(elementId)
    if (!element) return

    const startValue = 0
    const duration = 1500
    const startTime = performance.now()

    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      const currentValue = Math.floor(progress * value)

      if (isCurrency) {
        element.textContent = "$" + currentValue.toFixed(2)
      } else {
        element.textContent = currentValue
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      } else {
        if (isCurrency) {
          element.textContent = "$" + value.toFixed(2)
        } else {
          element.textContent = value
        }
      }
    }

    requestAnimationFrame(updateCounter)
  }

  // Generate promo code from name
  function generatePromoCode(name) {
    const prefix = name
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 4)
      .toUpperCase()
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}${randomNum}`
  }

  // Helper function to show alerts
  function showAlert(message, type) {
    // Check if alert container exists, if not create it
    let alertContainer = document.querySelector(".alert-container")
    if (!alertContainer) {
      alertContainer = document.createElement("div")
      alertContainer.className = "alert-container"
      alertContainer.style.position = "fixed"
      alertContainer.style.top = "20px"
      alertContainer.style.right = "20px"
      alertContainer.style.zIndex = "9999"
      document.body.appendChild(alertContainer)
    }

    // Create alert element
    const alert = document.createElement("div")
    alert.className = `alert alert-${type} alert-dismissible fade show`
    alert.role = "alert"
    alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `

    // Add alert to container
    alertContainer.appendChild(alert)

    // Remove alert after 5 seconds
    setTimeout(() => {
      alert.classList.remove("show")
      setTimeout(() => {
        alert.remove()
      }, 300)
    }, 5000)

    // Add click event to close button
    const closeButton = alert.querySelector(".btn-close")
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        alert.classList.remove("show")
        setTimeout(() => {
          alert.remove()
        }, 300)
      })
    }
  }

  // Expose tracking functions to window for use in download.js
  window.trackAffiliateClick = (promoCode, appId) => {
    if (!isFirebaseInitialized || !db) {
      console.log("Demo mode: Tracking click for", promoCode, "on app", appId)
      return
    }

    // In production, this would update the click count in Firestore
    db.collection("affiliateClicks")
      .add({
        promoCode: promoCode,
        appId: appId,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("Click tracked successfully")
      })
      .catch((error) => {
        console.error("Error tracking click:", error)
      })
  }

  window.recordDownload = (promoCode, appId) => {
    if (!isFirebaseInitialized || !db) {
      console.log("Demo mode: Recording download for", promoCode, "on app", appId)
      return
    }

    // In production, this would update the download count and commission in Firestore
    db.collection("affiliateDownloads")
      .add({
        promoCode: promoCode,
        appId: appId,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        price: apps[appId] ? apps[appId].price : 0,
      })
      .then(() => {
        console.log("Download recorded successfully")
      })
      .catch((error) => {
        console.error("Error recording download:", error)
      })
  }
})
