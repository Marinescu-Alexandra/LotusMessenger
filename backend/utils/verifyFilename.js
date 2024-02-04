import { join } from 'path';

export function verifyFilename(filename, root) {
    var illegalRe = /[\/\?<>\\:\*\|"]/g;
    var controlRe = /[\x00-\x1f\x80-\x9f]/g;
    var reservedRe = /^\.+$/;
    var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
    var windowsTrailingRe = /[\. ]+$/;

    var sanitizedFilename = filename
        .replace(illegalRe, "")
        .replace(controlRe, "")
        .replace(reservedRe, "")
        .replace(windowsReservedRe, "")
        .replace(windowsTrailingRe, "");
    
    const newPath = join(`${root}\\${sanitizedFilename}`)

    if (newPath.indexOf(root) !== 0) {
        return false
    }

    return sanitizedFilename === filename
}

