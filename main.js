require('dotenv').config({
    path: '.env.test',
});

const analytics_post = require('./analytics_post');
const { connection_test } = require('./database');

const page_gather = require('./utils/page_gather');

async function main() {
    const start = await connection_test();
    if (start === false) {
        return;
    }

    //정보 수집
    const post_data_list = await page_gather();

    //데이터 확인 로직
    const list_length = post_data_list.length;
    for (let i = 0; i < list_length; i++) {
        const res = await analytics_post({
            post_data: post_data_list[i],
        });

        if (res === false) {
            break;
        }
        //이전 크롤링에서 확인했던 데이터면.
    }
    process.exit(0);

}

main();
