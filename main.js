require('dotenv').config({
    path: '.env.test',
});

const analytics_post = require('./analytics_post');
const { connection_test } = require('./database');

const page_gather = require('./utils/page_gather');

async function save_date({ post_data_list }) {
    const list_length = post_data_list.length;
    for (let i = 0; i < list_length; i++) {
        const res = await analytics_post({
            post_data: post_data_list[i],
        });

        if (res === false) {
            //실패시 탈출
            break;
        }
    }
}

async function main() {
    const start = await connection_test();
    //1. DB연결 확인
    if (start === false) {
        return;
    }

    //2. 크롤링
    const post_data_list = await page_gather();

    //3. POST, COMMENT 저장 로직.
    await save_date({ post_data_list });
    process.exit(0);
}

main();
