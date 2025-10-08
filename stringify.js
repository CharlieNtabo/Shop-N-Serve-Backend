import fs from "fs";

const data = JSON.parse(fs.readFileSync("./serviceAccount.json", "utf8"));
console.log(JSON.stringify(data));
