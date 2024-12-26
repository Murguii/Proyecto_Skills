const puppeteer = require('puppeteer');
const fs = require('fs');

// URL de la página web y del dominio base
let url = 'https://tinkererway.dev/web_skill_trees/electronics_skill_tree';
let baseUrl = 'https://tinkererway.dev';

async function scrap() {
    try {
        // Iniciar una instancia de navegador
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navegar a la página
        await page.goto(url, { waitUntil: 'networkidle0' });

        const data = await page.evaluate((baseUrl) => {
            // Obtener todos los divs con la clase svg-wrapper
            const skillDivs = document.querySelectorAll('.svg-wrapper');
            let skills = [];

            skillDivs.forEach(div => {
                const id = parseInt(div.getAttribute('data-id'), 10);
                const textTspan = div.querySelectorAll('text tspan');
                const arr = [];
                textTspan.forEach(tspan => arr.push(tspan.textContent));
                const text = arr.join('\n\n\n');

                // Obtener el icono y construir la URL completa
                const iconRelativePath = div.querySelector('image').getAttribute('href');
                const icon = iconRelativePath.startsWith('http')
                    ? iconRelativePath
                    : `${baseUrl}${iconRelativePath.replace(/^\.\.\//, '/')}`;

                // Campos predeterminados
                const set = "electronics"; // Ajustar según tus necesidades
                const tasks = []; // Lista vacía por defecto
                const resources = []; // Lista vacía por defecto
                const description = "Descripción generada automáticamente"; // Ajustar según tus necesidades
                const score = 1; // Valor predeterminado

                skills.push({
                    id: id,
                    text: text,
                    icon: icon,
                    set: set,
                    tasks: tasks,
                    resources: resources,
                    description: description,
                    score: score
                });
            });
            return skills;
        }, baseUrl);

        // Guardar la información en un archivo JSON
        fs.writeFileSync('./public/skills.json', JSON.stringify(data, null, 2));

        console.log('Data saved to skills.json');

        // Cerrar el navegador
        await browser.close();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

scrap();
