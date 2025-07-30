import { m } from '$lib/paraglide/messages'
import { isMobile } from '$lib/web'
import { toBlob } from 'html-to-image'

const filename = 'chunithm_b40.png'

export async function saveResultAsPicture() {
	const resultNode = document.getElementById('main-content')

	if (resultNode == null)
		return alert(m['viewer.menu.save_error']({ error: 'resultNode is null' }))

	const n = <HTMLElement>resultNode?.cloneNode(true)

	n.id = 'copied-main'
    n.classList.add('p-4')
	n.querySelectorAll('tbody tr:nth-child(n+41)').forEach((tr) => {
		tr.remove()
	})

	resultNode?.parentElement?.appendChild(n)

	toBlob(n, {
		backgroundColor: window.getComputedStyle(document.body).backgroundColor
	})
		.then(async (blob) => {
			n.remove()
			if (blob == null) {
				alert(m['viewer.menu.save_error']({ error: 'result blob is null' }))
				return
			}
			if (isMobile()) {
				const f = new File([blob], filename, { type: blob.type })
				if (navigator?.canShare({ files: [f] })) {
					navigator.share({ files: [f] }).catch(console.log)
				}
			} else {
				const a = document.createElement('a')
				a.href = window.URL.createObjectURL(blob)
				a.download = filename
				a.click()
			}
		})
		.catch((err) => {
			alert(m['viewer.menu.save_error']({ error: err }))
		})
}
