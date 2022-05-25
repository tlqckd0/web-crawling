const analytics_post = ({ post_data, recent_post_id }) => {
    // '/view/11415608712?page=2' 형식으로 들어온다.
    const post_id = post_data.href.split('/')[2].split('?')[0];
    //여기 POST는 작업이 완료되었다.
    if (recent_post_id === post_id) {
        return false;
    }
    const post_writer = post_data.nick;
    const post_date = post_data.date;
    console.log('POST : ', post_id, post_date, post_writer, '\n');

    const save_comment_list = [];

    for (let i = 0; i < post_data.comment.length - 1; i++) {
        const comment_id = post_data.comment[i].id;
        const comment_writer = post_data.comment[i].nick;
        const comment_date = post_data.comment[i].date
            .split(' ')[1]
            .substring(0, 8);
        const comment_info = post_data.comment[i].info;

        if (comment_info[1] === 'depth0' && post_writer !== comment_writer) {
            //그냥 댓글을 쓴 경우. -> 자기자신이 쓴 경우 생략.
            //중복 생략
            if (
                save_comment_list.findIndex(
                    (comment) => comment.comment_write === comment_writer
                ) === -1
            ) {
                save_comment_list.push({
                    comment_id,
                    comment_date,
                    comment_writer,
                    post_id,
                    reple: null,
                });
            }
        }

        if (comment_info[2] === 'depth1' && post_writer === comment_writer) {
            //댓글에 답글을 달아주는 경우 -> post_writer가 답글 써준 경우만 취급.
            //대대댓글 생략
            const reple_id = comment_info[4].split('_')[1];
            if (
                save_comment_list.findIndex(
                    (comment) =>
                        comment.comment_writer === comment_writer &&
                        comment.reple === reple_id
                ) === -1
            ) {
                save_comment_list.push({
                    comment_id,
                    comment_date,
                    comment_writer,
                    post_id,
                    reple: reple_id,
                });
            }
        }
    }

    console.log(save_comment_list, '\n\n');
    //  데이터 저장 로직 
    // ->
    // 
    return true;
};

module.exports = analytics_post;
