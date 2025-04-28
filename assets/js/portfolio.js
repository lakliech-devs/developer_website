document.addEventListener("DOMContentLoaded", () => {
  // Portfolio filter functionality
  const filterButtons = document.querySelectorAll(".filter-btn")
  const portfolioItems = document.querySelectorAll(".portfolio-item")

  // Initialize isotope or simple filtering
  let isotopeGrid

  try {
    // Try to use Isotope if available
    isotopeGrid = new Isotope(".portfolio-grid", {
      itemSelector: ".portfolio-item",
      layoutMode: "fitRows",
    })
  } catch (error) {
    console.log("Isotope not available, using simple filtering")
    // Simple filtering fallback
    isotopeGrid = null
  }

  // Filter button click handler
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Get filter value
      const filterValue = button.getAttribute("data-filter")

      if (isotopeGrid) {
        // Use Isotope if available
        isotopeGrid.arrange({
          filter: filterValue === "all" ? "*" : `[data-category="${filterValue}"]`,
        })
      } else {
        // Simple filtering fallback
        portfolioItems.forEach((item) => {
          if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
            item.style.display = "block"
          } else {
            item.style.display = "none"
          }
        })
      }
    })
  })

  // Initialize modals if Bootstrap is available
  if (typeof bootstrap !== "undefined") {
    const modals = document.querySelectorAll(".modal")
    modals.forEach((modal) => {
      new bootstrap.Modal(modal)
    })
  }

  // Add animation to portfolio items
  portfolioItems.forEach((item, index) => {
    item.setAttribute("data-aos", "fade-up")
    item.setAttribute("data-aos-delay", (index * 100).toString())
  })
})
