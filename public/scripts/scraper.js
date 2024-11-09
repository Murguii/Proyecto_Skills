const puppeteer = require('puppeteer');
const fs = require('fs');

//url de la página web de donde sacar los elementos
let url = 'https://tinkererway.dev/web_skill_trees/electronics_skill_tree';

async function scrap() {
    try {
        // Launch a new browser instance
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate to the webpage
        await page.goto(url, { waitUntil: 'networkidle0' });

        const data = await page.evaluate(() => {
            //obtener todos los divs de las clases svg-wrapper
            const skillDivs = document.querySelectorAll('.svg-wrapper');
            //array donde guardaremos los elementos
            let skills = [];
            skillDivs.forEach(div => {
                const id = div.getAttribute('data-id');
                const textTspan = div.querySelectorAll('text tspan');
                const arr = [];
                textTspan.forEach(tspan => arr.push(tspan.textContent));
                //para añadir la separacion entre los diferentes tspan
                const text = arr.join('\n\n\n');
                const icon = div.querySelector('image').getAttribute('href');
                skills.push({
                    id: id,
                    text: text,
                    icon: icon
                });
            });
            return skills;
        });

        //guardar la informacion en un archivo json
        fs.writeFileSync('../../skills.json', JSON.stringify(data, null, 2));

        console.log('Data saved to skills.json');

        // Close the browser instance
        await browser.close();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

scrap();