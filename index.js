const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 4000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.text());

app.post('/autosave', (req, res) => {
	console.log('body: ', req.body);
	console.log('headers: ', req.headers);
	res.json({ message: 'Autosave endpoint reached' });
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
