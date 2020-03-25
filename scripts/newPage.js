jQuery(document).ready(function () {
	jQuery('.cropped-image').attr({'src': chrome.extension.getBackgroundPage().Screenshot.imageCrop});
	jQuery('.save').attr({
		'href': chrome.extension.getBackgroundPage().Screenshot.linkBlobFile,
		'download': chrome.extension.getBackgroundPage().Screenshot.localName
	});
	});

