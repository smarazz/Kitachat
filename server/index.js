const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory document storage
let documents = [
  { name: 'Manuale_Utente_GestiPharm.pdf', uploadDate: new Date(2023, 10, 5), status: 'indexed' },
  { name: 'FAQ_Tecniche_2024.docx', uploadDate: new Date(2024, 0, 15), status: 'indexed' }
];

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename to prevent path traversal
    const safeName = path.basename(file.originalname).replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    cb(null, `${Date.now()}-${safeName}`);
  }
});
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send('Support App Backend API');
});

// Document Endpoints
app.get('/api/documents', (req, res) => {
  res.json(documents);
});

app.post('/api/documents', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const newDoc = {
    name: req.file.originalname,
    uploadDate: new Date(),
    status: 'indexed'
  };
  documents.push(newDoc);
  res.status(201).json(newDoc);
});

app.delete('/api/documents/:name', (req, res) => {
  const name = req.params.name;
  const initialLength = documents.length;
  documents = documents.filter(doc => doc.name !== name);

  if (documents.length < initialLength) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Document not found' });
  }
});

// Chat Endpoint
app.post('/api/chat', (req, res) => {
  const { query } = req.body;

  /*
     PLACEHOLDER FOR AI API INTEGRATION
     In a second phase, this is where you would call an AI service (OpenAI, Anthropic, etc.)
     using the documents content as context.
  */

  const mockResponse = {
    sender: 'ai',
    timestamp: new Date(),
    text: getMockAIResponse(query),
    sources: [
      { documentName: 'Manuale_Utente_GestiPharm.pdf', section: 'Capitolo 4: Gestione Magazzino' },
      { documentName: 'FAQ_Tecniche_2024.docx', section: 'Errori comuni invio ricette' }
    ]
  };

  res.json(mockResponse);
});

function getMockAIResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('ricetta') || q.includes('invio')) {
    return "Per l'invio delle ricette elettroniche, assicurati che il lettore smart card sia collegato correttamente. Se riscontri l'errore E04, verifica la configurazione dei certificati nel menu Impostazioni > Servizi TS.";
  }
  if (q.includes('magazzino') || q.includes('scorte')) {
    return "Il modulo magazzino consente di automatizzare il riordino basandosi sulle vendite medie degli ultimi 30 giorni. Puoi configurare le soglie critiche nella sezione Articoli.";
  }
  return "Grazie per la domanda. In base alla documentazione tecnica, questa operazione richiede l'accesso con privilegi di amministratore e la verifica del database locale.";
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
