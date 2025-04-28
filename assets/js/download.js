document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  AOS.init({ duration: 1000 })

  // App configuration (same as affiliate.js)
  const apps = {
    math_flash: {
      name: "Math Flash",
      description:
        "Boost your math skills with fun challenges! This educational app helps students of all ages improve their math abilities through interactive flashcards, timed quizzes, and progress tracking.",
      package: "com.lakliech.math_flash",
      url: "https://play.google.com/store/apps/details?id=com.lakliech.math_flash",
      marketUrl: "market://details?id=com.lakliech.math_flash",
      image: "assets/img/apps/mathflash.png",
      features: [
        "Adaptive learning algorithm",
        "Customizable flashcard decks",
        "Timed quizzes with difficulty progression",
        "Detailed progress analytics",
        "Offline learning capabilities",
      ],
      screenshots: [
        "assets/img/mockups/mathflash-screen1.jpg",
        "assets/img/mockups/mathflash-screen2.jpg",
        "assets/img/mockups/mathflash-screen3.jpg",
      ],
      category: "education",
    },
    moyo_match: {
      name: "Moyo Match",
      description:
        "Connect hearts with this exciting dating app! Moyo Match features video call capabilities, secure messaging, and intelligent matching algorithms to help you find meaningful connections.",
      package: "com.lakliech.moyo_match",
      url: "https://play.google.com/store/apps/details?id=com.lakliech.moyo_match",
      marketUrl: "market://details?id=com.lakliech.moyo_match",
      image: "assets/img/apps/moyomatch.png",
      features: [
        "Real-time video calling",
        "AI-powered matching algorithm",
        "Secure messaging with encryption",
        "Verified profiles to prevent catfishing",
        "Interactive icebreakers and conversation starters",
      ],
      screenshots: [
        "assets/img/mockups/moyomatch-screen1.jpg",
        "assets/img/mockups/moyomatch-screen2.jpg",
        "assets/img/mockups/moyomatch-screen3.jpg",
      ],
      category: "social",
    },
    sabbath_gpt: {
      name: "Sabbath GPT",
      description:
        "Explore faith with AI-powered insights. This spiritual companion app provides meditation sessions, biblical content, and prayer reminders tailored for Sabbath practices.",
      package: "com.lakliech.sabbath_gpt",
      url: "https://play.google.com/store/apps/details?id=com.lakliech.sabbath_gpt",
      marketUrl: "market://details?id=com.lakliech.sabbath_gpt",
      image: "assets/img/apps/sabbathgpt.jpg",
      features: [
        "AI-powered spiritual conversations",
        "Guided meditation sessions",
        "Biblical study materials",
        "Prayer reminders and journal",
        "Offline mode for Sabbath observance",
      ],
      screenshots: [
        "assets/img/mockups/sabbathgpt-screen1.jpg",
        "assets/img/mockups/sabbathgpt-screen2.jpg",
        "assets/img/mockups/sabbathgpt-screen3.jpg",
      ],
      category: "lifestyle",
    },
    penzii_vibe: {
      name: "Penzii Vibe",
      description:
        "Vibe with music and creativity! Penzii Vibe is a dating app focused on meaningful connections over casual swiping, with emphasis on personality compatibility.",
      package: "com.lakliech.penzii_vibe",
      url: "https://play.google.com/store/apps/details?id=com.lakliech.penzii_vibe",
      marketUrl: "market://details?id=com.lakliech.penzii_vibe",
      image: "assets/img/apps/penzivibe.png",
      features: [
        "Personality-based matching algorithm",
        "End-to-end encrypted messaging",
        "HD video calling",
        "Interest-based communities",
        "Virtual date experiences",
      ],
      screenshots: [
        "assets/img/mockups/penzivibe-screen1.jpg",
        "assets/img/mockups/penzivibe-screen2.jpg",
        "assets/img/mockups/penzivibe-screen3.jpg",
      ],
      category: "social",
    },
    my_water_tracker: {
      name: "My Water Tracker",
      description:
        "Stay hydrated with daily reminders. This health app helps you track your water intake, set personalized goals, and visualize your progress toward better hydration habits.",
      package: "com.lakliech.my_water_tracker",
      url: "https://play.google.com/store/apps/details?id=com.lakliech.my_water_tracker",
      marketUrl: "market://details?id=com.lakliech.my_water_tracker",
      image: "assets/img/apps/waterintake.png",
      features: [
        "Personalized hydration goals",
        "Customizable reminder schedule",
        "Visual progress tracking",
        "Hydration insights and statistics",
        "Integration with health apps",
      ],
      screenshots: [
        "assets/img/mockups/waterintake-screen1.jpg",
        "assets/img/mockups/waterintake-screen2.jpg",
        "assets/img/mockups/waterintake-screen3.jpg",
      ],
      category: "health",
    },
  }

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  let promoCode = urlParams.get("referrer") || urlParams.get("code")
  let appId = urlParams.get("app")

  // Handle Play Store URLs (https:// or market://)
  if (!appId) {
    const url = window.location.href
    let packageId
    if (url.includes("play.google.com")) {
      const playStoreParams = new URLSearchParams(url.split("?")[1])
      promoCode = playStoreParams.get("referrer") || playStoreParams.get("code") || promoCode
      packageId = playStoreParams.get("id")
    } else if (url.includes("market://")) {
      const marketParams = new URLSearchParams(url.split("?")[1])
      promoCode = marketParams.get("referrer") || promoCode
      packageId = marketParams.get("id")
    }
    // Map package ID to appId
    appId = Object.keys(apps).find((key) => apps[key].package === packageId) || "sabbath_gpt" // Default to SabbathGPT if not found
  }

  // Update app info
  const appInfo = apps[appId] || apps.sabbath_gpt // Default to SabbathGPT if not found

  // Update app preview image
  const appPreviewImg = document.querySelector(".app-preview-img")
  if (appPreviewImg) {
    appPreviewImg.src = appInfo.image
    appPreviewImg.alt = appInfo.name
  }

  // Update app name and description
  document.getElementById("appName").textContent = appInfo.name
  document.getElementById("appDescription").textContent = appInfo.description

  // Update app features
  const appFeaturesList = document.getElementById("appFeatures")
  if (appFeaturesList) {
    appFeaturesList.innerHTML = ""
    appInfo.features.forEach((feature) => {
      const li = document.createElement("li")
      li.innerHTML = `<i class="fas fa-check-circle"></i> <span>${feature}</span>`
      appFeaturesList.appendChild(li)
    })
  }

  // Set up download buttons
  const downloadButton = document.getElementById("downloadButton")
  const appStoreButton = document.getElementById("appStoreButton")

  if (downloadButton) {
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)
    const baseUrl = isMobile ? appInfo.marketUrl : appInfo.url
    downloadButton.href = promoCode ? `${baseUrl}&referrer=${encodeURIComponent(promoCode)}` : baseUrl
  }

  if (appStoreButton) {
    // For now, we'll just disable the App Store button since these are Android apps
    appStoreButton.classList.add("disabled")
    appStoreButton.setAttribute("aria-disabled", "true")
    appStoreButton.addEventListener("click", (e) => {
      e.preventDefault()
      alert("iOS version coming soon!")
    })
  }

  // Show affiliate message if promo code is present
  if (promoCode && document.getElementById("affiliateMessage")) {
    document.getElementById("affiliateMessage").textContent =
      `You're downloading ${appInfo.name} through affiliate code: ${promoCode}`
  }

  // Load screenshots
  const screenshotWrapper = document.getElementById("screenshotWrapper")
  if (screenshotWrapper) {
    screenshotWrapper.innerHTML = ""

    // Use placeholder screenshots if real ones aren't available
    const screenshots = appInfo.screenshots || [
      "assets/img/mockups/screenshot-placeholder.jpg",
      "assets/img/mockups/screenshot-placeholder.jpg",
      "assets/img/mockups/screenshot-placeholder.jpg",
    ]

    screenshots.forEach((screenshot) => {
      const slide = document.createElement("div")
      slide.className = "swiper-slide"
      slide.innerHTML = `
                <div class="screenshot-item">
                    <img src="${screenshot}" alt="${appInfo.name} Screenshot" class="img-fluid">
                </div>
            `
      screenshotWrapper.appendChild(slide)
    })

    // Initialize screenshot slider
    const swiper = new Swiper(".screenshot-slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    })
  }

  // Load related apps
  const relatedAppsContainer = document.getElementById("relatedApps")
  if (relatedAppsContainer) {
    relatedAppsContainer.innerHTML = ""

    // Get apps in the same category or just show other apps
    const currentCategory = appInfo.category
    const relatedAppIds = Object.keys(apps)
      .filter((id) => id !== appId && (!currentCategory || apps[id].category === currentCategory))
      .slice(0, 3) // Show up to 3 related apps

    relatedAppIds.forEach((relatedAppId) => {
      const relatedApp = apps[relatedAppId]
      const col = document.createElement("div")
      col.className = "col-md-4 mb-4"
      col.innerHTML = `
                <div class="app-card">
                    <div class="app-image">
                        <img src="${relatedApp.image}" alt="${relatedApp.name}">
                        <div class="app-overlay">
                            <a href="download.html?app=${relatedAppId}${promoCode ? "&referrer=" + promoCode : ""}" class="btn btn-outline">View Details</a>
                        </div>
                    </div>
                    <div class="app-info">
                        <h3>${relatedApp.name}</h3>
                        <p>${relatedApp.description.substring(0, 80)}...</p>
                        <div class="app-tech">
                            <span>${relatedApp.category || "App"}</span>
                        </div>
                    </div>
                </div>
            `
      relatedAppsContainer.appendChild(col)
    })
  }

  // Track affiliate click if code is present
  if (promoCode && appId && apps[appId] && typeof window.trackAffiliateClick === "function") {
    try {
      window.trackAffiliateClick(promoCode, appId)
    } catch (error) {
      console.error("Failed to track click:", error)
    }
  }

  // Track download on button click
  if (downloadButton && promoCode && appId && apps[appId] && typeof window.recordDownload === "function") {
    downloadButton.addEventListener("click", () => {
      try {
        window.recordDownload(promoCode, appId)
      } catch (error) {
        console.error("Failed to record download:", error)
      }
    })
  }
})
