#! /usr/bin/env node

"use strict";

const fetch = require('node-fetch');
const argv = require('yargs/yargs')(process.argv.slice(2))
    .usage(
        `
Usage - 1(POSIX based env):        ./$0 [option] -w WORD

Usage - 2(Windows based env):      node $0 [option] -w WORD


argument meanings:

[-w WORD] or [--word WORD] has WORD to be replaced with the word you want to access this thesaurus with.
[option] argument has many options.
`
    )
    .options({
        // creating options that will be used as options in command line.
        'w': {
            alias: 'word',
            demandOption: true,
            type: 'string',
            describe: 'Option for the word to be entered to search the thesaurus'
        },
        's': {
            alias: 'synonym',
            demandOption: false,
            type: 'boolean',
            describe: 'Option to find the word synonyms'
        },
        'a': {
            alias: 'antonym',
            demandOption: false,
            type: 'boolean',
            describe: 'Option to find the word antonyms'
        },
        'o': {
            alias: 'sound',
            demandOption: false,
            type: 'boolean',
            describe: 'Option to find the similar sounding words'
        },
        'p': {
            alias: 'spell',
            demandOption: false,
            type: 'boolean',
            describe: 'Option to find the words with similar spellings'
        },
        'r': {
            alias: 'rhyme',
            demandOption: false,
            type: 'boolean',
            describe: 'Option to find the rhyming words'
        },
        'm': {
            alias: 'maximum',
            demandOption: false,
            default: 10,
            type: 'number',
            describe: `Option to limit the maximum number of words in output. 
            If more than 50, defaults to 10.`
        },

    })
    .example('(POSIX env):          $ ./main.js --syn -w hope')
    .example('(Windows env):        > node main.js --syn -w hope')
    .version('1.0.0')
    .argv

// Limit the number of output fetched and returned
checkAndLimitMax(argv);

const url = `https://api.datamuse.com/words?&max=${argv.m}`

/***************************** */

// fetches the thesaurus based the word query and requirement
function fetcher(queryString) {
    // TODO: add logic to fetch the query string
    const finalSearchString = url + queryString;
    fetch(finalSearchString)
        .then(res => res.json())
        .then(displayWords)
        .catch(error)
}

function findSynonyms() {
    const queryString = `&rel_syn=${argv.w}`
    fetcher(queryString)
}

function findAntonyms() {
    // TODO: add logic to find word antonyms
    const queryString = `&rel_ant=${argv.w}`
    fetcher(queryString)
}

function findSimilarSounds(word) {
    // TODO: add logic to find similar sounding words
    const queryString = `&sl=${argv.w}`
    fetcher(queryString)

}

function findSimilarSpells(word) {
    // TODO: add logic to find similar spelled words
    const queryString = `&sp=${argv.w}`
    fetcher(queryString)
}

function findRhymingWords(word) {
    // TODO: add logic to find Rhyming words
    const queryString = `&rel_rhy=${argv.w}`
    fetcher(queryString)
}

function checkAndLimitMax(argv) {
    if (argv.m > 50) {
        argv.m = 10;
    }
}

// Iterates through the array and prints in the console
function displayWords(array) {
    console.log(`
 ___________________
|                   |
|*******************|
|      OUTPUT       |
|*******************|
|___________________|

    `);
    if (array.length === 0) {
        console.log('▶ The word you specified was not found.\n▶ Try again with another word?')
    } else {
        for (let word of array) {
            console.log(`▶  ${word.word}`)
        }
    }
}

function error(msg, includeHelp = false) {
    console.error(msg);
    if (includeHelp) {
        console.log();
        console.log('print help using --help option to learn more about usage');
    }
}

// ********************************** 
// main execution IIFE
(function() {
    if (argv.s) {
        findSynonyms();
    } else if (argv.a) {
        findAntonyms();
    } else if (argv.o) {
        findSimilarSounds();
    } else if (argv.p) {
        findSimilarSpells();
    } else if (argv.r) {
        findRhymingWords();
    } else {
        error('Improper usage of thesaurus', true)
    }
})();