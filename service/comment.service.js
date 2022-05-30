const {
    save_comment,
    save_comment_reple,
} = require('../repository/comment.repository');

const add_comment = ({user_id, post_id, comment_code, time}) => {
    return async (conn) => {
        try {
            const new_comment = await save_comment(
                conn,
                {user_id,
                post_id,
                comment_code,
                time}
            );
            const comment_id = new_comment.insertId;
            return comment_id;
        } catch (err) {
            throw err;
        }
    };
};

const add_reple = ({user_id, post_id, comment_code, time, reple}) => {
    return async (conn) => {
        try {
            const new_reple = await save_comment_reple(
                conn,
                {user_id,
                post_id,
                comment_code,
                time,
                reple}
            );
            const reple_id = new_reple.insertId;
            return reple_id;
        } catch (err) {
            throw err;
        }
    };
};

module.exports = {
    add_comment,
    add_reple,
};
