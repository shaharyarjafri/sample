async function execPackage(body) {
  result = await execOPA(body);
  return result;
}
async function execOPA(body) {
  var https = require("http");
  return new Promise(async function (resolve, reject) {
    const { StringDecoder } = require('string_decoder');
    jsonObject = JSON.stringify(body);
    var postheaders = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(jsonObject, "utf8"),
    };
    var optionspost = {
      host: "localhost",
      port: 3331,
      path: "/api/v1/daml/checkAuthentication",
      method: "POST",
      headers: postheaders,
    };
    var reqPost = await https.request(optionspost, async function (res) {
      console.log("statusCode: ", res.statusCode);
      var decoder = new StringDecoder("utf-8");
      var buffer = "";

      await res.on("data", (d) => {
        console.info("POST result:\n");
        resolve(
          (buffer += decoder.write(d))
          // process.stdout.write(d)
        );
        console.info("\n\nPOST completed");
        return buffer;
      });
    });

    reqPost.write(jsonObject);
    reqPost.end();
    reqPost.on("error", function (e) {
      console.error("error inside  ", e);
    });
  });
}

module.exports = execPackage;
