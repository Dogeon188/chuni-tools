import { m } from '$lib/paraglide/messages';
import { chuniNet, chuniNetBase, getScriptBaseUrl } from '$lib/web';

// if run the script again, paraglide will fail to create new variable
// -> generate uncaught syntax error
// -> can use this to prevent running the script again
window.onerror = () => {
	alert(m['chuni_tools.already_run']())
}

(function (d: Document, w: Window & { chuniTools: boolean }) {
	// just in case the above method fails
	if (w.chuniTools) {
		alert(m['chuni_tools.already_run']())
		return
	}
	w.chuniTools = true

	if (w.location.hostname !== chuniNetBase) {
		alert(m['chuni_tools.wrong_place']({chuniNetUrl: chuniNet}))
		w.location.href = chuniNet
		return
	}

	function appendScript(script: string) {
		const s = d.createElement('script')
		s.src = `${getScriptBaseUrl()}/scripts/${script}.js`
		d.body.append(s)
	}

	const path = d.location.pathname
	if (path.indexOf('/mobile/home/userOption/updateUserName') != -1) {
		appendScript('idxmap-generate')
	} else if (path.indexOf('/mobile/record/musicGenre') != -1) {
		appendScript('export-csv')
	} else {
		// usually `/mobile/home`
		appendScript('fetch-all')
	}
})(document, window as unknown as Window & { chuniTools: boolean })
