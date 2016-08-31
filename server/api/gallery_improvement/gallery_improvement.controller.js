/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/gallery_improvements              ->  index
 */

'use strict';

// Gets a list of GalleryImprovements
exports.index = function(req, res) {
  res.json([]);
}
