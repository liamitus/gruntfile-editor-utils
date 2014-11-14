/**
 * test/test.js
 *
 * Author:  Liam Howell <lhowell@mobiquityinc.com>
 * Since:   11-12-2014
 */

var assert = require("assert");
var gruntfileEditorUtils = require("../index");

var simple_sample = [
    "'use strict';",
    "module.exports = function (grunt) {",
    "\tvar someVar = 9",
    "\tgrunt.initConfig({",
    "\t\tsomething: {",
    "\t\t\tx: y",
    "\t\t},",
    "\t\tfoo: {",
    "\t\t\tbar: 'baz'",
    "\t\t}",
    "\t});",
    "};"
].join("\n");

var nested_sample = [
    "'use strict';",
    "module.exports = function (grunt) {",
    "\tgrunt.initConfig({",
    "\t\tfoo: {",
    "\t\t\tbar: {",
    "\t\t\t\tbaz: {",
    "\t\t\t\t\tx: 3",
    "\t\t\t\t}",
    "\t\t\t}",
    "\t\t}",
    "\t});",
    "};"
].join("\n");

var multiple_same_level_sample = [
    "'use strict';",
    "module.exports = function (grunt) {",
    "\tgrunt.initConfig({",
    "\t\tfoo: {",
    "\t\t\tbar: 1",
    "\t\t},",
    "\t\tfoo: {",
    "\t\t\tbaz: 2",
    "\t\t},",
    "\t});",
    "};"
].join("\n");

var multiple_same_level_same_key_sample = [
    "'use strict';",
    "module.exports = function (grunt) {",
    "\tgrunt.initConfig({",
    "\t\tfoo: {",
    "\t\t\tbar: 1",
    "\t\t},",
    "\t\tfoo: {",
    "\t\t\tbar: 2",
    "\t\t},",
    "\t});",
    "};"
].join("\n");

describe("gruntfileEditorUtils", function () {
    describe("#extractJSON()", function () {
        it("should return \"{bar: \'baz\'}\" when given \"foo\" to extract", function () {
            assert.equal(gruntfileEditorUtils.extractJSON(simple_sample, "foo"), "{\"bar\":\"baz\"}");
        });
        it("should return \"\" when nothing is found matching the query", function () {
            assert.equal(gruntfileEditorUtils.extractJSON(simple_sample, "bacon"), "");
        });
        it("should return \"{bar: {baz: {x: 3}}}\" when given \"foo\" to extract", function () {
            assert.equal(gruntfileEditorUtils.extractJSON(nested_sample, "foo"), "{\"bar\":{\"baz\":{\"x\":3}}}");
        });
        it("should combine multiple objects of the same name if they are in the same curly braces level", function () {
            assert.equal(gruntfileEditorUtils.extractJSON(multiple_same_level_sample, "foo"), "{\"bar\":1,\"baz\":2}");
        });
        it("should choose the first object if multiple are found with the same name and contents", function () {
            assert.equal(gruntfileEditorUtils.extractJSON(multiple_same_level_same_key_sample, "foo"), "{\"bar\":1}");
        });
    })
});

