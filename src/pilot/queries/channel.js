module.exports = {
    create: `INSERT INTO channels(ledger_id, Name, AccNo, AccType, Code, Created) VALUES(?, ?, ? , ?, ?, ?)`,
    load_all: `SELECT ledger_id, id as _id, Name as name, AccNo as accno, AccType as acctype, Code as code, Balance as availableBal, Created as created FROM channels`,
    load_single: `SELECT ledger_id, Name as name, AccNo as accno, AccType as acctype, Code as code, Created as created FROM channels WHERE id = ?`,
    load_code: `SELECT ledger_id, Name as name, AccNo as accno, AccType as acctype, Code as code, Created as created FROM channels WHERE Code = ? ORDER BY id DESC LIMIT 1`,
    update: `UPDATE banks SET Name = ? WHERE id = ?`,
    delete: `DELETE FROM banks WHERE id = ?`
}