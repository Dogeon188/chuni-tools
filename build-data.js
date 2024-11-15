const axios = require("axios").default
const fs = require("fs")

const versionName = "luminousplus"
const fileName = `docs/data/song-const/${versionName}.json`
const genres = {
    "POPS&ANIME": 0,
    "niconico": 2,
    "東方Project": 3,
    "ORIGINAL": 5,
    "VARIETY": 6,
    "イロドリミドリ": 7,
    "ゲキマイ": 9,
}

let oldData = JSON.parse(fs.readFileSync(fileName))

// start from 10.0
let musicData = {
    // insert temporary data here
}

const logger = fs.createWriteStream("log.md")
const log = (m = "") => { logger.write(m + "\n") }

log("# Chunithm Viewer - Song Data Changelog\n")

function parseData(rawData) {
    let errors = { duplicates: [], unknownConsts: [] }
    for (const song of rawData) {
        if (musicData[song.meta.title] !== undefined) {
            errors.duplicates.push(song.meta.title)
            continue
        }
        if (song.meta.genre == "WORLD'S END") continue
        musicData[song.meta.title] = {}
        for (const diff in song.data) {
            if (song.data[diff].const === 0) {
                if (song.data[diff].is_const_unknown && song.data[diff].level > 9.5) {
                    errors.unknownConsts.push([song.meta.title, diff, song.data[diff].level])
                    musicData[song.meta.title].uncertain ??= []
                    musicData[song.meta.title].uncertain.push(diff)
                }
                musicData[song.meta.title][diff] = song.data[diff].level
            } else {
                musicData[song.meta.title][diff] = song.data[diff].const
            }
        }
        if (genres[song.meta.genre] !== undefined) {
            musicData[song.meta.title].genre = genres[song.meta.genre]
        } else {
            console.log("Unknown genre: " + song.meta.genre)
            musicData[song.meta.title].genre = song.meta.genre
        }
    }

    if (errors.unknownConsts.length || errors.duplicates.length) {
        log("## Errors\n")
        if (errors.duplicates.length) {
            log(`### Duplicated songs\n`)
            errors.duplicates.forEach(s => { log("- " + s) })
            log()
        }
        if (errors.unknownConsts.length) {
            log(`### Songs w/ unknown const\n`)
            log("Name|Diff.|Level")
            log("----|-----|-----")
            errors.unknownConsts.forEach(s => { log(`${s[0]}|\`${s[1]}\`|\`${s[2]}\``) })
            log()
        }
    }
}

function compareData() {
    let newSongs = {}
    let changedSongs = {}

    for (let i in musicData) {
        if (!oldData.hasOwnProperty(i)) {
            newSongs[i] = musicData[i]
        } else {
            for (let d in oldData[i]) {
                if (d == "uncertain") continue
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

    let hasNewSong = Object.keys(newSongs).length > 0,
        hasChangedSong = Object.keys(changedSongs).length > 0,
        hasDeletedSong = Object.keys(oldData).length > 0
    if (hasChangedSong || hasNewSong || hasDeletedSong) {
        log("## Changes")
        if (hasNewSong) {
            log()
            log("### New songs\n")
            log("Name|BAS|ADV|EXP|MAS|ULT")
            log("----|---|---|---|---|---")
            for (let i in newSongs) {
                log(`${i}|\`${newSongs[i].BAS}\`|\`${newSongs[i].ADV}\`|\`${newSongs[i].EXP}\`|\`${newSongs[i].MAS}\`|${newSongs[i].ULT ? `\`${newSongs[i].ULT}\`` : ""}`)
            }
        }
        if (hasChangedSong) {
            log()
            log("### Changed songs\n")
            log("Name|Diff.|Old|New")
            log("----|-----|---|---")
            for (let i in changedSongs) {
                for (let d in changedSongs[i]) {
                    log(`${i}|\`${d}\`|\`${changedSongs[i][d].old}\`|\`${changedSongs[i][d].new}\``)
                }
            }
        }
        if (hasDeletedSong) {
            log()
            log("### Deleted songs\n")
            log("Name|BAS|ADV|EXP|MAS|ULT")
            log("----|---|---|---|---|---")
            for (let i in oldData) {
                log(`${i}|\`${oldData[i].BAS}\`|\`${oldData[i].ADV}\`|\`${oldData[i].EXP}\`|\`${oldData[i].MAS}\`|\`${oldData[i].ULT ?? ""}\``)
            }
        }
    }
}

axios.get("https://api.chunirec.net/2.0/music/showall.json?region=jp2&token=" + process.env.CHUNIREC_TOKEN).then(res => {
    console.log("Fetched song data. Now parsing it...")
    parseData(res.data)
    console.log("Parsed data.")
    console.log("Comparing data difference...")
    compareData()
    fs.writeFileSync(fileName, JSON.stringify(musicData))
    console.log("Stored data to file.")
})