const SAVE_POST_SQL =
    'INSERT INTO post (user_id, post_code, time) VALUES (?,?,?)';
const FIND_MAX_POST_ID_SQL = `SELECT post_code, time FROM post WHERE post_id = (SELECT MAX(post_Id) FROM post)`;

const save_post = async (conn, { user_id, post_code, write_time }) => {
    try {
        const [rows] = await conn.execute(SAVE_POST_SQL, [
            user_id,
            post_code,
            write_time,
        ]);
        return rows;
    } catch (err) {
        throw err;
    }
};

const find_latest_post = async (conn) => {
    try {
        const [rows] = await conn.execute(FIND_MAX_POST_ID_SQL);
        return rows;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    save_post,
    find_latest_post,
};
