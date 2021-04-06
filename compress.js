#!/usr/bin/env node

const fs = require('fs')
const { readdir } = require('fs').promises;
const path = require('path')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const { dracoCompressB3dm } = require('./bin/3d-tiles-tools')

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return files.flat().filter(e => e.match(/.*\.(b3dm)$/ig))
}

async function main() {
  if (argv.input) {
    const inputDir = path.resolve('', argv.input)
    const files = await getFiles(inputDir)

    if (files.length === 0) {
      console.log(`no .b3dm files anywhere inside ${inputDir} ... BYE`)
      process.exit(1)
    }
    
    for(let i=0; i<files.length; i++) {
      const file = files[i]
      dracoCompressB3dm(file, argv.quality ? Number(argv.quality) : 100, argv.quality !== undefined)
    }
  } else {
    console.log('gimme an input directory yo')
  }
}

main()