const { crawler } = require('./crawler');
const { post_list_object, comment_list_object } = require('./crawl_obejct');
const puppeteer = require('puppeteer');

process.setMaxListeners(40);

function href_to_post_code(href) {
    return href.split('/')[2].split('?')[0]; // '/view/11415608712?page=2' 형식으로 들어온다.
}

const processing = ({ page_num, latest_post_code }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            // 1. POST정보 가지고오기.
            const post_page_href = process.env.ROOT_HREF + post_list_object.href+ `?page=${page_num}`;
            await page.goto(post_page_href);

            const content = await page.content();
            let post_data_list = crawler({
                crawl_object: post_list_object,
                content,
            });
            //2. POST정보 끝.            
            const post_list_length = post_data_list.length;
            let duplication_point = post_list_length;

            
            for (let i = 0; i < post_list_length; i++) {                    
                const post_href = process.env.ROOT_HREF + post_data_list[i].href;
                post_data_list[i].post_code = href_to_post_code(
                    post_data_list[i].href
                );
                if (post_data_list[i].post_code === latest_post_code) {
                    console.log('중복 확인... ');
                    duplication_point = i;
                    break;
                }

                await Promise.all([
                    page.goto(post_href),
                    page.waitForNavigation({ waitUntil: 'networkidle2' }),
                ]);
                const content = await page.content();
                post_data_list[i].comment = crawler({
                    crawl_object: comment_list_object,
                    content,
                });
            }

            await page.close();
            await browser.close();

            const ret = {
                data: post_data_list.slice(0, duplication_point),
                status: true,
            };
            
            //중간에 한번 끊기면 끝.
            if (duplication_point !== post_list_length) {
                ret.status = false;
            }

            resolve(ret);
        } catch (err) {
            console.error(err);
            reject([]);
        }
    });
};

module.exports = {
    processing,
};
