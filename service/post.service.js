const {
    save_post,
    find_latest_post
} = require('../repository/post.repository');

const post = ({user_id, post_code, write_time})=>{
    return async (conn)=>{
        try {
            const new_post = await save_post(conn, {user_id, post_code, write_time});
            const post_id = new_post.insertId;
            return post_id;
        } catch (err) {
            throw err;
        }
    }
}

const get_latest_post_data = ()=>{
    return async(conn)=>{
        try{
            const latest_post = await find_latest_post(conn);
            const code = latest_post[0].post_code;
            const time = latest_post[0].time;
            return {
                code, time
            };
        }catch(err){
            throw err;
        }
    }
}

module.exports = {
    post,
    get_latest_post_data
}