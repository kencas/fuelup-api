module.exports = {
    create: `INSERT INTO agents(ledger_id, Name, AccNo, AccType, Code, RefNo, Created) VALUES(?, ?, ? , ?, ?, ?, ?)`,
    load_all: `SELECT ledger_id, id as _id, Name as name, AccNo as accno, AccType as acctype, RefNo as refno, Code as code, AvailableBal as availableBal, Created as created FROM agents`,
    load_single: `SELECT ledger_id, Name as name, AccNo as accno, AccType as acctype, Code as code, AvailableBal as availableBal, Created as created, RefNo as refno FROM agents WHERE id = ?`,
    load_code: `SELECT ledger_id, Name as name, AccNo as accno, AccType as acctype, Code as code, AvailableBal as availableBal, Created as created, RefNo as refno FROM agents WHERE Code = ? ORDER BY id DESC LIMIT 1`,
    update: `UPDATE agents SET Name = ? WHERE id = ?`,
    delete: `DELETE FROM agents WHERE id = ?`
}