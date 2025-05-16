function checkLogin() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.username) {
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
