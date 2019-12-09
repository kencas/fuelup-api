module.exports = {
    create: `INSERT INTO transactions(Amount, Source, TxRef, Narration, Section, Tag, Created) VALUES(?, ?, ?, ?, ?, ?, ?)`,
    load_all: `SELECT  id as _id, Amount as amount, Source as source, TxRef as txref, Narration as narration, Section as section, Tag as tag, Created as created FROM transactions`,
    load_single: `SELECT id as _id, Amount as amount, Source as source, TxRef as txref, Narration as narration, Section as section, Tag as tag, Created as created FROM transactions WHERE id = ?`,
    load_accno: `SELECT id as _id, Amount as amount, Source as source, TxRef as txref, Narration as narration, Section as section, Tag as tag, Created as created FROM transactions WHERE AccNo = ? ORDER BY id DESC LIMIT 1`,
    update: `UPDATE agents SET Name = ? WHERE id = ?`,
    delete: `DELETE FROM agents WHERE id = ?`
}