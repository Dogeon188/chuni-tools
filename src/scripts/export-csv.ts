import { fetchBestRecord } from '$lib/chuninet/fetch';
import { parseRecord } from '$lib/chuninet/record';
import { difficulties } from '$lib/chuninet/song';
import { m } from '$lib/paraglide/messages';
import { chuniNet, getCookie, getScriptBaseUrl } from '$lib/web';

(async function (d: Document) {
	if (!getCookie('_t')) {
		alert(m['export_csv.require_login']())
		window.location.href = chuniNet
		return
	}

    const b = d.createElement('button')
	function insertDownloadBtn() {
        b.className = 'chuni-tool-btn'
		b.innerText = m['export_csv.press_to_download']()

		
        d.querySelector('.clearfix')?.insertAdjacentElement('afterend', b)
		
		return b
	}

	try {
		const b = insertDownloadBtn()
		b.addEventListener('click', async () => {
			const records = [] as BestRecord[]
			for (const diff of difficulties) {
				b.innerText = m['export_csv.downloading']({ diff })
				const best = (await fetchBestRecord(diff)).filter((r) => r.score >= 0)
				Array.prototype.push.apply(records, best)
			}

			const parsed = parseRecord(
				records,
				await fetch(
					getScriptBaseUrl() + `/data/song-const/${__INTL_VERSION__}.json`
				).then(async (d) => await d.json())
			)

			const rows = parsed.map(
				(r) =>
					`"${r.title.replace(/"/g, '""')}",${r.difficulty},${r.const},${r.score},${r.rating},${r.op}`
			)
			b.innerText = m['export_csv.finished']()

			const dlLink = document.createElement('a')
			dlLink.href =
				'data:text/plain;charset=utf-8,' +
				encodeURIComponent(
					'title,difficulty,const,score,rating,op\n' + rows.join('\n')
				)
			dlLink.target = '_blank'
			dlLink.download = `chunithm_record_${new Date().toISOString()}.csv`

			dlLink.style.display = 'none'
			d.body.appendChild(dlLink)

			dlLink.click()

			d.body.removeChild(dlLink)

			setTimeout(() => {
				b.innerText = m['export_csv.press_to_download']()
			}, 3000)
		})
	} catch (error) {
		alert(m['export_csv.require_reload']())
		console.log(error)
	}
})(document)
