// ==UserScript==
// @name         run chuni-tools on all chunithm-net pages
// @version      2.0
// @description  run chuni-tools on all chunithm-net pages
// @author       evnchn
// @match        https://chunithm-net-eng.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

;(function () {
	'use strict'
	const s = document.createElement('script')
	s.src =
		'https://dogeon188.github.io/chuni-tools/scripts/chuni-tools.js?t=' +
		Math.floor(Date.now() / 60000)
	s.type = 'module'
	document.body.append(s)
})()
