const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const talker = './talker.json';
const validations = require('./middlewares/validations');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// função geraStringAleatoria encurtador.com.br/pqKY8
function geraStringAleatoria(tamanho) {
  let stringAleatoria = '';
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < tamanho; i += 1) {
      stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return stringAleatoria;
}

app.get('/talker', async (_req, res) => {
  const infos = await fs.readFile(talker, 'utf8');
    res.status(200).json(JSON.parse(infos));
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const infos = await fs.readFile(talker, 'utf8');
  const infoJson = JSON.parse(infos);
  const result = infoJson.find((r) => r.id === Number(id));
  if (!result) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(result);
});

app.post('/login', validations, (_req, res) => {
  res.status(200).json({ token: geraStringAleatoria(16) });
});

app.listen(PORT, () => {
  console.log('Online');
});
