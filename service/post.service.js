const {
    save_post,
    find_latest_post_id
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

const get_latest_post_code = ()=>{
    return async(conn)=>{
        try{
            const latest_post = await find_latest_post_id(conn);
            const post_id = latest_post[0].latest_post_id;
            return post_id;
        }catch(err){
            throw err;
        }
    }
}

module.exports = {
    post,
    get_latest_post_code
}