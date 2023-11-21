// Node.js server using Express
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files from the 'static' directory
app.use('/', express.static(path.join(__dirname, 'static')));

// Replace 'YOUR_WEBEX_ACCESS_TOKEN' with your actual Webex access token
const webexAccessToken = 'NzdlNmY4MDItOGEyMi00ZjUxLWFlMTAtOTNmYzZjMjA4OGJmMzI4MzdiODUtNTVm_P0A1_f5e58214-0ff5-4066-82da-b1a7c6c6a57a';

// Handle requests for favicon.ico
app.get('/favicon.ico', (req, res) => {
    res.status(204).send();
});

// Endpoint to schedule a meeting
app.post('/schedule-meeting', async (req, res) => {
    try {
        const { title, start, end } = req.body;


        if (start >= end) {
            return res.status(400).send("Start time must be before end time");
        }

        // Create a Webex meeting using the API
        const response = await axios.post(
            'https://webexapis.com/v1/meetings',
            {
                title,
                start,
                end,
            },
            {
                headers: {
                    Authorization: `Bearer ${webexAccessToken}`
                }
            }
        );

        // Return the meeting details or other relevant information
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);

        // Log the error details
        console.error('Error details:', error.response?.data || error.message);

        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// For any other route, send the schedule.html file
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, 'static', 'together', req.url);

    console.log(`Attempting to send file: ${filePath}`);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error sending file: ${err}`);
            res.status(500).send(`Internal Server Error: ${err}`);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
