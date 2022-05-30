const { post } = require('./service/post.service');
const { get_user_id } = require('./service/user.service2');
const { add_comment, add_reple } = require('./service/comment.service');
const {
    transactional_return,
    transactional_void,
} = require('./database/transactionTemplate');

const analytics_post = async ({ post_data, latest_post_code }) => {
    try {
        const post_code = post_data.href.split('/')[2].split('?')[0]; // '/view/11415608712?page=2' 형식으로 들어온다.

        if (latest_post_code === post_code) {
            return false;
        }

        const post_writer = post_data.nick;
        const write_time = post_data.date;
        console.log('POST : ', post_code, write_time, post_writer, '\n');

        //저장한다.
        const post_writer_id = await transactional_return(
            get_user_id({ nickname: post_writer })
        );
        const current_post_id = await transactional_return(
            post({ user_id: post_writer_id, post_code, write_time })
        );

        const save_comment_list = [];

        for (let i = 0; i < post_data.comment.length - 1; i++) {
            const comment_code = post_data.comment[i].id;
            const comment_date = post_data.comment[i].date
                .split(' ')[1]
                .substring(0, 8);
            const comment_writer = post_data.comment[i].nick;
            const comment_info = post_data.comment[i].info;

            if (
                comment_info[1] === 'depth0' &&
                post_writer !== comment_writer
            ) {
                //그냥 댓글을 쓴 경우. -> 자기자신이 쓴 경우 생략.
                //중복 생략
                if (
                    save_comment_list.findIndex(
                        (comment) => comment.comment_write === comment_writer
                    ) === -1
                ) {
                    save_comment_list.push({
                        comment_code,
                        comment_date,
                        comment_writer,
                        reple: null,
                    });
                }
            }

            if (
                comment_info[2] === 'depth1' &&
                post_writer === comment_writer
            ) {
                //댓글에 답글을 달아주는 경우 -> post_writer가 답글 써준 경우만 취급.
                //대대댓글 생략
                const reple_code = comment_info[4].split('_')[1];
                if (
                    save_comment_list.findIndex(
                        (comment) =>
                            comment.comment_writer === comment_writer &&
                            comment.reple === reple_code
                    ) === -1
                ) {
                    save_comment_list.push({
                        comment_code,
                        comment_date,
                        comment_writer,
                        reple: reple_code,
                    });
                }
            }
        }
        console.log(save_comment_list, '\n\n');

        //COMMENT를 일단 저장하고
        //거기에 맞는 code(VARCHAR) -> id(INT) mapping시켜줘서 REPLE저장해야함.
        const comment_code_cache = {};
        for (let i = 0; i < save_comment_list.length; i++) {
            const { comment_code, comment_date, comment_writer, reple } =
                save_comment_list[i];
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

        for (let i = 0; i < save_comment_list.length; i++) {
            const { comment_date, comment_code, comment_writer, reple } =
                save_comment_list[i];

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
