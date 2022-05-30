require('dotenv').config({
    path: '.env.test',
});

const { processing } = require('./crawl/crawl_processing');
const analytics_post = require('./analytics_post');
const {connection_test} = require('./database');
async function main() {
    const start = await connection_test();
    if(start === false){
        return;
    }
    //중복 POST나오기 전까지 간다.
    let page_num = 2;
    let loop_flag = true;
    const recent_post_id = -1; //DB에서 가장 최근꺼 데이터를 가지고 온다.
    const post_data_list = await processing({ page_num });

    //데이터 확인 로직
    const list_length = post_data_list.length;
    for (let i = 0; i < list_length; i++) {
        const res = await analytics_post({
            post_data: post_data_list[i],
            recent_post_id,
        });
        
        if (res === false || page_num === 10) {
            break;
        }
        //이전 크롤링에서 확인했던 데이터면.
    }

    // while (loop_flag) {
    //     const post_data_list = await processing({ page_num });

    //     //데이터 확인 로직
    //     const list_length = post_data_list.length;
    //     for(let i=0;i<list_length;i++){
    //         analytics_post({recent_post_code})
    //         //이전 크롤링에서 확인했던 데이터면.

    //         if(1){
    //             loop_flag = false;
    //             break;
    //         }
    //     }
    //     //업데이트 끝나면 페이지 넘어간드아
    //     page_num = page_num + 1;
    // }
}

main();
