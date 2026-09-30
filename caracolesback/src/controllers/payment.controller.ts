import {  pool  } from '../config/database';

const generateAlphanumeric = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const buildReport = (status, detail, body, id = null) => {
  const isApproved = status === 'approved';
  
  // Real-world banks use 6-digit numeric authorization codes for approved transactions
  const authCode = isApproved ? Math.floor(100000 + Math.random() * 900000).toString() : null;
  
  // Real-world systems generate tracking references for ALL attempts (even rejected ones)
  const refCode = `TXN-${generateAlphanumeric(12)}`;

  return {
    id: id || `REJ-${generateAlphanumeric(8)}`,
    status: status,
    status_detail: detail,
    transaction_amount: body?.amount || 0,
    date_created: new Date().toISOString(),
    authorization_code: authCode,
    reference: refCode,
    payer_id: body?.userId || null,
    payer_email: body?.payerEmail || 'unknown'
  };
};

const simulateDeposit = async (req: any, res: any) => {
  try {
    const { cardNumber, expirationDate, cvv, fullName, amount, userId } = req.body;

    if (!cardNumber || !expirationDate || !cvv || !fullName || !amount || !userId) {
      return res.status(400).json(buildReport('rejected', 'Missing required fields', req.body));
    }

    const cleanCard = cardNumber.toString().replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cleanCard)) {
      return res.status(400).json(buildReport('rejected', 'Invalid card number', req.body));
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
      return res.status(400).json(buildReport('rejected', 'Invalid expiry format', req.body));
    }

    const [expMonth, expYearStr] = expirationDate.split('/');
    const expYear = parseInt(`20${expYearStr}`, 10);
    const expMonthInt = parseInt(expMonth, 10);
    const now = new Date();
    
    if (expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonthInt < now.getMonth() + 1)) {
      return res.status(400).json(buildReport('rejected', 'Card expired', req.body));
    }
    if (expYear > now.getFullYear() + 20) {
      return res.status(400).json(buildReport('rejected', 'Expiry year invalid', req.body));
    }
    if (!/^\d{3,4}$/.test(cvv.toString())) {
      return res.status(400).json(buildReport('rejected', 'Invalid CVV', req.body));
    }
    if (fullName.trim().length < 3) {
      return res.status(400).json(buildReport('rejected', 'Name too short', req.body));
    }
    if (amount <= 0 || isNaN(amount)) {
      return res.status(400).json(buildReport('rejected', 'Invalid amount', req.body));
    }

    const insertQuery = `
      INSERT INTO payments (user_id, card_number, expiration_date, cvv, full_name, amount, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
    `;
    const values = [userId, cleanCard, expirationDate, cvv, fullName, amount, 'COMPLETED'];
    const result = await pool.query(insertQuery, values);

    return res.status(200).json(buildReport('approved', 'Accredited successfully', req.body, result.rows[0].id));
  } catch (error: any) {
    console.error('Error in SnailPay simulation:', error);
    return res.status(500).json(buildReport('error', 'Internal server error', req.body));
  }
};

const getPaymentHistory = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const query = `
      SELECT id, amount, status, created_at, full_name, 
             concat('**** **** **** ', right(card_number, 4)) as card_last4 
      FROM payments 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Internal server error while fetching payment history.' });
  }
};

const deletePayment = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    const deleteQuery = 'DELETE FROM payments WHERE id = $1 RETURNING id';
    const result = await pool.query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    return res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Internal server error while deleting payment.' });
  }
};

export { 
  simulateDeposit,
  getPaymentHistory,
  deletePayment
 };
