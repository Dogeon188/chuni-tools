import {
	fetchBestRecord,
	fetchPlayerStats,
	fetchPlayHistory,
	fetchRecentRecord,
	fetchSongPlayCount
} from '$lib/chuninet/api';
import type { Difficulty } from '$lib/chuninet/song';
import { chuniNet } from '$lib/chuninet/website';
import { m } from '$lib/paraglide/messages';
import { getCookie, getPostMessageFunction, getScriptBaseUrl } from '$lib/web';

(async function (d: Document) {
	if (!getCookie('_t')) {
		alert(m['chuni_tools.require_login']())
		window.location.href = chuniNet
		return
	}

	function insertOpenerBtn() {
		const b = d.createElement('a')
		b.className = 'chuni-tool-btn'
		b.innerText = m['viewer.press_to_start']()
		b.href = getScriptBaseUrl() + '/record-viewer#best'
		b.target = 'recordViewer-' + Date.now()

		d.querySelector('.clearfix')?.insertAdjacentElement('afterend', b)
	}

	function handleMessageRequest(
		event: CWRMessageEvent<{
			idx?: string
			difficulty?: Difficulty
		}>
	) {
		const { payload, uuid } = event.data
		console.log(
			'%cReceived request for: %c' + payload.target,
			'color: gray',
			'color: white'
		)
		const send = getPostMessageFunction(<WindowProxy>event.source, event.origin)
		let res
		switch (payload.target) {
			case 'bestRecord':
				console.log(
					'%c    Target difficulty: %c' + payload.data!.difficulty,
					'color: gray',
					'color: white'
				)
				res = fetchBestRecord(payload.data!.difficulty)
				break
			case 'playHistory':
				res = fetchPlayHistory()
				break
			case 'recentRecord':
				res = fetchRecentRecord()
				break
			case 'playerStats':
				res = fetchPlayerStats()
				break
			case 'songPlayCount':
				console.log(
					'%c    Target song id: %c' + payload.data!.idx,
					'color: gray',
					'color: white'
				)
				console.log(
					'%c    Target difficulty: %c' + payload.data!.difficulty,
					'color: gray',
					'color: white'
				)
				res = fetchSongPlayCount(payload.data!.idx!, payload.data!.difficulty!)
				break
		}
		send(
			'ping',
			{
				target: payload.target
			},
			uuid
		)
		res?.then((r) => {
			send(
				'respond',
				{
					target: payload.target,
					data: r
				},
				uuid
			)
		}).catch((er: Error) => {
			console.error(er)
			send(
				'respond',
				{
					target: payload.target,
					error: er
				},
				uuid
			)
		})
	}

	function messageHandler(e: CWRMessageEvent<{
        action: 'request',
        idx?: string,
        difficulty?: Difficulty
    }>) {
		switch (e.data.action) {
			case 'request':
				handleMessageRequest(e)
				break
			default:
				break
		}
	}

	try {
		insertOpenerBtn()
		window.addEventListener('message', messageHandler, false)
	} catch (error) {
		alert(m['chuni_tools.require_reload']())
		console.error(error)
	}
})(document)
