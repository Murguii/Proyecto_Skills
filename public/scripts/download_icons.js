const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Directorio donde se guardarán los íconos descargados
const iconsDir = path.join(__dirname, '../electronic/icons');

// Crear el directorio si no existe
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Ruta del archivo JSON exportado por scraper.js
const jsonFilePath = path.join(__dirname, '../../skills.json');

// Función para descargar un ícono dado su URL y el nombre de archivo
async function downloadIcon(iconUrl, filename) {
    try {
        const response = await axios({
            url: iconUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const filePath = path.join(iconsDir, filename);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`Descarga exitosa: ${filename}`);
                resolve();
            });
            writer.on('error', (error) => {
                console.error(`Error al descargar ${filename}:`, error.message);
                reject(error);
            });
        });
    } catch (error) {
        console.error(`Error al descargar el icono desde ${iconUrl}:`, error.message);
    }
}

// Función principal para leer el JSON y descargar los íconos
async function downloadIcons() {
    try {
        // Leer y parsear el archivo JSON
        const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

        // Obtener URLs de los íconos, limitando a 67 íconos
        const iconUrls = data.slice(0, 67).map((skill) => skill.icon);

        // Descargar cada ícono y nombrarlos en secuencia
        const downloadPromises = iconUrls.map((iconUrl, index) => {
            const filename = `icon${index + 1}.svg`;
            return downloadIcon(iconUrl, filename);
        });

        // Esperar a que todas las descargas finalicen
        await Promise.all(downloadPromises);
        console.log("Se han descargado todos los íconos");
    } catch (error) {
        console.error("Ocurrió un error al procesar el archivo JSON o al descargar los íconos:", error.message);
    }
}

downloadIcons();
