document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    })
  }

  // Get post ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const postId = urlParams.get("id")

  // If we have a post ID, we would typically fetch the post data from a backend
  // For this static example, we'll just use the default content

  // Comment form submission
  const commentForm = document.getElementById("commentForm")

  if (commentForm) {
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("commentName").value
      const email = document.getElementById("commentEmail").value
      const content = document.getElementById("commentContent").value

      // Create new comment element
      const commentsList = document.querySelector(".comments-list")
      const newComment = document.createElement("div")
      newComment.className = "comment new-comment"

      newComment.innerHTML = `
                <div class="comment-avatar">
                    <img src="assets/img/avatars/default-avatar.jpg" alt="${name}">
                </div>
                <div class="comment-content">
                    <div class="comment-info">
                        <h5>${name}</h5>
                        <span>Just now</span>
                    </div>
                    <p>${content}</p>
                    <button class="reply-btn">Reply</button>
                </div>
            `

      // Add new comment to the top of the list
      commentsList.insertBefore(newComment, commentsList.firstChild)

      // Reset form
      commentForm.reset()

      // Update comment count
      const commentCount = document.querySelector(".comments-section h3")
      const currentCount = Number.parseInt(commentCount.textContent.match(/\d+/)[0])
      commentCount.textContent = `Comments (${currentCount + 1})`

      // Show success message
      alert("Your comment has been posted successfully!")
    })
  }

  // Reply button functionality
  document.querySelectorAll(".reply-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const commentForm = document.getElementById("commentForm")
      const commentContent = document.getElementById("commentContent")

      // Get the comment author name
      const authorName = this.closest(".comment-content").querySelector("h5").textContent

      // Focus on comment form and add @mention
      commentContent.focus()
      commentContent.value = `@${authorName} `

      // Scroll to comment form
      commentForm.scrollIntoView({ behavior: "smooth" })
    })
  })

  // Social sharing functionality
  window.shareOnTwitter = () => {
    const title = document.getElementById("postTitle").textContent
    const url = window.location.href
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }

  window.shareOnFacebook = () => {
    const url = window.location.href
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
  }

  window.shareOnLinkedIn = () => {
    const title = document.getElementById("postTitle").textContent
    const url = window.location.href
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      "_blank",
    )
  }

  window.copyLink = () => {
    const url = window.location.href
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("Link copied to clipboard!")
      })
      .catch((err) => {
        console.error("Could not copy text: ", err)
      })
  }

  // Code highlighting with Prism.js
  if (typeof Prism !== "undefined") {
    Prism.highlightAll()
  }

  // Handle dynamic content loading based on post ID
  if (postId) {
    // In a real implementation, you would fetch the post data from a backend
    // For this example, we'll just simulate it with a switch statement

    // This would be replaced with actual API calls in a real implementation
    switch (postId) {
      case "building-beautiful-animations":
        document.getElementById("postTitle").textContent = "Building Beautiful Animations in Flutter"
        document.getElementById("postCategory").textContent = "Flutter"
        document.getElementById("postDate").textContent = "April 10, 2025"
        document.getElementById("postImage").src = "assets/img/blog/post1.jpg"
        document.getElementById("postImage").alt = "Building Beautiful Animations in Flutter"
        // Update meta tags for SEO
        document.querySelector('meta[property="og:title"]').content = "Building Beautiful Animations in Flutter"
        document.querySelector('meta[property="og:image"]').content = "assets/img/blog/post1.jpg"
        break

      case "monetization-strategies":
        document.getElementById("postTitle").textContent = "Monetization Strategies for Mobile Apps in 2025"
        document.getElementById("postCategory").textContent = "Business"
        document.getElementById("postDate").textContent = "April 5, 2025"
        document.getElementById("postImage").src = "assets/img/blog/post2.jpg"
        document.getElementById("postImage").alt = "Monetization Strategies for Mobile Apps"
        // Update meta tags for SEO
        document.querySelector('meta[property="og:title"]').content = "Monetization Strategies for Mobile Apps in 2025"
        document.querySelector('meta[property="og:image"]').content = "assets/img/blog/post2.jpg"
        break

      // Add more cases for other blog posts

      default:
        // Default is the Flutter 3.0 post
        break
    }
  }
})
