const SAVE_COMMENT_SQL =
    'INSERT INTO comment (user_id, post_id, comment_code, time) VALUES (?,?,?,?)';
const SAVE_COMMENT_REPLE_SQL =
    'INSERT INTO comment (user_id, post_id, comment_code, time, reple) VALUES (?,?,?,?,?)';

const save_comment = async (conn, {user_id, post_id, comment_code, time}) => {
    try {
        const [rows] = await conn.execute(SAVE_COMMENT_SQL, [
            user_id,
            post_id,
            comment_code,
            time,
        ]);
        return rows;
    } catch (err) {
        throw err;
    }
};

const save_comment_reple = async (
    conn,
    {user_id,
    post_id,
    comment_code,
    time,
    reple}
) => {
    try {
        const [rows] = await conn.execute(SAVE_COMMENT_REPLE_SQL, [
            user_id,
            post_id,
            comment_code,
            time,
            reple,
        ]);
        return rows;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    save_comment,
    save_comment_reple,
};
