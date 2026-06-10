//each time this script is run, it will increment the patch version in version.txt by 1, and then write the new version back to version.txt
import fs from "fs";
import path from "path";

const versionFilePath = path.join("./version.txt");

let random = crypto.randomUUID();

fs.writeFileSync(versionFilePath, random, "utf-8");
console.log(`Version incremented to: ${random}`);
