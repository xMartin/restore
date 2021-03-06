var RestoreSteps = require("../restore_steps")

JS.Test.describe("WebFinger", function() { with(this) {
  include(RestoreSteps)

  before(function() { this.start(4567) })
  after (function() { this.stop() })

  define("host", "http://localhost:4567")

  it("returns host metadata as JSON", function() { with(this) {
    get( "/.well-known/host-meta.json", {} )

    check_status( 200 )
    check_header( "Access-Control-Allow-Origin", "*" )
    check_header( "Content-Type", "application/json" )

    check_json({
      "links": [
        {
          "rel": "lrdd",
          "template": host + "/webfinger/jrd/{uri}"
        }
      ]
    })
  }})

   it("returns host metadata as XML", function() { with(this) {
    get( "/.well-known/host-meta", {} )

    check_status( 200 )
    check_header( "Access-Control-Allow-Origin", "*" )
    check_header( "Content-Type", "application/xrd+xml" )

    check_body( '<?xml version="1.0" encoding="UTF-8"?>\n\
<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">\n\
  <Link rel="lrdd"\n\
        type="application/xrd+xml"\n\
        template="' + host + '/webfinger/xrd/{uri}" />\n\
</XRD>' )
  }})

 it("returns account metadata as JSON", function() { with(this) {
    get( "/webfinger/jrd/acct:zebcoe@locog", {} )

    check_status( 200 )
    check_header( "Access-Control-Allow-Origin", "*" )
    check_header( "Content-Type", "application/json" )

    check_json({
      "links": [
        {
          "rel": "remoteStorage",
          "api": "simple",
          "auth": host + "/oauth/zebcoe",
          "template": host + "/storage/zebcoe/{category}"
        }
      ]
    })
  }})

  it("returns account metadata as XML", function() { with(this) {
    get( "/webfinger/xrd/acct:zebcoe@locog", {} )

    check_status( 200 )
    check_header( "Access-Control-Allow-Origin", "*" )
    check_header( "Content-Type", "application/xrd+xml" )

    check_body( '<?xml version="1.0" encoding="UTF-8"?>\n\
<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">\n\
  <Link rel="remoteStorage"\n\
        api="simple"\n\
        auth="' + host + '/oauth/zebcoe"\n\
        template="' + host + '/storage/zebcoe/{category}" />\n\
</XRD>' )
  }})

  it("returns resource metadata as JSON", function() { with(this) {
    get( "/.well-known/host-meta.json", {resource: "acct:zebcoe@locog"} )

    check_status( 200 )
    check_header( "Access-Control-Allow-Origin", "*" )
    check_header( "Content-Type", "application/json" )

    check_json({
      "links": [
        {
          "href": host + "/storage/zebcoe",
          "rel":  "remotestorage",
          "type": "draft-dejong-remotestorage-00",
          "properties": {
            "auth-method":    "http://tools.ietf.org/html/rfc6749#section-4.2",
            "auth-endpoint":  host + "/oauth/zebcoe"
          }
        }
      ]
    })
  }})

  it("returns resource metadata as XML", function() { with(this) {
    get( "/.well-known/host-meta", {resource: "acct:zebcoe@locog"} )

    check_status( 200 )
    check_header( "Access-Control-Allow-Origin", "*" )
    check_header( "Content-Type", "application/xrd+xml" )

    check_body( '<?xml version="1.0" encoding="UTF-8"?>\n\
<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">\n\
  <Link href="http://localhost:4567/storage/zebcoe"\n\
        rel="remotestorage"\n\
        type="draft-dejong-remotestorage-00">\n\
    <Property type="auth-method">http://tools.ietf.org/html/rfc6749#section-4.2</Property>\n\
    <Property type="auth-endpoint">http://localhost:4567/oauth/zebcoe</Property>\n\
  </Link>\n\
</XRD>' )
  }})
}})

