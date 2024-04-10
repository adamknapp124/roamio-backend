require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');

// Configure CORS options
const corsOptions = {
	origin: 'https://roamio-rho.vercel.app', // Specify the exact origin of your Vercel deployment
	methods: ['GET', 'POST', 'PUT', 'DELETE'], // Include the methods your API supports
	allowedHeaders: ['Content-Type', 'Authorization'], // Include any additional headers your API expects
	credentials: true, // If your React app sends credentials (e.g., cookies), set this to true
};

const PORT = process.env.PORT;

const cloudinary = require('./cloudinary/cloudinary');

const mysql = require('mysql2');
const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	database: 'road_trip',
	password: 'Talon511!',
});

app.use(cors(corsOptions));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.post('/', async (req, res) => {
	// destructure the properties from the req object
	const { image } = req.body;
	try {
		const uploadedImage = await cloudinary.uploader.upload(
			image,
			{
				upload_preset: 'unsigned_upload',
				allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp'],
			},
			function (error, result) {
				if (error) {
					console.log('Error: ', error);
					res.status(500).json({ error: 'Failed to upload image' });
					return;
				}

				console.log(result);
				res.status(200).json(result);
			}
		);
	} catch (error) {
		return;
	}
});

app.post('/add-photo', async (req, res) => {
	const data = req.body;
	const public_id = data.public_id;
	try {
		const query = 'INSERT INTO photos (public_id) VALUES (?)';
		const values = [public_id];
		connection.query(query, [values]);
	} catch (error) {
		console.log(error);
	}
});

app.get('/get-public-ids', async (req, res) => {
	const query = 'SELECT * FROM photos';
	connection.query(query, function (err, result, fields) {
		if (err) throw err;
		console.log(result);
		res.send(result);
	});
});

app.post('/delete-image', async (req, res) => {
	const data = req.body;
	const public_id = data.image;

	try {
		const query = 'DELETE FROM photos WHERE public_id = (?)';
		const values = [public_id];
		connection.query(query, [values]);
	} catch (error) {
		console.log(error);
	}
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
