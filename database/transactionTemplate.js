const { getConnection, releaseConnection } = require('./index');

/**
 * @param {closure} logic
 * @returns DB result
 */
const transactional_return = async (logic) => {
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

/**
 * @param {closure} logic
 * @returns void
 */
const transactional_void = async (logic) => {
    let conn = null;
    try {
        conn = await getConnection();
        await conn.beginTransaction();
        await logic(conn);
        await conn.commit();
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

const non_tranx_return = async (logic) => {
    let conn = null;
    try {
        conn = await getConnection();
        await logic(conn);
    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            releaseConnection(conn);
        }
    }
};

const non_tranx_void = async (logic) => {
    let conn = null;
    try {
        conn = await getConnection();
        await logic(conn);
    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            releaseConnection(conn);
        }
    }
};

module.exports = {
    transactional_return,
    transactional_void,
    non_tranx_return,
    non_tranx_void,
};
