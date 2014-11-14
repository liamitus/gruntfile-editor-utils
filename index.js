/**
 * Holds utility methods for interacting with an existing Gruntfile.js.
 *
 * Author:	Liam Howell <lhowell@mobiquityinc.com>
 * Since:	11-13-2014
 */

var _ = require("lodash");

/**
 * Accepts an invalid JSON string and makes it valid.
 * Example:
 * {foo: "bar"} ---becomes--> {"foo": "bar"}
 * Returns the valid form of the given string.
 */
function makeValidJSON(invalidJSON) {
    var jsontemp = invalidJSON.replace((/([\w]+)(:)/g), "\"$1\"$2");
    return jsontemp.replace((/'/g), "\"");
}

module.exports = {
    /**
     * Extracts the given config from the given gruntfile String.
     * Returns the value of the key extracted (typically an object).
     * Accepts an optional boolean argument to return the results as an array if
     * there are multiple found. Default is false.
     */
	extractJSON: function (gruntfileString, configToExtract, returnArrayIfMultiple) {
        // Remove tabs and split lines by newline character.
        var lines = gruntfileString.replace(/\t/g, "").split(/\r\n|\r|\n/g);
        var withinStringToExtract = false;
        var withinFirstLineOfStringToExtract = false;
        var curlyBracesDepth = 0;
        var line;
        var results = [""];
        var resultCounter = 0;
        var openCurlyBraces;
        var i;
        // Iterate through each line.
        for (i = 0; i < lines.length; i++) {
            line = lines[i];
            // Check if the current line contains the string we are searching for.
            if (line.indexOf(configToExtract + ":") > -1) {
                withinStringToExtract = true;
                withinFirstLineOfStringToExtract = true;
            }
            openCurlyBraces = line.split("{");
            if (withinStringToExtract) {
                curlyBracesDepth += openCurlyBraces.length - 1;
                if (curlyBracesDepth > 0) {
                    if (withinFirstLineOfStringToExtract) {
                        line = line.replace(openCurlyBraces[0], "");
                    }
                    closeCurlyBraces = line.split("}");
                    //console.log(line);
                    if (!results[resultCounter]) {
                        results[resultCounter] = ""
                    }
                    results[resultCounter] += line;
                    //console.log(results);
                }
                curlyBracesDepth -= line.split("}").length - 1;
                if (curlyBracesDepth < 1) {
                    if (returnArrayIfMultiple) {
                        break;
                    }
                    resultCounter++;
                    withinStringToExtract = false;
                }
            }
            withinFirstLineOfStringToExtract = false;
        }
        // Remove trailing commas
        results = results.map(function (item) {
            return item.replace(/,$/, "");
        });
        
        if (!returnArrayIfMultiple) {
            // Combine the results if they are not identical
            var obj,
                validJSON,
                objKeys,
                newResultKeys,
                differentKeys,
                newResult,
                j;
            for (i = 0; i < results.length; i++) {
                if (!results[i]) {
                    continue;
                }
                validJSON = makeValidJSON(results[i]);
                obj = JSON.parse(validJSON) || {}; 
                objKeys = _.keys(obj);
                newResultKeys = _.keys(newResult);
                differentKeys = _.difference(objKeys, newResultKeys);
                if (differentKeys.length > 0) {
                    newResult = _.merge(newResult || {}, obj);
                }
            }
            if (newResult) {
                results = [];
                results[0] = newResult;
            }
        }

        // Stringify results.
        results = results.map(function (item) {
            if (item) {
                item = JSON.stringify(item);
            }
            return item;
        });

        if (returnArrayIfMultiple) {
            return results;
        } else if (results[0]) {
            return results[0];
        } else {
            return "";
        }
    }
};
