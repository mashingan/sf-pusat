/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/agent_productivitys              ->  index
 */

'use strict';

// Gets a list of AgentProductivitys
exports.index = function(req, res) {
  res.json([]);
}
