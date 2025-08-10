const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginMsg = document.getElementById('loginMsg');

let token = localStorage.getItem('token');

function showAdmin() {
  loginSection.style.display = 'none';
  adminSection.style.display = 'block';
}

function showLogin() {
  loginSection.style.display = 'block';
  adminSection.style.display = 'none';
}

if (token) {
  showAdmin();
} else {
  showLogin();
}

loginBtn.addEventListener('click', async () => {
  loginMsg.textContent = 'Entrando...';
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  
  const data = await res.json();
  
  if (res.ok) {
    token = data.token;
    localStorage.setItem('token', token);
    loginMsg.textContent = '';
    showAdmin();
  } else {
    loginMsg.textContent = data.error || 'Usuário ou senha inválidos';
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  token = null;
  showLogin();
});
