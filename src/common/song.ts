export enum Difficulty {
    basic = "BAS",
    advanced = "ADV",
    expert = "EXP",
    master = "MAS",
    ultima = "ULT"
}

export const difficulties = Object.values(Difficulty)
export const difficultyWorldsend = "WE"

export enum Genre {
    "P & A" = "0",
    "niconico" = "2",
    "東方Project" = "3",
    "ORIGINAL" = "5",
    "VARIETY" = "6",
    "イロドリ" = "7",
    "ゲキマイ" = "9"
}
export const genres = Object.keys(Genre)
export const genreAll = "99"