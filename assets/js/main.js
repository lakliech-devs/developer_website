document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS (Animate On Scroll) for all pages
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true, // Animations trigger only once
      offset: 100, // Trigger animations slightly before element is in view
      disable: "mobile", // Disable on mobile devices to improve performance
    })
  }

  // Navbar scroll effect (highlight active section and add shrink effect)
  const navbar = document.querySelector(".navbar")
  const navLinks = document.querySelectorAll(".nav-link")

  window.addEventListener("scroll", () => {
    // Shrink navbar on scroll
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-shrink")
    } else {
      navbar.classList.remove("navbar-shrink")
    }

    // Highlight active nav link based on section in view
    const sections = document.querySelectorAll("section")
    let current = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.offsetHeight
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      const href = link.getAttribute("href")
      if (href && href.includes(current)) {
        link.classList.add("active")
      }
    })
  })

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      if (anchor.getAttribute("href") !== "#") {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 70,
            behavior: "smooth",
          })
        }
      }
    })
  })

  // Mobile menu close on click
  const navbarToggler = document.querySelector(".navbar-toggler")
  const navbarCollapse = document.querySelector(".navbar-collapse")

  if (navbarToggler && navbarCollapse) {
    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 992) {
          navbarCollapse.classList.remove("show")
        }
      })
    })
  }

  // Add active class to current page nav link
  const currentPage = window.location.pathname.split("/").pop()
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href")
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active")
    }
  })
})

// Add page transition class to body when page loads
document.body.classList.add("page-transition")

// Add scroll indicator to hero section if it exists
const heroSection = document.querySelector(".hero")
if (heroSection) {
  const scrollIndicator = document.createElement("div")
  scrollIndicator.className = "scroll-indicator"
  heroSection.appendChild(scrollIndicator)

  // Hide scroll indicator when user scrolls
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      scrollIndicator.style.opacity = "0"
    } else {
      scrollIndicator.style.opacity = "0.7"
    }
  })
}

// Add swipe indicators to sliders on mobile
if (window.innerWidth < 768) {
  const sliders = document.querySelectorAll(".swiper")
  sliders.forEach((slider) => {
    const swipeIndicator = document.createElement("div")
    swipeIndicator.className = "swipe-indicator"
    slider.appendChild(swipeIndicator)

    // Hide swipe indicator after 5 seconds
    setTimeout(() => {
      swipeIndicator.style.opacity = "0"
      swipeIndicator.style.transition = "opacity 1s ease"
    }, 5000)
  })
}

// Add loading animation for images
const images = document.querySelectorAll('img[loading="lazy"]')
images.forEach((img) => {
  const wrapper = document.createElement("div")
  wrapper.className = "image-loading-wrapper"
  wrapper.style.position = "relative"

  const loading = document.createElement("div")
  loading.className = "loading"
  loading.innerHTML = "<div></div><div></div><div></div><div></div>"
  loading.style.position = "absolute"
  loading.style.top = "50%"
  loading.style.left = "50%"
  loading.style.transform = "translate(-50%, -50%)"

  img.parentNode.insertBefore(wrapper, img)
  wrapper.appendChild(img)
  wrapper.appendChild(loading)

  img.addEventListener("load", () => {
    loading.style.display = "none"
  })
})

// Fix navbar collapse issue
const navbarToggler = document.querySelector(".navbar-toggler")
const navbarCollapse = document.querySelector(".navbar-collapse")

if (navbarToggler && navbarCollapse) {
  // Ensure navbar collapses on mobile when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !navbarToggler.contains(e.target) &&
      !navbarCollapse.contains(e.target) &&
      navbarCollapse.classList.contains("show")
    ) {
      navbarCollapse.classList.remove("show")
    }
  })

  // Ensure navbar collapses after clicking a link on mobile
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992 && navbarCollapse.classList.contains("show")) {
        navbarToggler.click()
      }
    })
  })
}

// Add smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    if (this.getAttribute("href") !== "#") {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: "smooth",
        })
      }
    }
  })
})
