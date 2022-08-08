const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const talker = './talker.json';
const { validationsLogin,
  validationsToken,
  validationsName,
  validationsAge,
  validationsTalk,
  validationsWatchedAt,
  validationsRate } = require('./middlewares/validations');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// função geraStringAleatoria https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/
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

app.post('/login', validationsLogin, (_req, res) => {
  res.status(200).json({ token: geraStringAleatoria(16) });
});

app.post('/talker', validationsToken,
  validationsName,
  validationsAge,
  validationsTalk,
  validationsWatchedAt,
  validationsRate, async (req, res) => {
  const infos = await fs.readFile(talker, 'utf8');
  const infoJson = JSON.parse(infos);
  const { name, age, talk } = req.body;

  const newTalker = {
    id: infoJson.length + 1,
    name,
    age,
    talk,
  };
  infoJson.push(newTalker);
  await fs.writeFile(talker, JSON.stringify(infoJson));
  
  res.status(201).json(newTalker);
});

app.put('/talker/:id', validationsToken,
validationsName,
validationsAge,
validationsTalk,
validationsWatchedAt,
validationsRate, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const infos = await fs.readFile(talker, 'utf8');
  const infoJson = JSON.parse(infos);
  const result = infoJson.findIndex((r) => r.id === Number(id));

  const update = { ...infoJson[result], name, age, talk };
  infoJson[result] = update;

  await fs.writeFile(talker, JSON.stringify(infoJson));
  
  res.status(200).json(update);
});

app.delete('/talker/:id', validationsToken, async (req, res) => {
  const { id } = req.params;
  const infos = await fs.readFile(talker, 'utf8');
  const infoJson = JSON.parse(infos);
  const result = infoJson.findIndex((r) => r.id === Number(id));

  const erase = infoJson.slice(result, 1);
  await fs.writeFile(talker, JSON.stringify(erase));

  res.status(204).json(infoJson);
});

app.listen(PORT, () => {
  console.log('Online');
});
