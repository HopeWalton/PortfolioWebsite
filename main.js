//Skills flip cards
// const card = document.querySelector('.card');

// card.addEventListener('click', function() {
//   card.classList.toggle('flipped');
// });

//Projects scroll feature

// Select all scroller elements
const scrollers = document.querySelectorAll(".scroller");

let isDragging = false;
let startX;
let scrollLeft;

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addAnimation();
}

function addAnimation() {
  scrollers.forEach((scroller) => {
    scroller.setAttribute("data-animated", true);

    const scrollerInner = scroller.querySelector(".scroller__inner");

    // Clone the children for infinite scroll effect
    const scrollerContent = Array.from(scrollerInner.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}

// Function to handle drag events
scrollers.forEach((scroller) => {
  const scrollerInner = scroller.querySelector(".scroller__inner");

  function pauseAnimation() {
    scrollerInner.style.animationPlayState = "paused";
  }

  function resumeAnimation() {
    scrollerInner.style.animationPlayState = "running";
  }

  // Ensure infinite scroll behavior
  function checkInfiniteScroll() {
    const scrollWidth = scrollerInner.scrollWidth / 2; // Original content width
    if (scroller.scrollLeft >= scrollWidth) {
      scroller.scrollLeft = scroller.scrollLeft - scrollWidth;
    } else if (scroller.scrollLeft <= 0) {
      scroller.scrollLeft = scrollWidth + scroller.scrollLeft;
    }
  }

  // Mouse or touch press to start dragging
  scroller.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - scroller.offsetLeft;
    scrollLeft = scroller.scrollLeft;
    pauseAnimation();

    // Prevent default behavior for anchor links or images
    e.preventDefault();
  });

  scroller.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - scroller.offsetLeft;
    scrollLeft = scroller.scrollLeft;
    pauseAnimation();
  });

  // Dragging the content
  scroller.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scroller.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjust drag sensitivity
    scroller.scrollLeft = scrollLeft - walk;
    checkInfiniteScroll();
  });

  scroller.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scroller.offsetLeft;
    const walk = (x - startX) * 1.5;
    scroller.scrollLeft = scrollLeft - walk;
    checkInfiniteScroll();
  });

  // Stop dragging (global listener for mouse/touch release)
  const stopDragging = () => {
    if (isDragging) {
      isDragging = false;
      resumeAnimation();
    }
  };

  document.addEventListener("mouseup", stopDragging);
  document.addEventListener("touchend", stopDragging);
  document.addEventListener("mouseleave", stopDragging); // For cases where mouse leaves the screen

  // Detect scroll for infinite looping
  scroller.addEventListener("scroll", checkInfiniteScroll);

  // Prevent click behavior on links/images when dragging
  scroller.addEventListener("click", (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
});


// Contact Form //

document.getElementById('contactForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(el => el.style.display = 'none');

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  let isValid = true;

  if (name === '') {
      document.getElementById('nameError').textContent = "Name is required";
      document.getElementById('nameError').style.display = 'block';
      isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === '' || !emailPattern.test(email)) {
      document.getElementById('emailError').textContent = 'Valid email is required';
      document.getElementById('emailError').style.display = 'block';
      isValid = false;
  }

  if (subject === '') {
      document.getElementById('subjectError').textContent = "Subject is required";
      document.getElementById('subjectError').style.display = 'block';
      isValid = false;
  }

  if (message === '') {
      document.getElementById('messageError').textContent = "Message is required";
      document.getElementById('messageError').style.display = 'block';
      isValid = false;
  }

  if (isValid) {
      const formData = new FormData(event.target);

      try {
          const response = await fetch("/", {
              method: "POST",
              body: formData,
          });

          if (response.ok) {
              document.getElementById('contactForm').style.display = 'none';
              document.getElementById('thankYou').style.display = 'block';
          } else {
              alert("There was an issue submitting your message. Please try again.");
          }
      } catch (error) {
          console.error("Form submission failed:", error);
          alert("There was an issue submitting your message. Please try again.");
      }
  }
});

