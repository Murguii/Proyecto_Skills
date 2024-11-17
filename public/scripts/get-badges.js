const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// URL base de GitHub para las imágenes
const baseURL = 'https://raw.githubusercontent.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/master/rangos/png/';

const badgesDir = path.join(__dirname, '..', 'badges');

// Carga la página
axios.get('https://github.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/wiki#pre-academia')
    .then(response => {
        const $ = cheerio.load(response.data);

        // Array para almacenar las medallas
        const badges = [];

        // Selecciona las tablas 6, 7, 8, 9 y 10
        const selectedTables = [6, 7, 8, 9, 10];
        let min=0;
        selectedTables.forEach(tableIndex => {
            $('table').eq(tableIndex).find('tr').each((index, element) => {
                const rango = $(element).find('td').eq(2).text().trim();
                const bitpoints_min = min;
                const bitpoints_max = bitpoints_min + 9;
                // Accede a la celda de la imagen (primera celda que contiene la imagen)
                const imageUrl = $(element).find('td').eq(1).find('img').attr('src');

                if (rango && imageUrl) {  // Verificar si rango e imagen no están vacíos
                    const imageName = imageUrl.split('/').pop().split('.')[0]; // Obtiene el nombre de la imagen sin extensión
                    console.log("Nombre de la imagen",imageName);
                    const fullImageUrl = `https://raw.githubusercontent.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/master/rangos/png/${imageName}-min.png`;

                    // Ruta donde se descargará la imagen
                    const imagePath = path.join(badgesDir, `${imageName}-min.png`);

                    // Descarga la imagen en la carpeta "../badges"
                    axios({
                        method: 'get',
                        url: fullImageUrl,
                        responseType: 'stream'
                    }).then(response => {
                        response.data.pipe(fs.createWriteStream(imagePath));
                    }).catch(err => console.error(`Error descargando la imagen: ${fullImageUrl}`, err));

                    // Agrega el objeto de la medalla al array
                    badges.push({
                        rango,
                        bitpoints_min,
                        bitpoints_max,
                        png: `${imageName}-min.png`  // Ruta local de la imagen descargada
                    });
                    min+=10;
                }
            });
        });

        // Guarda el array de medallas en un archivo JSON
        fs.writeFileSync('../medals.json', JSON.stringify(badges, null, 2));
    })
    .catch(error => {
        console.error('Error al obtener la página:', error);
});

