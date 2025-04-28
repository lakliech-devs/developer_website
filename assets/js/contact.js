document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 1000 })
  } else {
    console.warn("AOS is not initialized. Make sure AOS library is included.")
  }

  console.log("EmailJS initialized")

  // Contact form submission
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.textContent
      submitButton.disabled = true
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...'

      // Get form data
      const name = contactForm.querySelector("#name").value.trim()
      const email = contactForm.querySelector("#email").value.trim()
      const subject = contactForm.querySelector("#subject").value.trim() || "Website Inquiry"
      const budget = contactForm.querySelector("#budget").value.trim() || "Not specified"
      const message = contactForm.querySelector("#message").value.trim()

      // Validate form
      if (!name || !email || !message) {
        showAlert("Please fill in all required fields (Name, Email, and Message).", "danger")
        submitButton.disabled = false
        submitButton.textContent = originalButtonText
        return
      }

      // Prepare email parameters
      const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        budget: budget,
        message: message,
        timestamp: new Date().toISOString(),
      }

      // Send email using EmailJS
      if (typeof emailjs !== "undefined") {
        emailjs
          .send("service_seowwan", "template_aazujdb", templateParams)
          .then((response) => {
            console.log("SUCCESS!", response.status, response.text)
            showAlert("Thank you! Your message has been sent successfully.", "success")
            contactForm.reset()
          })
          .catch((error) => {
            console.error("FAILED...", error)
            showAlert("Failed to send message: " + (error.text || "Unknown error"), "danger")
          })
          .finally(() => {
            // Re-enable button
            submitButton.disabled = false
            submitButton.textContent = originalButtonText
          })
      } else {
        console.error("EmailJS is not initialized. Make sure EmailJS library is included.")
        showAlert("Email service is not available. Please try again later.", "danger")
        submitButton.disabled = false
        submitButton.textContent = originalButtonText
      }
    })
  }

  // FAQ accordion functionality
  const accordionItems = document.querySelectorAll(".accordion-item")
  if (accordionItems.length > 0) {
    // If Bootstrap is not available, implement simple accordion
    if (typeof bootstrap === "undefined") {
      accordionItems.forEach((item) => {
        const header = item.querySelector(".accordion-button")
        const content = item.querySelector(".accordion-collapse")

        header.addEventListener("click", () => {
          const isExpanded = header.getAttribute("aria-expanded") === "true"

          // Close all accordions
          accordionItems.forEach((otherItem) => {
            const otherHeader = otherItem.querySelector(".accordion-button")
            const otherContent = otherItem.querySelector(".accordion-collapse")

            otherHeader.setAttribute("aria-expanded", "false")
            otherHeader.classList.add("collapsed")
            otherContent.classList.remove("show")
          })

          // Open current accordion if it was closed
          if (!isExpanded) {
            header.setAttribute("aria-expanded", "true")
            header.classList.remove("collapsed")
            content.classList.add("show")
          }
        })
      })
    }
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
})
