// URL base da API (em Vercel /api/)
const apiBase = '/api';

// --- Front (lista pública) ---
async function fetchCriminals() {
  const res = await fetch(apiBase + '/criminals');
  if (!res.ok) return;
  const data = await res.json();
  const list = document.getElementById('criminalList');
  if (!list) return;
  list.innerHTML = '';
  data.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.name} — ${c.crime}`;
    list.appendChild(li);
  });
}
fetchCriminals();

// --- Admin ---
const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const loginBtn = document.getElementById('loginBtn');
const loginMsg = document.getElementById('loginMsg');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const logoutBtn = document.getElementById('logoutBtn');
const addCriminalForm = document.getElementById('addCriminalForm');
const adminCriminalList = document.getElementById('adminCriminalList');

let token = localStorage.getItem('token') || null;

function showAdmin() {
  loginSection.style.display = 'none';
  adminSection.style.display = 'block';
  loadAdminCriminals();
}

function showLogin() {
  loginSection.style.display = 'block';
  adminSection.style.display = 'none';
}

async function login() {
  loginMsg.textContent = 'Entrando...';
  const username = usernameInput.value;
  const password = passwordInput.value;

  const res = await fetch(apiBase + '/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
    token = data.token;
    localStorage.setItem('token', token);
    loginMsg.textContent = '';
    showAdmin();
  } else {
    loginMsg.textContent = data.error || 'Erro no login';
  }
}

loginBtn.addEventListener('click', login);

logoutBtn.addEventListener('click', () => {
  token = null;
  localStorage.removeItem('token');
  showLogin();
});

// Carregar criminosos no admin
async function loadAdminCriminals() {
  const res = await fetch(apiBase + '/criminals');
  if (!res.ok) return;
  const criminals = await res.json();
  adminCriminalList.innerHTML = '';
  criminals.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.name} — ${c.crime} `;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Excluir';
    delBtn.onclick = () => deleteCriminal(c.id);
    li.appendChild(delBtn);
    adminCriminalList.appendChild(li);
  });
}

// Adicionar criminoso
addCriminalForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value;
  const crime = document.getElementById('crimeInput').value;
  const details = document.getElementById('detailsInput').value;

  if (!token) return alert('Você precisa fazer login');

  const res = await fetch(apiBase + '/criminals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Aqui você pode adicionar autenticação se quiser, mas nossa API não verifica token no momento
    },
    body: JSON.stringify({ name, crime, details })
  });

  if (res.ok) {
    addCriminalForm.reset();
    loadAdminCriminals();
  } else {
    alert('Erro ao adicionar criminoso');
  }
});

// Excluir criminoso
async function deleteCriminal(id) {
  if (!confirm('Tem certeza que deseja excluir?')) return;
  const res = await fetch(apiBase + '/criminals?id=' + id, {
    method: 'DELETE',
    headers: {
      // coloque autenticação aqui se implementar na API
    }
  });
  if (res.ok) {
    loadAdminCriminals();
  } else {
    alert('Erro ao excluir criminoso');
  }
}

// Mostrar login ou admin conforme token
if (token) {
  showAdmin();
} else {
  showLogin();
}