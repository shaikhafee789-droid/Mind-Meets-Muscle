const STORAGE_KEY = "problem-crackers-state-v1";

const seedState = {
  authenticated: false,
  user: { name: "Arjun Mehta", email: "arjun@example.com", role: "Idea Owner", avatar: "" },
  ideas: [
    { id: 1, title: "Smart Local Market Platform", category: "Business Automation", description: "A unified ordering and inventory system for neighborhood retailers.", skills: ["React", "Python", "Database"], owner: "Arjun Mehta", status: "Looking for Team", score: 92, budget: "₹180,000", created: "2h ago" },
    { id: 2, title: "AI Crop Health Assistant", category: "Agriculture", description: "Detect crop diseases early using mobile photos and regional weather context.", skills: ["AI", "Flutter", "Python"], owner: "Neha Rao", status: "Looking for Team", score: 88, budget: "₹250,000", created: "5h ago" },
    { id: 3, title: "Clinic Appointment Queue", category: "Healthcare", description: "A live queue and teleconsultation workflow for small clinics.", skills: ["React", "Node.js", "UI/UX"], owner: "Vikram Shah", status: "Development", score: 84, budget: "₹140,000", created: "1d ago" }
  ],
  skills: [
    { id: 1, name: "Aisha Khan", headline: "Full-stack developer", skills: ["React", "Node.js", "PostgreSQL"], level: "Advanced", score: 94, location: "Mumbai" },
    { id: 2, name: "Rohan Das", headline: "Flutter & AI developer", skills: ["Flutter", "Python", "TensorFlow"], level: "Professional", score: 91, location: "Bengaluru" },
    { id: 3, name: "Meera Patel", headline: "Product UI/UX designer", skills: ["UI/UX", "Figma", "Design Systems"], level: "Advanced", score: 87, location: "Pune" }
  ],
  businesses: [
    { id: 1, name: "Orbit Retail Group", category: "Shopping Malls", description: "Modernizing store operations, loyalty, and inventory across 14 locations.", solutions: ["Inventory", "Customer Management", "Billing"], location: "Ahmedabad", score: 89 },
    { id: 2, name: "FreshPlate Kitchens", category: "Restaurants", description: "Order management and delivery analytics for a growing restaurant chain.", solutions: ["Mobile App", "Online Ordering", "Automation"], location: "Delhi", score: 86 },
    { id: 3, name: "GreenAxis Industries", category: "Manufacturing", description: "Custom dashboards for production planning and equipment maintenance.", solutions: ["Business Automation", "AI Integration", "Custom Software"], location: "Coimbatore", score: 82 }
  ],
  collaborations: [
    { id: 1, title: "Smart Local Market Platform", status: "Development in Progress", members: ["Arjun Mehta", "Aisha Khan"], progress: 58 },
    { id: 2, title: "Clinic Appointment Queue", status: "Collaboration Started", members: ["Vikram Shah", "Rohan Das"], progress: 30 }
  ],
  saved: [],
  notifications: [
    { id: 1, text: "Aisha Khan expressed interest in your idea", time: "12 min ago", unread: true },
    { id: 2, text: "Orbit Retail Group posted a new requirement", time: "1h ago", unread: true },
    { id: 3, text: "Your collaboration update was saved", time: "Yesterday", unread: false }
  ],
  messages: [
    { id: 1, name: "Aisha Khan", text: "I’ve reviewed the idea. Let’s discuss the architecture.", mine: false, time: "10:32" },
    { id: 2, name: "You", text: "Great, I’m available at 3 PM today.", mine: true, time: "10:35" }
  ]
};

let state = loadState();
let currentRoute = "dashboard";

function loadState() {
  try { return { ...seedState, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }; }
  catch { return JSON.parse(JSON.stringify(seedState)); }
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function icon(name, size) {
  return `<i data-lucide="${name}"${size ? ` style="width:${size}px;height:${size}px"` : ""}></i>`;
}

function avatar(name, size = 38) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return `<span class="mini-avatar" style="width:${size}px;height:${size}px">${initials}</span>`;
}

