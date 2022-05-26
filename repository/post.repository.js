const SAVE_POST_SQL = 'INSERT INTO post (post_id,user_id,write_time) VALUES (?,?,?)';

const save_post = async (conn, post_id,user_id,write_time) => {
    try {
        const [rows] = await conn.execute(SAVE_POST_SQL, [post_id,user_id,write_time]);
        return rows;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    save_post,
};
