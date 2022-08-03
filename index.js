const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const talker = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const infos = JSON.parse(fs.readFileSync(talker, 'utf8'));
    res.status(200).json(infos);
});

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const infos = JSON.parse(fs.readFileSync(talker, 'utf8'));
  const result = infos.find((r) => r.id === Number(id));
  if (!result) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(result);
});

app.listen(PORT, () => {
  console.log('Online');
});
