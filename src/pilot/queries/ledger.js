module.exports = {
    create: `INSERT INTO ledgers(AccNo, AccName, Code, Section) VALUES(?, ?, ? , ?)`,
    load_all: `SELECT id as _id, AccNo as accno, AccName as accname, Code as code, Section as section, Balance as availableBal  FROM ledgers`,
    load_single: `SELECT id as _id, AccNo as accno, AccName as accname, Code as code, Section as section, Balance as availableBal FROM ledgers WHERE id = ?`,
    load_code: `SELECT id as _id, AccNo as accno, AccName as accname, Code as code, Section as section, Balance as availableBal FROM ledgers WHERE Code = ? ORDER BY id DESC LIMIT 1`,
    update: `UPDATE ledgers SET AccName = ? WHERE id = ?`,
    delete: `DELETE FROM ledgers WHERE id = ?`
}