function esc(value = "") {
  return String(value).replace(/[&<>'"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[c]));
}

function refreshIcons() { if (window.lucide) window.lucide.createIcons(); }

function toast(message, type = "success") {
  const root = document.getElementById("toast-root");
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `${icon(type === "error" ? "circle-alert" : "circle-check")}<span>${esc(message)}</span>`;
  root.appendChild(el);
  refreshIcons();
  setTimeout(() => el.remove(), 3500);
}

function render() {
  const app = document.getElementById("app");
  if (!state.authenticated) app.innerHTML = renderAuth();
  else app.innerHTML = renderAppShell();
  refreshIcons();
  bindCommonEvents();
}

function renderAuth() {
  return `<main class="auth-shell">
    <section class="auth-story">
      <a class="brand" href="#dashboard"><span class="brand-mark">${icon("lightbulb")}</span><span class="brand-name">PROBLEM CRACKERS</span></a>
      <div class="auth-content">
        <span class="eyebrow">Built for collaboration</span>
        <h1>Turn Your Ideas <span>Into Reality.</span></h1>
        <p>Connect ideas, skills, and businesses to build something extraordinary.</p>
        <div class="auth-proof">
          <div class="avatar-stack"><span class="mini-avatar">AK</span><span class="mini-avatar">RD</span><span class="mini-avatar">MP</span></div>
          <div><strong>12,400+ builders</strong><span>already solving real problems</span></div>
        </div>
      </div>
    </section>
    <section class="auth-panel">
      <div class="auth-card">
        <h2>Welcome back</h2>
        <p class="lead">Sign in to continue to your workspace.</p>
        <div class="auth-tabs"><button class="auth-tab active" data-auth-tab="email">Email</button><button class="auth-tab" data-auth-tab="mobile">Mobile OTP</button></div>
        <form id="auth-form" data-mode="email">
          <div id="auth-fields">
            ${emailAuthFields()}
          </div>
          <button class="primary-btn full" type="submit" id="auth-submit">Login to workspace ${icon("arrow-right")}</button>
        </form>
        <p class="auth-switch">New to Problem Crackers? <button class="text-link" id="register-btn">Create account</button></p>
        <div class="demo-note">Demo environment: data is stored locally until Supabase credentials are configured.</div>
      </div>
    </section>
  </main>`;
}

function emailAuthFields() {
  return `<div class="field"><label>Email address</label><div class="input-wrap">${icon("mail")}<input id="email" type="email" required placeholder="you@company.com"></div></div>
  <div class="field"><label>Password</label><div class="input-wrap">${icon("lock-keyhole")}<input id="password" type="password" required minlength="6" placeholder="Enter your password"></div></div>
  <div class="auth-options"><label class="check"><input type="checkbox" checked> Remember me</label><button type="button" class="text-link" id="forgot-btn">Forgot password?</button></div>`;
}

function mobileAuthFields() {
  return `<div class="field"><label>Mobile number</label><div class="phone-row"><select aria-label="Country code"><option>+91</option><option>+1</option><option>+44</option><option>+971</option></select><input id="mobile" type="tel" required placeholder="98765 43210"></div></div>
  <div class="field"><label>Verification code</label><div class="input-wrap">${icon("shield-check")}<input id="otp" type="text" maxlength="6" placeholder="Enter 6-digit OTP"></div></div>`;
}

function renderAppShell() {
  return `<div class="app-shell">
    ${renderTopbar()}
    <main class="page" id="page-root">${renderRoute()}</main>
  </div>`;
}

function renderTopbar() {
  return `<header class="topbar">
    <a class="brand" href="#dashboard"><span class="brand-mark">${icon("lightbulb")}</span><span class="brand-name">PROBLEM CRACKERS</span></a>
    <div class="search-box">${icon("search")}<input id="global-search" placeholder="Search ideas, skills, developers, or businesses..." value=""></div>
    <div class="top-actions">
      <button class="icon-btn notification-dot" data-route="notifications" aria-label="Notifications">${icon("bell")}</button>
      <button class="icon-btn" data-route="messages" aria-label="Messages">${icon("message-circle")}</button>
      <button class="profile-trigger" id="profile-trigger"><span class="profile-avatar mini-avatar">${state.user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}</span><span class="profile-name">${esc(state.user.name)}</span>${icon("chevron-down")}</button>
    </div>
  </header>`;
}

function renderProfileMenu() {
  return `<div class="profile-menu" id="profile-menu">
    <button data-route="profile">${icon("user-round")}My Profile</button>
    <button data-route="ideas">${icon("lightbulb")}My Ideas</button>
    <button data-route="skills">${icon("badge-check")}My Skills</button>
    <button data-route="businesses">${icon("building-2")}My Business</button>
    <button data-route="collaborations">${icon("users")}My Collaborations</button>
    <button data-route="settings">${icon("settings")}Settings</button>
    <button id="logout-btn">${icon("log-out")}Logout</button>
  </div>`;
}

function renderRoute() {
  const routes = { dashboard: renderDashboard, ideas: renderIdeas, skills: renderSkills, businesses: renderBusinesses, collaborations: renderCollaborations, messages: renderMessages, notifications: renderNotifications, profile: renderProfile, settings: renderSettings, admin: renderAdmin };
  return (routes[currentRoute] || renderDashboard)();
}

function renderDashboard() {
  return `<div>
    <div class="page-head"><div><h1>Good morning, ${esc(state.user.name.split(" ")[0])}</h1><p>Here’s what’s happening across Problem Crackers.</p></div></div>
    <section class="hero-grid">
      <article class="action-card idea"><div class="card-kicker"><span>${icon("lightbulb")}</span>Idea owner</div><h2>Introduce Your Idea</h2><p>Have an idea but don't know how to develop it? Find the right people to make it happen.</p><button class="primary-btn" data-modal="idea">${icon("plus")}Share Your Idea</button></article>
      <article class="action-card skills"><div class="card-kicker"><span>${icon("code-2")}</span>Skilled person</div><h2>Showcase Your Skills</h2><p>Have skills but don't have an idea? Connect with innovative people and develop something together.</p><button class="secondary-btn" data-modal="skill">${icon("plus")}Add Your Skills</button></article>
      <article class="business-card"><div><div class="card-kicker"><span>${icon("building-2")}</span>Business owner</div><h2>Develop Your Business</h2><p>Own a shop, mall, industry, company, or business? Connect with talented developers to transform it digitally.</p><button class="primary-btn" data-modal="business">${icon("building")}Register Your Business</button></div><div class="business-stats"><div class="business-stat"><strong>${state.businesses.length}</strong><span>Opportunities</span></div><div class="business-stat"><strong>86%</strong><span>Avg. match</span></div></div></article>
    </section>
    <section class="section-block"><div class="section-title"><h2>Recommended for you</h2><button data-route="ideas">Explore all ${icon("arrow-right")}</button></div><div class="card-grid">${state.ideas.slice(0,3).map(ideaCard).join("")}</div></section>
  </div>`;
}

function ideaCard(item) {
  return `<article class="item-card"><div class="item-card-head"><span class="category-chip">${esc(item.category)}</span><button class="icon-btn save-btn" data-save="idea-${item.id}" aria-label="Save idea">${icon(state.saved.includes(`idea-${item.id}`) ? "bookmark-check" : "bookmark")}</button></div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><div class="tag-row">${item.skills.map(s=>`<span class="tag">${esc(s)}</span>`).join("")}</div><div class="card-footer"><div class="person">${avatar(item.owner,32)}<span>${esc(item.owner)}<br>${esc(item.created || "Recently")}</span></div><div class="score-ring" style="--score:${item.score}%"><span>${item.score}%</span></div></div></article>`;
}

function skillCard(item) {
  return `<article class="item-card"><div class="item-card-head"><span class="status-chip blue">${esc(item.level)}</span><button class="icon-btn save-btn" data-save="skill-${item.id}" aria-label="Save developer">${icon(state.saved.includes(`skill-${item.id}`) ? "bookmark-check" : "bookmark")}</button></div><div class="person" style="margin-top:14px">${avatar(item.name,44)}<div><h3 style="margin:0">${esc(item.name)}</h3><span>${esc(item.headline)}</span></div></div><p style="margin-top:14px">${esc(item.location)} • Available for collaboration</p><div class="tag-row">${item.skills.map(s=>`<span class="tag">${esc(s)}</span>`).join("")}</div><div class="card-footer"><button class="secondary-btn" data-contact="${esc(item.name)}">Message</button><div class="score-ring" style="--score:${item.score}%"><span>${item.score}%</span></div></div></article>`;
}

function businessCard(item) {
  return `<article class="item-card"><div class="item-card-head"><span class="category-chip">${esc(item.category)}</span><button class="icon-btn save-btn" data-save="business-${item.id}" aria-label="Save business">${icon(state.saved.includes(`business-${item.id}`) ? "bookmark-check" : "bookmark")}</button></div><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p><div class="tag-row">${item.solutions.map(s=>`<span class="tag">${esc(s)}</span>`).join("")}</div><div class="card-footer"><div class="person">${icon("map-pin")}<span>${esc(item.location)}</span></div><div class="score-ring" style="--score:${item.score}%"><span>${item.score}%</span></div></div></article>`;
}

function renderIdeas() {
  return pageHeader("Explore Ideas", "Discover opportunities to build, contribute, or collaborate.", `<button class="primary-btn" data-modal="idea">${icon("plus")}Share idea</button>`) + `<div class="filter-bar"><input id="idea-search" placeholder="Search ideas or skills"><select id="category-filter"><option value="">All categories</option>${["Web Development","Mobile Applications","Artificial Intelligence","FinTech","Healthcare","Agriculture","Business Automation"].map(v=>`<option>${v}</option>`).join("")}</select><select><option>Any budget</option><option>Under ₹100k</option><option>₹100k–₹300k</option></select></div><div class="card-grid" id="idea-results">${state.ideas.map(ideaCard).join("")}</div>`;
}

function renderSkills() {
  return pageHeader("Find Developers", "Search skilled people and build your next team.", `<button class="primary-btn" data-modal="skill">${icon("plus")}Add skills</button>`) + `<div class="filter-bar"><input id="skill-search" placeholder="Search skills or developers"><select id="level-filter"><option value="">All experience levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Professional</option></select><select><option>All locations</option><option>Mumbai</option><option>Bengaluru</option><option>Pune</option></select></div><div class="card-grid" id="skill-results">${state.skills.map(skillCard).join("")}</div>`;
}

function renderBusinesses() {
  return pageHeader("Explore Businesses", "Discover real digital transformation opportunities.", `<button class="primary-btn" data-modal="business">${icon("building")}Register business</button>`) + `<div class="filter-bar"><input id="business-search" placeholder="Search businesses or solutions"><select><option>All categories</option><option>Retail Shops</option><option>Shopping Malls</option><option>Manufacturing</option><option>Restaurants</option></select><select><option>All locations</option><option>Mumbai</option><option>Ahmedabad</option><option>Delhi</option></select></div><div class="card-grid" id="business-results">${state.businesses.map(businessCard).join("")}</div>`;
}

function pageHeader(title, subtitle, action) {
  return `<div class="page-head"><div><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div>${action || ""}</div>`;
}

function renderCollaborations() {
  return pageHeader("My Collaborations", "Track projects and team progress.", `<button class="primary-btn" data-modal="project">${icon("plus")}Create project</button>`) + `<div class="card-grid">${state.collaborations.map(c=>`<article class="item-card"><div class="item-card-head"><span class="status-chip green">${esc(c.status)}</span><button class="icon-btn">${icon("ellipsis")}</button></div><h3>${esc(c.title)}</h3><p>${c.members.map(m=>esc(m)).join(" + ")}</p><div style="height:7px;border-radius:999px;background:#edf1f4"><div style="width:${c.progress}%;height:100%;border-radius:999px;background:var(--orange)"></div></div><div class="card-footer"><span style="font-size:12px;color:var(--muted)">${c.progress}% complete</span><button class="secondary-btn" data-route="messages">Open</button></div></article>`).join("")}</div>`;
}

function renderMessages() {
  return `<div class="page-head"><div><h1>Messages</h1><p>Discuss projects and next steps with collaborators.</p></div></div><div class="chat-layout"><aside class="chat-list"><button class="chat-item active"><span class="mini-avatar">AK</span><div><strong>Aisha Khan</strong><span>I’ve reviewed the idea...</span></div></button><button class="chat-item">${avatar("Orbit Retail",38)}<div><strong>Orbit Retail Group</strong><span>When can we schedule a call?</span></div></button><button class="chat-item">${avatar("Rohan Das",38)}<div><strong>Rohan Das</strong><span>Shared project notes</span></div></button></aside><section class="chat-main"><div class="chat-header">${avatar("Aisha Khan",36)}<strong style="margin-left:10px">Aisha Khan</strong></div><div class="messages">${state.messages.map(m=>`<div class="message ${m.mine?"mine":""}"><div class="message-bubble">${esc(m.text)}</div><div class="message-meta">${esc(m.time)}${m.mine?" • Sent":""}</div></div>`).join("")}</div><form class="message-input" id="message-form"><button type="button" class="icon-btn" aria-label="Attach file">${icon("paperclip")}</button><input id="message-input" placeholder="Write a message" required><button class="primary-btn" type="submit">${icon("send")}</button></form></section></div>`;
}

function renderNotifications() {
  const unread = state.notifications.filter(n=>n.unread).length;
  return pageHeader("Notifications", `${unread} unread updates.`, `<button class="secondary-btn" id="mark-read">Mark all read</button>`) + `<div class="item-card">${state.notifications.map(n=>`<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--line)"><span class="mini-avatar">${n.unread?icon("bell"):""}</span><div style="flex:1"><strong style="color:var(--navy)">${esc(n.text)}</strong><div style="color:var(--muted);font-size:12px;margin-top:3px">${esc(n.time)}</div></div>${n.unread?'<span class="status-chip blue">New</span>':''}</div>`).join("")}</div>`;
}

function renderProfile() {
  return `<div class="page-head"><div><h1>My Profile</h1><p>Manage your public information and roles.</p></div><button class="secondary-btn" id="edit-profile">${icon("pencil")}Edit profile</button></div><div class="profile-layout"><aside class="profile-side"><span class="profile-avatar mini-avatar">${state.user.name.split(" ").map(n=>n[0]).join("")}</span><h2>${esc(state.user.name)}</h2><p>${esc(state.user.role)}</p><button class="secondary-btn full" data-modal="skill">Manage skills</button></aside><section class="profile-main"><h3>About</h3><p style="color:var(--muted)">Building practical digital products and connecting with people who solve meaningful problems.</p><h3 style="margin-top:28px">Roles</h3><div class="tag-row"><span class="tag">Idea Owner</span><span class="tag">Developer</span><span class="tag">Business Owner</span></div><h3 style="margin-top:28px">Recent activity</h3><div class="tag-row"><span class="tag">3 ideas shared</span><span class="tag">2 collaborations</span><span class="tag">4 saved items</span></div></section></div>`;
}

function renderSettings() {
  return pageHeader("Settings", "Control account, privacy, and notification preferences.") + `<div class="profile-layout" style="grid-template-columns:220px 1fr"><aside class="profile-side" style="text-align:left"><button class="ghost-btn full" style="justify-content:flex-start">Account</button><button class="ghost-btn full" style="justify-content:flex-start">Privacy</button><button class="ghost-btn full" style="justify-content:flex-start">Notifications</button></aside><section class="profile-main"><h3>Privacy settings</h3><label class="check" style="margin:16px 0"><input type="checkbox" checked> Show my profile in search results</label><label class="check" style="margin:16px 0"><input type="checkbox" checked> Allow collaboration requests</label><label class="check" style="margin:16px 0"><input type="checkbox"> Share my location with matches</label><button class="primary-btn" id="save-settings">Save changes</button></section></div>`;
}

function renderAdmin() { return pageHeader("Admin Dashboard", "Platform operations and moderation.") + `<div class="card-grid"><div class="item-card"><span class="category-chip">Users</span><h3>1,284</h3><p>Registered accounts</p></div><div class="item-card"><span class="category-chip">Ideas</span><h3>${state.ideas.length}</h3><p>Published opportunities</p></div><div class="item-card"><span class="category-chip">Reports</span><h3>3</h3><p>Awaiting review</p></div></div>`; }

function openModal(type) {
  const configs = {
    idea: { title: "Share Your Idea", body: ideaForm(), submit: "Publish Idea", action: "idea" },
    skill: { title: "Add Your Skills", body: skillForm(), submit: "Save Profile", action: "skill" },
    business: { title: "Register Your Business", body: businessForm(), submit: "Submit Business", action: "business" },
    project: { title: "Create a Project", body: projectForm(), submit: "Create Project", action: "project" }
  };
  const c = configs[type];
  document.getElementById("modal-root").innerHTML = `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>${c.title}</h2><button class="icon-btn" id="close-modal" aria-label="Close">${icon("x")}</button></div><div class="modal-body"><form id="submission-form" data-action="${c.action}">${c.body}<div class="modal-actions"><button type="button" class="secondary-btn" id="cancel-modal">Cancel</button><button type="submit" class="primary-btn">${c.submit}</button></div></form></div></div></div>`;
  refreshIcons();
}

function ideaForm() { return `<div class="form-grid"><div class="field span-2"><label>Idea title</label><input name="title" required placeholder="A clear name for your idea"></div><div class="field span-2"><label>Detailed description</label><textarea name="description" required placeholder="What are you building and why?"></textarea></div><div class="field"><label>Problem you want to solve</label><input name="problem" required></div><div class="field"><label>Proposed solution</label><input name="solution" required></div><div class="field span-2"><label>Required skills</label><input name="skills" placeholder="React, Python, UI/UX"></div><div class="field"><label>Project category</label><select name="category"><option>Web Development</option><option>Mobile Applications</option><option>Artificial Intelligence</option><option>FinTech</option><option>Healthcare</option><option>Education</option><option>Agriculture</option><option>Business Automation</option><option>Other</option></select></div><div class="field"><label>Collaboration preference</label><select name="preference"><option>Open Team</option><option>Co-founder</option><option>Freelance Team</option><option>Remote Only</option></select></div><div class="field"><label>Budget (optional)</label><input name="budget" placeholder="₹0 or range"></div><div class="field"><label>Timeline (optional)</label><input name="timeline" placeholder="Example: 3 months"></div><div class="field span-2"><label>Expected outcome</label><textarea name="outcome" placeholder="What success looks like?"></textarea></div></div>`; }

function skillForm() { return `<div class="form-grid"><div class="field"><label>Full name</label><input name="name" required value="${esc(state.user.name)}"></div><div class="field"><label>Professional headline</label><input name="headline" required placeholder="Full-stack developer"></div><div class="field span-2"><label>Technical skills</label><input name="skills" required placeholder="React, Python, PostgreSQL"></div><div class="field"><label>Programming languages</label><input name="languages" placeholder="JavaScript, Python"></div><div class="field"><label>Frameworks</label><input name="frameworks" placeholder="React, FastAPI"></div><div class="field"><label>Tools & technologies</label><input name="tools" placeholder="Git, Docker, Figma"></div><div class="field"><label>Experience level</label><select name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Professional</option></select></div><div class="field"><label>Portfolio URL</label><input name="portfolio" type="url" placeholder="https://"></div><div class="field"><label>GitHub URL</label><input name="github" type="url" placeholder="https://github.com/"></div><div class="field"><label>LinkedIn URL</label><input name="linkedin" type="url" placeholder="https://linkedin.com/"></div><div class="field span-2"><label>Short introduction</label><textarea name="intro" placeholder="Describe your experience and interests"></textarea></div></div>`; }

function businessForm() { return `<div class="form-grid"><div class="field"><label>Business name</label><input name="name" required></div><div class="field"><label>Business category</label><select name="category"><option>Retail Shops</option><option>Shopping Malls</option><option>Industries</option><option>Manufacturing</option><option>Restaurants</option><option>Hotels</option><option>Educational Institutions</option><option>Hospitals</option><option>Startups</option><option>Small Businesses</option><option>Large Enterprises</option><option>Other</option></select></div><div class="field span-2"><label>Business description</label><textarea name="description" required></textarea></div><div class="field"><label>Business owner name</label><input name="owner" required></div><div class="field"><label>Contact email</label><input name="email" type="email" required></div><div class="field"><label>Mobile number</label><input name="mobile" type="tel" required></div><div class="field"><label>Business location</label><input name="location" required></div><div class="field"><label>City</label><input name="city"></div><div class="field"><label>State</label><input name="state"></div><div class="field"><label>Country</label><input name="country"></div><div class="field"><label>Website URL (optional)</label><input name="website" type="url" placeholder="https://"></div><div class="field span-2"><label>Required digital solutions</label><input name="solutions" required placeholder="Website, Inventory Management, AI Integration"></div></div>`; }

function projectForm() { return `<div class="form-grid"><div class="field span-2"><label>Project name</label><input name="title" required></div><div class="field"><label>Status</label><select name="status"><option>Looking for Team</option><option>Collaboration Started</option><option>Development in Progress</option><option>Completed</option></select></div><div class="field"><label>Target progress</label><input name="progress" type="number" min="0" max="100" value="10"></div><div class="field span-2"><label>Team members</label><input name="members" placeholder="Aisha Khan, Rohan Das"></div></div>`; }

function closeModal() { document.getElementById("modal-root").innerHTML = ""; }

function navigate(route) {
  currentRoute = route;
  location.hash = route;
  document.querySelector(".profile-menu")?.remove();
  if (state.authenticated) {
    document.getElementById("page-root").innerHTML = renderRoute();
    refreshIcons();
  }
}

function bindCommonEvents() {
  document.querySelectorAll("[data-route]").forEach(el => el.addEventListener("click", e => { e.preventDefault(); navigate(el.dataset.route); }));
  document.querySelectorAll("[data-modal]").forEach(el => el.addEventListener("click", () => openModal(el.dataset.modal)));

  document.querySelectorAll("[data-auth-tab]").forEach(tab => tab.addEventListener("click", () => {
    document.querySelectorAll(".auth-tab").forEach(t=>t.classList.remove("active")); tab.classList.add("active");
    const mode = tab.dataset.authTab;
    document.getElementById("auth-fields").innerHTML = mode === "email" ? emailAuthFields() : mobileAuthFields();
    document.getElementById("auth-form").dataset.mode = mode;
    document.getElementById("auth-submit").innerHTML = mode === "email" ? `Login to workspace ${icon("arrow-right")}` : `Send verification code ${icon("arrow-right")}`;
    refreshIcons();
  }));

  const authForm = document.getElementById("auth-form");
  authForm?.addEventListener("submit", e => {
    e.preventDefault();
    const mode = authForm.dataset.mode;
    if (mode === "email") {
      const email = document.getElementById("email");
      if (!email.checkValidity() || document.getElementById("password").value.length < 6) { toast("Enter a valid email and 6-character password", "error"); return; }
      state.user.email = email.value;
    } else {
      const otp = document.getElementById("otp");
      if (!/^[0-9]{6}$/.test(otp.value)) { toast("Enter the 6-digit verification code", "error"); return; }
    }
    state.authenticated = true;
    saveState();
    toast("Welcome to Problem Crackers");
    render();
  });

  document.getElementById("register-btn")?.addEventListener("click", () => openRegisterModal());
  document.getElementById("forgot-btn")?.addEventListener("click", () => toast("Password recovery link ready for your email"));

  document.getElementById("profile-trigger")?.addEventListener("click", e => {
    e.stopPropagation();
    const existing = document.getElementById("profile-menu");
    if (existing) existing.remove(); else {
      e.currentTarget.insertAdjacentHTML("afterend", renderProfileMenu());
      refreshIcons();
      document.querySelectorAll("#profile-menu [data-route]").forEach(el => el.addEventListener("click",()=>navigate(el.dataset.route)));
      document.getElementById("logout-btn")?.addEventListener("click", () => { state.authenticated=false; saveState(); render(); toast("Logged out securely"); });
    }
  });

  document.getElementById("close-modal")?.addEventListener("click", closeModal);
  document.getElementById("cancel-modal")?.addEventListener("click", closeModal);
  document.querySelector(".modal-backdrop")?.addEventListener("click", e => { if (e.target.classList.contains("modal-backdrop")) closeModal(); });

  const submission = document.getElementById("submission-form");
  submission?.addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(submission).entries());
    const action = submission.dataset.action;
    if (action === "idea") state.ideas.unshift({ id: Date.now(), title:data.title, category:data.category, description:data.description, skills:data.skills ? data.skills.split(",").map(s=>s.trim()).filter(Boolean).slice(0,5) : ["Team needed"], owner:state.user.name, status:"Looking for Team", score:78, budget:data.budget, created:"Just now" });
    if (action === "skill") state.skills.unshift({ id:Date.now(), name:data.name, headline:data.headline, skills:data.skills.split(",").map(s=>s.trim()).filter(Boolean).slice(0,5), level:data.level, score:82, location:"Location not set" });
    if (action === "business") state.businesses.unshift({ id:Date.now(), name:data.name, category:data.category, description:data.description, solutions:data.solutions.split(",").map(s=>s.trim()).filter(Boolean).slice(0,5), location:data.location || "Location not set", score:80 });
    if (action === "project") state.collaborations.unshift({ id:Date.now(), title:data.title, status:data.status, members:data.members ? data.members.split(",").map(m=>m.trim()) : [state.user.name], progress:Number(data.progress)||10 });
    saveState(); closeModal(); navigate(action === "idea"?"ideas":action === "skill"?"skills":action === "business"?"businesses":"collaborations"); toast(action === "idea"?"Idea published":"Changes saved successfully");
  });

  document.querySelectorAll(".save-btn").forEach(btn => btn.addEventListener("click", () => { const key=btn.dataset.save; if(state.saved.includes(key)){state.saved=state.saved.filter(v=>v!==key);toast("Removed from saved items");}else{state.saved.push(key);toast("Saved to your collection");} saveState(); navigate(currentRoute); }));
  document.querySelectorAll("[data-contact]").forEach(btn=>btn.addEventListener("click",()=>{navigate("messages");toast(`Started a conversation with ${btn.dataset.contact}`);}));

  const globalSearch = document.getElementById("global-search");
  globalSearch?.addEventListener("keydown", e => { if (e.key === "Enter") { const query = e.currentTarget.value.trim().toLowerCase(); if (query) { navigate("ideas"); setTimeout(() => { const input=document.getElementById("idea-search"); if (input) { input.value=query; filterIdeas(query); } }, 0); } } });

  const ideaSearch=document.getElementById("idea-search"); ideaSearch?.addEventListener("input",e=>filterIdeas(e.target.value));
  const skillSearch=document.getElementById("skill-search"); skillSearch?.addEventListener("input",e=>{const q=e.target.value.toLower();document.getElementById("skill-results").innerHTML=state.skills.filter(s=>(`${s.name} ${s.headline} ${s.skills.join(" ")}`).toLower().includes(q)).map(skillCard).join("")||'<div class="empty-state">No developers found</div>';bindCommonEvents();});
  const businessSearch=document.getElementById("business-search"); businessSearch?.addEventListener("input",e=>{const q=e.target.value.toLower();document.getElementById("business-results").innerHTML=state.businesses.filter(b=>(`${b.name} ${b.category} ${b.description} ${b.solutions.join(" ")}`).toLower().includes(q)).map(businessCard).join("")||'<div class="empty-state">No businesses found</div>';bindCommonEvents();});

  document.getElementById("message-form")?.addEventListener("submit",e=>{e.preventDefault();const input=document.getElementById("message-input");if(!input.value.trim())return;state.messages.push({id:Date.now(),name:"You",text:input.value.trim(),mine:true,time:"Now"});saveState();navigate("messages");toast("Message sent");});
  document.getElementById("mark-read")?.addEventListener("click",()=>{state.notifications.forEach(n=>n.unread=false);saveState();navigate("notifications");toast("Notifications marked as read");});
  document.getElementById("save-settings")?.addEventListener("click",()=>toast("Settings saved"));
  document.getElementById("edit-profile")?.addEventListener("click",()=>openProfileEditor());

  document.addEventListener("click",()=>document.getElementById("profile-menu")?.remove(),{once:true});
}

