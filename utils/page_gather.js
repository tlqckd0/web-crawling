const { transactional_return } = require('../database/transactionTemplate');
const { get_latest_post_data } = require('../service/post.service');
const { processing } = require('../crawl/crawl_processing');

module.exports = async () => {
    //가장 최근 데이터까지 수집하는 역할
    const post_data_list = [];
    let page_num = 2;
    let loop_flag = true;
    let latest_post_data = await transactional_return(get_latest_post_data());
    console.log(latest_post_data)
    let latest_post_code = latest_post_data.code;
    if (latest_post_code === null) latest_post_code = '';
    console.log('latest_post_code : ', latest_post_code);

    while (loop_flag) {
        const post_data_info = await processing({ page_num, latest_post_code });
        post_data_list.push(...post_data_info.data);

        console.log(page_num, ' 페이지 데이터 수집');
        if (page_num === 4 || post_data_info.status === false) {
            //종료
            console.log('완료');
            loop_flag = false;
            break;
        }
        page_num = page_num + 1;
    }

    return post_data_list.reverse();
};
