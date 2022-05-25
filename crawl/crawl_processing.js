const { crawler } = require('./crawler');
const { post_list_object, comment_list_object } = require('./crawl_obejct');
const puppeteer = require('puppeteer');

require('dotenv').config({
    path: '.env.crawl',
});
process.setMaxListeners(40);

const processing = ({ page_num }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            const obj_post = post_list_object;
            obj_post.href =
                process.env.ROOT_HREF + obj_post.href + `?page=${page_num}`;
            // POST정보 가지고오기.

            await page.goto(obj_post.href);
            const content = await page.content();
            let post_data_list = crawler({
                crawl_object: obj_post,
                content,
            });

            const post_list_length = post_data_list.length;

            for (let i = 0; i < post_list_length; i++) {
                let obj_comment = comment_list_object;
                obj_comment.href = process.env.ROOT_HREF + post_data_list[i].href;
                await Promise.all([
                    page.goto(obj_comment.href),
                    page.waitForNavigation({ waitUntil: 'networkidle2' }),
                ]);
                const content = await page.content();
                post_data_list[i].comment = crawler({
                    crawl_object: obj_comment,
                    content,
                });
            }

            await page.close();
            await browser.close();
            resolve(post_data_list);
        } catch (err) {
            console.error(err);
            reject([]);
        }
    });
};

// (async () => {
//     const start = new Date();
//     const res = await processing({ page_num: 2 });
//     const end = new Date();
//     res.forEach((value) => {
//         console.log(value);
//     });
//     console.log((end - start) / 1000, '초');
// })();

module.exports = {
    processing,
};
