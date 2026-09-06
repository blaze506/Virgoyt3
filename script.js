// ================================
// VIRGOYT COMMUNITY JAVASCRIPT
// ================================

// Get saved members and posts
let members = JSON.parse(localStorage.getItem("virgoytMembers")) || [];
let posts = JSON.parse(localStorage.getItem("virgoytPosts")) || [];


// ================================
// JOIN COMMUNITY
// ================================

function openJoinModal() {
  const modal = document.getElementById("joinModal");

  if (modal) {
    modal.classList.add("active");
  }
}


function closeJoinModal() {
  const modal = document.getElementById("joinModal");

  if (modal) {
    modal.classList.remove("active");
  }
}


function joinCommunity() {
  const input = document.getElementById("memberName");
  const message = document.getElementById("joinMessage");

  if (!input || !message) return;

  const name = input.value.trim();

  if (name.length < 2) {
    message.textContent = "Please enter your name.";
    return;
  }

  const member = {
    id: Date.now(),
    name: name,
    joinedAt: new Date().toLocaleString()
  };

  members.push(member);

  localStorage.setItem(
    "virgoytMembers",
    JSON.stringify(members)
  );

  message.textContent =
    `Welcome to the community, ${name}! 🔥`;

  input.value = "";

  setTimeout(() => {
    closeJoinModal();
    message.textContent = "";
  }, 1800);
}


// ================================
// CREATE COMMUNITY POST
// ================================

function createPost() {
  const input = document.getElementById("postInput");

  if (!input) return;

  const text = input.value.trim();

  if (!text) {
    alert("Write something before posting.");
    return;
  }


  // Get current member
  const savedName = members.length
    ? members[members.length - 1].name
    : "Community Member";


  const post = {
    id: Date.now(),
    name: savedName,
    text: text,
    time: new Date().toLocaleString()
  };


  posts.unshift(post);

  localStorage.setItem(
    "virgoytPosts",
    JSON.stringify(posts)
  );


  input.value = "";

  displayPosts();
}


// ================================
// DISPLAY POSTS
// ================================

function displayPosts() {
  const container = document.getElementById("posts");

  if (!container) return;

  container.innerHTML = "";


  if (posts.length === 0) {
    container.innerHTML = `
      <div class="post">
        <p class="post-text">
          No posts yet. Be the first person to post! 🔥
        </p>
      </div>
    `;

    return;
  }


  posts.forEach(post => {

    const article = document.createElement("article");

    article.className = "post";


    article.innerHTML = `
      <div class="post-header">

        <span class="post-name">
          ${escapeHTML(post.name)}
        </span>

        <span class="post-time">
          ${escapeHTML(post.time)}
        </span>

      </div>

      <p class="post-text">
        ${escapeHTML(post.text)}
      </p>
    `;


    container.appendChild(article);
  });
}


// ================================
// PROTECT COMMUNITY POSTS
// ================================

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


// ================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ================================

window.addEventListener("click", function(event) {

  const modal = document.getElementById("joinModal");

  if (event.target === modal) {
    closeJoinModal();
  }

});


// ================================
// ENTER KEY SUPPORT
// ================================

document.addEventListener("keydown", function(event) {

  if (event.key === "Escape") {
    closeJoinModal();
  }

});


// ================================
// LOAD POSTS
// ================================

document.addEventListener("DOMContentLoaded", function() {
  displayPosts();
});
