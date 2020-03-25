var Screenshot = {

	getScreenshot: function () {
		Screenshot.getDevicePixelRatio();
		chrome.tabs.captureVisibleTab(null, {}, function (image) {
			Screenshot.currentImage = image;
		});
	},
	openEditorPage: function () {
		this.preCropImage();
		chrome.tabs.create({'url': chrome.extension.getURL('newPage.html')}, function (tab) {
			Screenshot.cropImage();
		});
	},
	preCropImage: function () {
		this.virtualImage = new Image; 
		this.virtualCanvas = document.createElement('canvas');
		this.virtualCanvas.width = this.imageObg.w * this.devicePixelRatio;
		this.virtualCanvas.height = this.imageObg.h * this.devicePixelRatio;
		this.virtualImage.src = this.currentImage;
	},
	cropImage: function () {
		var x = 0 - this.imageObg.x;
		var y = 0 - this.imageObg.y;
		this.virtualCanvas.getContext('2d').drawImage(this.virtualImage, x * this.devicePixelRatio, y * this.devicePixelRatio, this.virtualImage.width, this.virtualImage.height)
		this.virtualCanvas.toBlob(function (blob) {
			Screenshot.imageBlop = blob;
			Screenshot.linkBlobFile = window.window.URL.createObjectURL(blob);
		}, {type: 'image/png', encoding: 'utf-8'});
		this.imageCrop = this.virtualCanvas.toDataURL("image/png");
	},
    localizateStrings: function () {
		jQuery('.localed_string').each(function () {
			if (jQuery(this).data('l') != undefined)
				jQuery(this).text(chrome.i18n.getMessag(jQuery(this).data('l')));
		});
	},
	getDevicePixelRatio: function () {
		this.devicePixelRatio = window.devicePixelRatio;
	},
	getScreenshotLocalName: function () {
		var date = new Date();
		return date.getDate() + '_' + date.getHours() + '_' + date.getMinutes() +  '.png';
	}
}
chrome.browserAction.onClicked.addListener(function (tab) {
	Screenshot.getScreenshot();
	setTimeout(function () {
		chrome.tabs.executeScript(null, {code: "window.overlay_toggle();"});
	}, 100);
});
chrome.extension.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.screenshotCoords != undefined) {
			Screenshot.imageObg = request.screenshotCoords;
			Screenshot.localName = Screenshot.getScreenshotLocalName();
			Screenshot.openEditorPage();
		}
	}
);