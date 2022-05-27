const { getConnection, releaseConnection } = require('../database');
const {
    find_user_by_nickname,
    save_user,
} = require('../repository/user.repository');

const user_id_cache = {};

const get_user_id = async (nickname) => {
    // 0. 반복되는 닉네임이 많을것이므로 캐시되어있는지 확인한다.
    if (user_id_cache[nickname]) {
        console.log(`use cache ${nickname}`);
        return user_id_cache[nickname];
    }

    let conn = null;
    try {
        conn = await getConnection();
        await conn.beginTransaction();

        const find_user = await find_user_by_nickname(conn, nickname);
        let user_id = -1;
        if (find_user.length === 0) {// -> 해당 닉네임을 가진 유저가 없는 경우
            
            const new_user = await save_user(conn, nickname);
            user_id = new_user.insertId;

        } else { // -> 해당 닉네임을 가진 유저가 있는 경우            
            user_id = find_user[0].user_id;
        }

        //인메모리 캐싱을 위해서..(전체 유저 50명도 안될것이라 예상)
        user_id_cache[nickname] = user_id;
        await conn.commit();

        return user_id;
    } catch (err) {
        if (conn) {
            conn.rollback();
        }

        throw err;
    } finally {
        if (conn) {
            releaseConnection(conn);
        }
    }
};

module.exports = {
    get_user_id,
};
