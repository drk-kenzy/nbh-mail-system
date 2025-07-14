
// API endpoint specifically for courrier arrivée
import courrierHandler from './courrier.js';

export default function handler(req, res) {
  // Add type filter for arrival mails
  req.query.type = 'ARRIVE';
  if (req.method === 'POST') {
    req.body.type = 'ARRIVE';
  }
  
  return courrierHandler(req, res);
}
