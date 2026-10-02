import Layer from 'express/lib/router/layer.js';

/**
 * Express 4 does not catch errors thrown by async route handlers: a failed
 * database call would leave the request hanging. This forwards a rejected
 * handler's error to next(), so the normal error handlers answer with a
 * 500. (Express 5 does this itself; remove this file after upgrading.)
 * Import once, before any routes are created.
 */
const handleRequest = Layer.prototype.handle_request;

Layer.prototype.handle_request = function handleRequestAsync(req, res, next) {
  const fn = this.handle;
  if (fn.length > 3) return handleRequest.call(this, req, res, next); // error handlers
  try {
    const result = fn(req, res, next);
    if (result && typeof result.catch === 'function') result.catch(next);
  } catch (err) {
    next(err);
  }
  return undefined;
};
