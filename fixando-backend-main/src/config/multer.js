const multer = require("multer");
const path = require("path");

// Limite de tamanho: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Certifique-se de que a pasta 'uploads' existe!
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Função de filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/gif",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); // Aceita o arquivo
  } else {
    // Rejeita o arquivo e retorna um erro
    cb(new Error("Tipo de arquivo inválido. Apenas imagens são permitidas."), false); 
  }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE }, // Adiciona limite de tamanho
    fileFilter: fileFilter // Adiciona filtro de tipo
});

module.exports = upload;
