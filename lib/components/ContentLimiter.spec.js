// Generated by CoffeeScript 1.12.7
(function() {
  var ContentLimiter, React, ReactDOMServer, elem, key,
    slice = [].slice;

  React = require("react");

  ReactDOMServer = require("react-dom/server");

  ContentLimiter = require("./ContentLimiter")["default"];

  key = 0;

  elem = function() {
    var children, name;
    name = arguments[0], children = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return React.createElement(name, {
      key: key++
    }, children.length === 1 ? children[0] : children);
  };

  describe("ContentLimiter", function() {
    var limitTests, noLimitTests, props, testedLimiter;
    props = {
      limit: 1,
      respectLimit: true,
      test: true
    };
    testedLimiter = null;
    noLimitTests = [["limiting single sentence", elem("p", elem("b", "Ignorance"), " is a lack of ", elem("a", "knowledge"), ".")]];
    noLimitTests.forEach(function(params) {
      var children, testName;
      testName = params[0], children = params[1];
      return describe("when " + testName, function() {
        beforeEach(function() {
          return testedLimiter = React.createElement(ContentLimiter, props, children);
        });
        return it("contains not limited children", function() {
          var notLimited;
          notLimited = React.createElement("div", {
            className: "content"
          }, children);
          return ReactDOMServer.renderToStaticMarkup(testedLimiter).should.equal(ReactDOMServer.renderToStaticMarkup(notLimited));
        });
      });
    });
    limitTests = [["limiting two sentences", [elem("p", elem("b", "Ignorance"), " is a lack of ", elem("a", "knowledge"), ". "), "Knowledge is a lack of ignorance."], "<p><b>Ignorance</b> is a lack of <a>knowledge</a>.</p>"], ["limiting images", elem("div", elem("img"), elem("img"), elem("img")), "<div></div>"]];
    return limitTests.forEach(function(params) {
      var children, expectedResult, testName;
      testName = params[0], children = params[1], expectedResult = params[2];
      return describe("when " + testName, function() {
        beforeEach(function() {
          return testedLimiter = React.createElement(ContentLimiter, props, children);
        });
        return it("contains limited children", function() {
          var limited;
          limited = "<div class=\"content\">" + expectedResult + "</div>";
          return ReactDOMServer.renderToStaticMarkup(testedLimiter).should.equal(limited);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=ContentLimiter.spec.js.map