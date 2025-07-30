import axios from 'axios'
import fs from 'fs'
import { Genre, versionId } from './src/lib/chuninet/song'

const versionName = 'xverse'
const fileName = `static/data/song-const/${versionName}.json`

// uncertain start from 10.0
const musicData = {
	// insert temporary data here
}

const _releaseDate = {
	'2015-07-16': 'CHUNITHM',
	'2016-02-04': 'CHUNITHM+',
	'2016-08-25': 'AIR',
	'2017-02-09': 'AIR+',
	'2017-08-24': 'STAR',
	'2018-03-08': 'STAR+',
	'2018-10-25': 'AMAZON',
	'2019-04-11': 'AMAZON+',
	'2019-10-24': 'CRYSTAL',
	'2020-07-16': 'CRYSTAL+',
	'2021-01-21': 'PARADISE',
	'2021-05-13': 'PARADISE LOST',
	'2021-11-04': 'NEW',
	'2022-04-14': 'NEW+',
	'2022-10-13': 'SUN',
	'2023-05-11': 'SUN+',
	'2023-12-14': 'LUMINOUS',
	'2024-06-20': 'LUMINOUS+',
	'2024-12-12': 'VERSE',
	'2025-07-16': 'XVERSE'
}

const releaseDates = Object.entries(_releaseDate).map(
	([k, v]) => [Date.parse(k), v] as [number, string]
)

const oldData = JSON.parse(fs.readFileSync(fileName, 'utf-8'))

const logger = fs.createWriteStream('log.md')
const log = (m = '') => {
	logger.write(m + '\n')
}

log('# Chunithm Viewer - Song Data Changelog\n')

function parseData(rawData) {
	const errors = {
		duplicates: [] as string[],
		unknownConsts: [] as [string, string, number][]
	}

	for (const song of rawData) {
		if (musicData[song.meta.title] !== undefined) {
			errors.duplicates.push(song.meta.title)
			continue
		}
		if (song.meta.genre == "WORLD'S END") continue
		musicData[song.meta.title] = {}
		// song const
		for (const diff in song.data) {
			if (song.data[diff].const === 0) {
				// uncertain const
				if (song.data[diff].is_const_unknown && song.data[diff].level > 9.5) {
					errors.unknownConsts.push([
						song.meta.title,
						diff,
						song.data[diff].level
					])
					musicData[song.meta.title].uncertain ??= []
					musicData[song.meta.title].uncertain.push(diff)
				}
				// normal const
				musicData[song.meta.title][diff] = song.data[diff].level
			} else {
				musicData[song.meta.title][diff] = song.data[diff].const
			}
		}
		// genre
		if (Genre[song.meta.genre] !== undefined) {
			musicData[song.meta.title].genre = Number(Genre[song.meta.genre])
		} else {
			console.log('Unknown genre: ' + song.meta.genre)
			musicData[song.meta.title].genre = song.meta.genre
		}
		// version
		const songReleaseDate = Date.parse(song.meta.release)
		let latestRelease = 'UNKNOWN'
		for (const [date, version] of releaseDates) {
			if (date <= songReleaseDate) {
				latestRelease = version
			}
		}
		musicData[song.meta.title].version = versionId[latestRelease]
	}

	if (errors.unknownConsts.length || errors.duplicates.length) {
		log('## Errors\n')
		if (errors.duplicates.length) {
			log(`### Duplicated songs\n`)
			errors.duplicates.forEach((s) => {
				log('- ' + s)
			})
			log()
		}
		if (errors.unknownConsts.length) {
			log(`### Songs w/ unknown const\n`)
			log('Name|Diff.|Level')
			log('----|-----|-----')
			errors.unknownConsts.forEach((s) => {
				log(`${s[0]}|\`${s[1]}\`|\`${s[2]}\``)
			})
			log()
		}
	}
}

function compareData() {
	const newSongs = {}
	const changedSongs = {}

	for (const i in musicData) {
		if (!Object.prototype.hasOwnProperty.call(oldData, i)) {
			newSongs[i] = musicData[i]
		} else {
			for (const d in oldData[i]) {
				if (d == 'uncertain') continue
				if (oldData[i][d] !== musicData[i][d]) {
					changedSongs[i] = changedSongs[i] || {}
					changedSongs[i][d] = {
						old: oldData[i][d],
						new: musicData[i][d]
					}
				}
			}
			delete oldData[i]
		}
	}

	const hasNewSong = Object.keys(newSongs).length > 0,
		hasChangedSong = Object.keys(changedSongs).length > 0,
		hasDeletedSong = Object.keys(oldData).length > 0
	if (hasChangedSong || hasNewSong || hasDeletedSong) {
		log('## Changes')
		if (hasNewSong) {
			log()
			log('### New songs\n')
			log('Name|BAS|ADV|EXP|MAS|ULT')
			log('----|---|---|---|---|---')
			for (const i in newSongs) {
				log(
					`${i}|\`${newSongs[i].BAS}\`|\`${newSongs[i].ADV}\`|\`${
						newSongs[i].EXP
					}\`|\`${newSongs[i].MAS}\`|${
						newSongs[i].ULT ? `\`${newSongs[i].ULT}\`` : ''
					}`
				)
			}
		}
		if (hasChangedSong) {
			log()
			log('### Changed songs\n')
			log('Name|Diff.|Old|New')
			log('----|-----|---|---')
			for (const i in changedSongs) {
				for (const d in changedSongs[i]) {
					log(
						`${i}|\`${d}\`|\`${changedSongs[i][d].old}\`|\`${changedSongs[i][d].new}\``
					)
				}
			}
		}
		if (hasDeletedSong) {
			log()
			log('### Deleted songs\n')
			log('Name|BAS|ADV|EXP|MAS|ULT')
			log('----|---|---|---|---|---')
			for (const i in oldData) {
				log(
					`${i}|\`${oldData[i].BAS}\`|\`${oldData[i].ADV}\`|\`${
						oldData[i].EXP
					}\`|\`${oldData[i].MAS}\`|\`${oldData[i].ULT ?? ''}\``
				)
			}
		}
	}
}

axios
	.get(
		'https://api.chunirec.net/2.0/music/showall.json?region=jp2&token=' +
			process.env.CHUNIREC_TOKEN
	)
	.then((res) => {
		console.log('Fetched song data. Now parsing it...')
		parseData(res.data)
		console.log('Parsed data.')
		console.log('Comparing data difference...')
		compareData()
		fs.writeFileSync(fileName, JSON.stringify(musicData))
		console.log('Stored data to file.')
	})
