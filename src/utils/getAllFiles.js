const fs = require('fs');
const path = require('path');

module.exports = (directory, foldersOnly = false) => {
    let fileNames = [];

    const files = fs.readdirSync(directory, {withFileTypes: true});

    for(const file of files) {
        const filepath = path.join(directory, file.name);

        if(foldersOnly){
            if(file.isDirectory()){
                fileNames.push(filepath);
            }
        } else {
            if(file.isFile()){
                fileNames.push(filepath)
            }
        }
    }

    return fileNames;
}