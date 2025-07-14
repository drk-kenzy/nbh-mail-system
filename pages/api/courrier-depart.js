
// API endpoint specifically for courrier départ
import courrierHandler from './courrier.js';

export default function handler(req, res) {
  // Add type filter for departure mails
  req.query.type = 'DEPART';
  if (req.method === 'POST') {
    req.body.type = 'DEPART';
  }
  
  return courrierHandler(req, res);
}
