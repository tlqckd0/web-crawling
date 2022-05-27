const { getConnection, releaseConnection } = require('./index');

const transaction = async (logic) => {
    let conn = null;
    try {
        conn = await getConnection();
        await conn.beginTransaction();

        const result = await logic(conn);

        await conn.commit();
        return result;
    } catch (err) {
        if (conn) {
            conn.rollback();
        }

        console.error(err);
        return null;
    } finally {
        if (conn) {
            releaseConnection(conn);
        }
    }
};

module.exports = {
    transaction,
};
