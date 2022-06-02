const { post } = require('./service/post.service');
const { get_user_id } = require('./service/user.service2');
const { add_comment, add_reple } = require('./service/comment.service');
const {
    transactional_return,
    transactional_void,
} = require('./database/transactionTemplate');

const comment_classify = require('./utils/comment_classify');

const analytics_post = async ({ post_data }) => {
    try {
        const post_code = post_data.post_code;
        const post_writer = post_data.nick;
        const write_time = post_data.date;

        //post를 저장한다.
        const post_writer_id = await transactional_return(
            get_user_id({ nickname: post_writer })
        );
        const current_post_id = await transactional_return(
            post({ user_id: post_writer_id, post_code, write_time })
        );

        //post에 딸린 comment 분류작업
        const comment_list = comment_classify({comment_list : post_data.comment, post_writer });

        //COMMENT를 일단 저장하고
        //거기에 맞는 code(VARCHAR) -> id(INT) mapping시켜줘서 REPLE저장해야함.
        const comment_code_cache = {};
        for (let i = 0; i < comment_list.length; i++) {
            const { comment_code, comment_date, comment_writer, reple } =
                comment_list[i];
            if (comment_writer === '') continue;
            if (reple) continue;
            const comment_user_id = await transactional_return(
                get_user_id({ nickname: comment_writer })
            );
            const comment_id = await transactional_return(
                add_comment({
                    user_id: comment_user_id,
                    post_id: current_post_id,
                    comment_code,
                    time: comment_date,
                })
            );
            comment_code_cache[comment_code] = comment_id;
        }
        //REPLE 작업
        for (let i = 0; i < comment_list.length; i++) {
            const { comment_date, comment_code, comment_writer, reple } =
                comment_list[i];

            if (comment_writer === '') continue;
            if (reple && comment_code_cache[reple]) {
                const reple_user_id = await transactional_return(
                    get_user_id({ nickname: comment_writer })
                );
                await transactional_void(
                    add_reple({
                        user_id: reple_user_id,
                        post_id: current_post_id,
                        comment_code,
                        time: comment_date,
                        reple: comment_code_cache[reple],
                    })
                );
            }
        }

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

module.exports = analytics_post;
