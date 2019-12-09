module.exports = {
    create: `INSERT INTO banks(ledger_id, Name, AccNo, AccType, Code, Created) VALUES(?, ?, ? , ?, ?, ?)`,
    load_all: `SELECT ledger_id, id as _id, Name as name, AccNo as accno, AccType as acctype, Code as code, Created as created FROM banks`,
    load_single: `SELECT ledger_id, Name as name, AccNo as accno, AccType as acctype, Code as code, Created as created FROM banks WHERE id = ?`,
    load_code: `SELECT ledger_id, Name as name, AccNo as accno, AccType as acctype, Code as code, Created as created FROM banks WHERE Code = ? ORDER BY id DESC LIMIT 1`,
    update: `UPDATE banks SET Name = ? WHERE id = ?`,
    delete: `DELETE FROM banks WHERE id = ?`
}