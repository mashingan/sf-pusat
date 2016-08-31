/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/agent_transactions              ->  index
 */

'use strict';

// Gets a list of AgentTransactions
exports.index = function(req, res) {
  res.json([]);
}
