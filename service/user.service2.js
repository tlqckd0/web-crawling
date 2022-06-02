const {
    find_user_by_nickname,
    save_user,
} = require('../repository/user.repository');

const user_id_cache = {};

const get_user_id = ({nickname}) => {
    return async (conn) => {
        try {
            if (user_id_cache[nickname]) {
                return user_id_cache[nickname];
            }

            const find_user = await find_user_by_nickname(conn, nickname);
            let user_id = -1;
            if (find_user.length === 0) {
                // -> 해당 닉네임을 가진 유저가 없는 경우
                const new_user = await save_user(conn, nickname);
                user_id = new_user.insertId;
            } else {
                // -> 해당 닉네임을 가진 유저가 있는 경우
                user_id = find_user[0].user_id;
            }

            user_id_cache[nickname] = user_id;

            return user_id;
        } catch (err) {
            throw err;
        }
    };
};

module.exports = {
    get_user_id,
};
