console.log("VIRGOYT SCRIPT IS WORKING");
// ================================
// VIRGOYT COMMUNITY JAVASCRIPT
// ================================

// ================================
// SUPABASE CONNECTION
// ================================

const SUPABASE_URL = "https://odjlkbhujmxlgqmexcqp.supabase.co";

// Replace this with your Supabase PUBLISHABLE KEY
const SUPABASE_KEY = "sb_publishable_G4kDzdFO8QfrOKgIPiyxQA__gz0AOzm";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ================================
// LOCAL COMMUNITY MEMBERS
// ================================

let members =
  JSON.parse(localStorage.getItem("virgoytMembers")) || [];


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

async function createPost() {

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


  // Show temporary status
  const button = document.querySelector(
    '[onclick="createPost()"]'
  );

  if (button) {
    button.disabled = true;
    button.textContent = "Posting...";
  }


  // Save post to Supabase
  const { data, error } = await supabaseClient
    .from("post")
    .insert([
      {
        name: savedName,
        text: text
      }
    ])
    .select();


  if (error) {

    console.error("Supabase error:", error);

    alert(
      "Your post could not be published. Please check your connection and Supabase settings."
    );

    if (button) {
      button.disabled = false;
      button.textContent = "Post";
    }

    return;
  }


  input.value = "";

  if (button) {
    button.disabled = false;
    button.textContent = "Post";
  }


  // Reload posts
  await displayPosts();
}


// ================================
// DISPLAY POSTS FROM SUPABASE
// ================================

async function displayPosts() {

  const container = document.getElementById("posts");

  if (!container) return;


  container.innerHTML = `
    <div class="post">
      <p class="post-text">Loading community posts... 🔥</p>
    </div>
  `;


  const { data, error } = await supabaseClient
    .from("post")
    .select("*")
    .order("created_at", { ascending: false });


  if (error) {

    console.error("Could not load posts:", error);

    container.innerHTML = `
      <div class="post">
        <p class="post-text">
          Unable to load posts right now.
        </p>
      </div>
    `;

    return;
  }


  if (!data || data.length === 0) {

    container.innerHTML = `
      <div class="post">
        <p class="post-text">
          No posts yet. Be the first person to post! 🔥
        </p>
      </div>
    `;

    return;
  }


  data.forEach(post => {

    const article = document.createElement("article");

    article.className = "post";


    const postName =
      post.name || "Community Member";

    const postText =
      post.text || "";

    const postTime =
      post.created_at
        ? new Date(post.created_at).toLocaleString()
        : "";


    article.innerHTML = `
      <div class="post-header">

        <span class="post-name">
          ${escapeHTML(postName)}
        </span>

        <span class="post-time">
          ${escapeHTML(postTime)}
        </span>

      </div>

      <p class="post-text">
        ${escapeHTML(postText)}
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
