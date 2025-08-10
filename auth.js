export default function handler(req, res) {
  const { username, password } = req.body;
  
  // Simples login fixo
  if (req.method === 'POST') {
    if (username === 'astra' && password === 'sagaz') {
      return res.status(200).json({ token: 'token-fake-123' });
    }
    return res.status(401).json({ error: 'Usuário ou senha inválidos' });
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}