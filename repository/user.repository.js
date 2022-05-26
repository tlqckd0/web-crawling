const FIND_USER_BY_NICKNAME_SQL =
    'SELECT user_id, nickname, register FROM user WHERE nickname = ?';

const SAVE_USER_SQL = 'INSERT INTO user (nickname) VALUES (?)';

const find_user_by_nickname = async (conn, nickname) => {
    try {
        const [rows] = await conn.execute(FIND_USER_BY_NICKNAME_SQL, [nickname]);
        return rows;
    } catch (err) {
        throw err;
    }
};

const save_user = async (conn, nickname) => {
    try {
        const [rows] = await conn.execute(SAVE_USER_SQL, [nickname]);
        return rows;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    find_user_by_nickname,
    save_user,
};
