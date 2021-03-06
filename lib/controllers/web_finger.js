var WebFinger = require('./base').inherit(function(forceSSL) {
  this._forceSSL = forceSSL;
});

WebFinger.action('hostMeta', function(extension) {
  var resource = this.params.resource,
      host     = this.getOrigin(),
      json     = (extension === '.json'),
      response;

  if (!resource) {
    response = {
      'links': [ {
        'rel': 'lrdd',
        'template': host + '/webfinger/' + (json ? 'jrd' : 'xrd') + '/{uri}'
      } ]
    };
    if (json)
      this.renderJSON(response);
    else
      this.renderXRD('host.xml', response);

    return;
  }

  var user = resource.replace(/^acct:/, '').split('@')[0];

  var response = {
    'links': [ {
      'href': host + '/storage/' + user,
      'rel':  'remotestorage',
      'type': 'draft-dejong-remotestorage-00',
      'properties': {
        'auth-method':    'http://tools.ietf.org/html/rfc6749#section-4.2',
        'auth-endpoint':  host + '/oauth/' + user
      }
    } ]
  };

  if (extension === '.json')
    this.renderJSON(response);
  else
    this.renderXRD('resource.xml', response);
});

WebFinger.action('account', function(type, resource) {
  var user = user = resource.replace(/^acct:/, '').split('@')[0],
      host = this.getOrigin();

  var response = {
    'links': [ {
      'rel':      'remoteStorage',
      'api':      'simple',
      'auth':     host + '/oauth/' + user,
      'template': host + '/storage/' + user + '/{category}'
    } ]
  };

  if (type === 'jrd')
    this.renderJSON(response);
  else
    this.renderXRD('account.xml', response);
});

WebFinger.prototype.getOrigin = function() {
  var scheme = (this.request.secure || this._forceSSL) ? 'https' : 'http',
      host   = this.request.headers['x-forwarded-host'] || this.request.headers.host;

  return scheme + '://' + host;
};

module.exports = WebFinger;

