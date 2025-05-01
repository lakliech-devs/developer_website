document.addEventListener("DOMContentLoaded", () => {
  // Portfolio filter functionality
  const filterButtons = document.querySelectorAll(".filter-btn")
  const portfolioItems = document.querySelectorAll(".portfolio-item")

  // Debug information
  console.log("Portfolio items found:", portfolioItems.length)

  // Force all items to be visible and ensure they stay that way
  function showAllItems() {
    console.log("Showing all portfolio items")
    portfolioItems.forEach((item) => {
      item.style.display = "block"
      item.style.visibility = "visible"
      item.style.opacity = "1"
    })
  }

  // Call immediately
  showAllItems()

  // Also call after a slight delay to override any other scripts
  setTimeout(showAllItems, 100)
  setTimeout(showAllItems, 500)

  // Filter button click handler
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Filter clicked:", button.getAttribute("data-filter"))

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Get filter value
      const filterValue = button.getAttribute("data-filter")

      // Simple filtering
      portfolioItems.forEach((item) => {
        const category = item.getAttribute("data-category")
        console.log(`Item category: ${category}, filter: ${filterValue}`)

        if (filterValue === "all" || category === filterValue) {
          item.style.display = "block"
          item.style.visibility = "visible"
          item.style.opacity = "1"
        } else {
          item.style.display = "none"
        }
      })
    })
  })

  // Initialize modals if Bootstrap is available
  if (typeof window.bootstrap !== "undefined") {
    const modals = document.querySelectorAll(".modal")
    modals.forEach((modal) => {
      new window.bootstrap.Modal(modal)
    })
  }

  // Disable AOS for portfolio items to prevent visibility issues
  portfolioItems.forEach((item) => {
    item.removeAttribute("data-aos")
    item.removeAttribute("data-aos-delay")
  })
})

// Add an event listener for when everything is fully loaded
window.addEventListener("load", () => {
  // Force show all items again after everything is loaded
  const portfolioItems = document.querySelectorAll(".portfolio-item")
  portfolioItems.forEach((item) => {
    item.style.display = "block"
    item.style.visibility = "visible"
    item.style.opacity = "1"
  })

  console.log("Window fully loaded, forced portfolio items visible")
})
