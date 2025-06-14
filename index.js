const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

const app = express();
app.use(bodyParser.json());

const auth = new google.auth.GoogleAuth({
  keyFile: 'service-account.json', 
  scopes: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/presentations'
  ]
});

const TEMPLATE_FILE_ID = '15LIRhI8CdPmJyAOJD4gx343NK3Gz9UtOi_VtQjMjixY'; // Replace this with your template ID

app.post('/generate-slide', async (req, res) => {
  const { key_term_1, definition_1, key_term_2, definition_2 } = req.body;

  try {
    const client = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: client });
    const slides = google.slides({ version: 'v1', auth: client });

    const copyResponse = await drive.files.copy({
      fileId: TEMPLATE_FILE_ID,
      requestBody: {
        name: `Generated Slides - ${key_term_1}`
      }
    });

    const newFileId = copyResponse.data.id;

    await slides.presentations.batchUpdate({
      presentationId: newFileId,
      requestBody: {
requests: [
  {
    replaceAllText: {
      containsText: {
        text: '{{key_term_1}}',
        matchCase: true
      },
      replaceText: key_term_1
    }
  },
  {
    replaceAllText: {
      containsText: {
        text: '{{definition_1}}',
        matchCase: true
      },
      replaceText: definition_1
    }
  },
  {
    replaceAllText: {
      containsText: {
        text: '{{key_term_2}}',
        matchCase: true
      },
      replaceText: key_term_2
    }
  },
  {
    replaceAllText: {
      containsText: {
        text: '{{definition_2}}',
        matchCase: true
      },
      replaceText: definition_2
    }
  }
]
      }
    });

    await drive.permissions.create({
      fileId: newFileId,
      requestBody: {
        role: 'commenter',
        type: 'anyone'
      }
    });

    const fileLink = `https://docs.google.com/presentation/d/${newFileId}/copy`;
    res.json({ link: fileLink });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating slide deck');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Slides Generator POC running on port ${PORT}`));
