const fs = require('fs');
const pkgfile = {
    "name": "@floatsheep/fsl-blog",
    "version": "2.0.0-"+new Date().getTime()
}
fs.writeFile('./public/package.json', JSON.stringify(pkgfile), function (err) {
    if (err) {
        console.log(err);
    }
    console.log("Package.json file was created successfully.");
})