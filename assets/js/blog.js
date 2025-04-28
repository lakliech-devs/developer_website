document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    })
  }

  // Category filtering
  const categoryTabs = document.querySelectorAll(".category-tab")
  const blogPosts = document.querySelectorAll("#blogPostsContainer > div")

  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      categoryTabs.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked tab
      this.classList.add("active")

      const category = this.getAttribute("data-category")

      // Show/hide posts based on category
      blogPosts.forEach((post) => {
        if (category === "all") {
          post.style.display = "block"
        } else {
          const postCategories = post.getAttribute("data-category")
          if (postCategories && postCategories.includes(category)) {
            post.style.display = "block"
          } else {
            post.style.display = "none"
          }
        }
      })
    })
  })

  // Search functionality
  const searchForm = document.getElementById("searchForm")
  const searchInput = document.getElementById("searchInput")

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const searchTerm = searchInput.value.toLowerCase()

      if (searchTerm.length > 2) {
        // Reset category tabs
        categoryTabs.forEach((t) => t.classList.remove("active"))
        document.querySelector('[data-category="all"]').classList.add("active")

        // Filter posts based on search term
        blogPosts.forEach((post) => {
          const postTitle = post.querySelector("h3").textContent.toLowerCase()
          const postContent = post.querySelector("p").textContent.toLowerCase()

          if (postTitle.includes(searchTerm) || postContent.includes(searchTerm)) {
            post.style.display = "block"
          } else {
            post.style.display = "none"
          }
        })
      } else if (searchTerm.length === 0) {
        // If search is cleared, show all posts
        blogPosts.forEach((post) => {
          post.style.display = "block"
        })
      } else {
        alert("Please enter at least 3 characters to search")
      }
    })
  }

  // Load more functionality
  const loadMoreBtn = document.getElementById("loadMoreBtn")
  let currentItems = 6

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      const visiblePosts = Array.from(blogPosts).filter((post) => post.style.display !== "none")

      for (let i = currentItems; i < currentItems + 3; i++) {
        if (visiblePosts[i]) {
          visiblePosts[i].classList.add("fade-in")
        }
      }

      currentItems += 3

      // Hide button if all posts are visible
      if (currentItems >= visiblePosts.length) {
        loadMoreBtn.style.display = "none"
      }
    })
  }

  // Newsletter form submission
  const newsletterForm = document.getElementById("newsletterForm")

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const email = this.querySelector('input[type="email"]').value

      // Here you would typically send this to your backend
      // For now, we'll just show a success message
      alert(
        `Thank you for subscribing with ${email}! You'll receive our latest Flutter development tips and tutorials.`,
      )
      this.reset()
    })
  }

  // URL parameter handling for filtering
  const urlParams = new URLSearchParams(window.location.search)
  const tagParam = urlParams.get("tag")
  const categoryParam = urlParams.get("category")

  if (tagParam) {
    // Filter by tag
    blogPosts.forEach((post) => {
      const postTags = post.querySelectorAll(".tag")
      let hasTag = false

      postTags.forEach((tag) => {
        if (tag.textContent.toLowerCase() === tagParam.toLowerCase()) {
          hasTag = true
        }
      })

      post.style.display = hasTag ? "block" : "none"
    })
  } else if (categoryParam) {
    // Filter by category
    const categoryTab = document.querySelector(`[data-category="${categoryParam}"]`)
    if (categoryTab) {
      categoryTab.click()
    }
  }
})
