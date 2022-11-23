module.exports = ({ comment_list, post_writer }) => {
    const save_comment_list = [];
    const comment_writer_set = new Set();
    const comment_writer_set2 = new Set();

    for (let i = 0; i < comment_list.length - 1; i++) {
        const comment_code = comment_list[i].id;
        const comment_date = comment_list[i].date.split(' ')[1].substring(0, 8);
        const comment_writer = comment_list[i].nick;
        const comment_info = comment_list[i].info;
        //console.log(post_writer, comment_code, comment_date, comment_writer, comment_info);

        //그냥 댓글을 쓴 경우. -> 자기자신이 쓴 경우 생략.
        if (comment_info[1] === 'depth0' && post_writer !== comment_writer) {
            //중복 생략
            if(comment_writer_set.has(comment_writer) === false){
                comment_writer_set.add(comment_writer);
                save_comment_list.push({
                    comment_code,
                    comment_date,
                    comment_writer,
                    reple: null,
                });
            }
        }

        if (comment_info[2] === 'depth1' && post_writer === comment_writer) {
            //댓글에 답글을 달아주는 경우 -> post_writer가 답글 써준 경우만 취급.
            //대대댓글 생략
            const reple_code = comment_info[4].split('_')[1];
            if(comment_writer_set2.has(comment_writer +"&" +reple_code) === false){
                comment_writer_set2.add(comment_writer +"&" +reple_code);
                save_comment_list.push({
                    comment_code,
                    comment_date,
                    comment_writer,
                    reple: reple_code,
                }); 
            }
            // if (
            //     save_comment_list.findIndex(
            //         (comment) =>
            //             comment.comment_writer === comment_writer &&
            //             comment.reple === reple_code
            //     ) === -1
            // ) {
            //     save_comment_list.push({
            //         comment_code,
            //         comment_date,
            //         comment_writer,
            //         reple: reple_code,
            //     });
            // }
        }
    }

    return save_comment_list;
};
