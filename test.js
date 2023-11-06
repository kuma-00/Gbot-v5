// run `node index.js` in the terminal
import { unfurl } from 'unfurl.js';
// console.log(`Hello Node.js`, process);
const result = await unfurl('https://x.com/kurianmarron/status/1702165328946749878?s=46');
console.log(result,result.open_graph.images[0])