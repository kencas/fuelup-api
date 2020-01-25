module.exports = {
    create: `INSERT INTO postings(transaction_id, Amount, TransType, AccType, PostMode, Section, AccNo, AccNo2, Narration, Created) VALUES(?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)`,
    load_all: `SELECT transaction_id, id as _id, Amount as amount, TransType as transtype, AccType as acctype, PostMode as postmode, Section as section, AccNo as accno, AccNo2 as accno2, Narration as narration, Created as created FROM postings`,
    load_single: `SELECT transaction_id, id as _id, Amount as amount, TransType as transtype, AccType as acctype, PostMode as postmode, Section as section, AccNo as accno, AccNo2 as accno2, Narration as narration, Created as created FROM postings WHERE id = ?`,
    load_accno: `SELECT transaction_id, id as _id, Amount as amount, TransType as transtype, AccType as acctype, PostMode as postmode, Section as section, AccNo as accno, AccNo2 as accno2, Narration as narration, Created as created FROM postings WHERE AccNo = ? ORDER BY id DESC LIMIT 1`,
    update: `UPDATE agents SET Name = ? WHERE id = ?`,
    delete: `DELETE FROM agents WHERE id = ?`
}