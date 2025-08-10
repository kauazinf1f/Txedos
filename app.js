const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginMsg = document.getElementById('loginMsg');

let token = localStorage.getItem('token');

function showAdmin() {
  loginSection.style.display = 'none';
  adminSection.style.display = 'block';
  loadAdminCriminals();
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

  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      loginMsg.textContent = errorData?.error || `Erro: ${res.status}`;
      return;
    }

    const data = await res.json();
    token = data.token;
    localStorage.setItem('token', token);
    loginMsg.textContent = '';
    showAdmin();
  } catch (error) {
    loginMsg.textContent = 'Erro de conexão, tente novamente.';
    console.error('Erro no login:', error);
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  token = null;
  showLogin();
});

// Função para carregar criminosos no painel admin
async function loadAdminCriminals() {
  const adminCriminalList = document.getElementById('adminCriminalList');
  try {
    const res = await fetch('/api/criminals');
    if (!res.ok) {
      adminCriminalList.innerHTML = '<li>Erro ao carregar criminosos.</li>';
      return;
    }
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
  } catch {
    adminCriminalList.innerHTML = '<li>Erro ao carregar criminosos.</li>';
  }
}

// Função para excluir criminoso
async function deleteCriminal(id) {
  if (!confirm('Tem certeza que deseja excluir?')) return;
  try {
    const res = await fetch('/api/criminals?id=' + id, {
      method: 'DELETE',
    });
    if (res.ok) {
      loadAdminCriminals();
    } else {
      alert('Erro ao excluir criminoso.');
    }
  } catch {
    alert('Erro de conexão.');
  }
}

// Formulário para adicionar criminoso
const addCriminalForm = document.getElementById('addCriminalForm');
if (addCriminalForm) {
  addCriminalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('nameInput').value;
    const crime = document.getElementById('crimeInput').value;
    const details = document.getElementById('detailsInput').value;

    try {
      const res = await fetch('/api/criminals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, crime, details }),
      });

      if (res.ok) {
        addCriminalForm.reset();
        loadAdminCriminals();
      } else {
        alert('Erro ao adicionar criminoso.');
      }
    } catch {
      alert('Erro de conexão.');
    }
  });
}
