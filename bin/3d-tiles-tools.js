'use strict';
var Cesium = require('cesium');
var fsExtra = require('fs-extra');
var GltfPipeline = require('gltf-pipeline');
var Promise = require('bluebird');
var zlib = require('zlib');
var extractB3dm = require('../lib/extractB3dm');
var fileExists = require('../lib/fileExists');
var glbToB3dm = require('../lib/glbToB3dm');
var isGzipped = require('../lib/isGzipped');

var zlibGunzip = Promise.promisify(zlib.gunzip);
var zlibGzip = Promise.promisify(zlib.gzip);

var defaultValue = Cesium.defaultValue;
var DeveloperError = Cesium.DeveloperError;

function checkFileOverwritable(file, force) {
    if (force) {
        return Promise.resolve();
    }
    return fileExists(file)
        .then(function (exists) {
            if (exists) {
                throw new DeveloperError('File ' + file + ' already exists. Specify -f or --force to overwrite existing files.');
            }
        });
}

function dracoCompressB3dm(inputPath, compression, decode) {
    var options = decode 
    ? {dracoOptions: true, decodeWebP: true, jpegCompressionRatio: compression} 
    : {dracoOptions: true} 
    var gzipped;
    var b3dm;
    return checkFileOverwritable(inputPath, true)
        .then(function() {
            console.log(`READING ${inputPath}`)
            return fsExtra.readFile(inputPath);
        })
        .then(function(fileBuffer) {
            gzipped = isGzipped(fileBuffer);
            if (isGzipped(fileBuffer)) {
                return zlibGunzip(fileBuffer);
            }
            return fileBuffer;
        })
        .then(function(fileBuffer) {
            b3dm = extractB3dm(fileBuffer);
            return GltfPipeline.processGlb(b3dm.glb, options);
        })
        .then(function({glb}) {
            console.log(`COMPRESSED ${inputPath}`)
            var b3dmBuffer = glbToB3dm(glb, b3dm.featureTable.json, b3dm.featureTable.binary, b3dm.batchTable.json, b3dm.batchTable.binary);
            if (gzipped) {
                return zlibGzip(b3dmBuffer);
            }
            return b3dmBuffer;
        })
        .then(function(buffer) {
            console.log(`WRITING ${inputPath}`)
            return fsExtra.outputFile(inputPath, buffer);
        })
        .catch(function(error) {
           console.log("ERROR", error);
        });
}

module.exports = {
    dracoCompressB3dm
}