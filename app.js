const request = require('request');
const cherio = require('cheerio');
const table = require('cli-table');
const readline = require('readline');
const cTable = require('console.table');
const ellipsis = require('text-ellipsis');
const fs = require('fs')

let category, subReddit, og, page, posts;
let arr = [];
var x = 0;
let pages = 1;


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var logFile = fs.createWriteStream('logs.txt', {});


rl.question('What SubReddit Would You Like To Scrape? ', (answer) => {
    subReddit = answer;
    rl.question('Choose a Category (hot, new, top, rising, controversial) ', (answer) => {
        category = answer;
            exec();
        });
    });


function exec() {
    console.log('\n\n');
    page = 1;
    var posts = 25*page;
    og = 'https://old.reddit.com/r/' + subReddit + '/' + category + '/'
    for (var i = 0; j = pages, i < j; i++) {
        request(og, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                var $ = cherio.load(body);
                $('div[data-type="link"]').each(function () {
                    var title = $(this).find('a.title').text();
                    var link = $(this).find('a.title').attr('href');
                    var comments = $(this).find('li.first a').text();
                    var number = $(this).find('span.rank').text();
                    var y = number;
                    x++
                    var remainder = x % y;
                    if (comments.startsWith('c')) {
                        comments = '0'
                    } else {
                        comments = comments.split(' ')[0]
                    }

                    if (y = 25*page) 
                    {
                        page++
                        newPosts = 25*page;
                        og = 'https://old.reddit.com/r/' + subReddit + '/' + category + '/' + '?count=' + newPosts
                        console.log(newPosts)
                    } 
                    // took it out because its whack but this is if you want to number each post 
                    // var tag = parseInt(number);
                    
                    if (link.startsWith('/r/')) {
                        arr.push({
                            'Title': ellipsis(title, 130),
                            'Link': 'https://reddit.com' + link,
                            'Comments': comments,
                        });
                    }
                    logFile.write('');
                });
            }
            console.table(arr);
            var total = x - (2*pages);
            if (!err) {
                console.log('successfully scraped ' + total + ' posts in /r/' + subReddit + ' :)')
            } else {
                console.log('there was an error!')
            }
        });
    }
}