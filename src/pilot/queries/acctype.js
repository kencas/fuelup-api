module.exports = {
    create: `INSERT INTO acctypes(ledger_id,AccNo, Name, Code, Code2, AccType, Type, Created) VALUES(?, ?, ?, ? , ?, ?, ?, ?)`,
    load_all: `SELECT ledger_id, AccNo as accno, Name as name, Code as code, Code2 as code2, AccType as acctype, Type as type FROM acctypes`,
    load_single: `SELECT AccNo as accno, Name as name, Code as code, Code2 as code2, AccType as acctype, Type as type FROM acctypes WHERE id = ?`,
    load_acccno: `SELECT AccNo as accno, Name as name, Code as code, Code2 as code2, AccType as acctype, Type as type FROM acctypes WHERE AccNo = ? ORDER BY id DESC LIMIT 1`,
    update: `UPDATE acctypes SET Code2 = ? WHERE id = ?`,
    delete: `DELETE FROM acctypes WHERE id = ?`
}