function filterIdeas(query) {
  const q=query.toLower();
  const filtered=state.ideas.filter(i=>(`${i.title} ${i.category} ${i.description} ${i.skills.join(" ")}`).toLower().includes(q));
  const root=document.getElementById("idea-results"); if(root) root.innerHTML=filtered.map(ideaCard).join("")||'<div class="empty-state">No ideas found</div>';bindCommonEvents();
}

function openRegisterModal() {
  document.getElementById("modal-root").innerHTML=`<div class="modal-backdrop"><div class="modal small"><div class="modal-head"><h2>Create your account</h2><button class="icon-btn" id="close-modal">${icon("x")}</button></div><div class="modal-body"><form id="register-form"><div class="form-grid"><div class="field span-2"><label>Full name</label><input name="name" required></div><div class="field span-2"><label>Email address</label><input name="email" type="email" required></div><div class="field span-2"><label>Mobile number</label><input name="mobile" type="tel" required></div><div class="field"><label>Password</label><input name="password" type="password" minlength="6" required></div><div class="field"><label>Confirm password</label><input name="confirm" type="password" minlength="6" required></div></div><div class="modal-actions"><button type="button" class="secondary-btn" id="cancel-modal">Cancel</button><button type="submit" class="primary-btn">Create account</button></div></form></div></div></div>`;
  refreshIcons();
  document.getElementById("close-modal").onclick=closeModal; document.getElementById("cancel-modal").onclick=closeModal;
  document.getElementById("register-form").onsubmit=e=>{e.preventDefault();const d=new FormData(e.currentTarget);if(d.get("password")!==d.get("confirm")){toast("Passwords do not match","error");return;}state.user.name=d.get("name");state.user.email=d.get("email");state.authenticated=true;saveState();closeModal();render();toast("Account created successfully");};
}

function openProfileEditor() { openModal("skill"); }

window.addEventListener("hashchange",()=>{const hash=location.hash.replace("#","");if(hash) {currentRoute=hash;if(state.authenticated)render();}});

render();
