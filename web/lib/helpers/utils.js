exports.md5 = function(string) {
	return require('crypto').createHash('md5').update(String(string)).digest('hex');
}

exports.trim = function(string) {
    return string.replace(/^\s*|\s*$/, '')
}
