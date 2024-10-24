# Chunithm Tools

For more information please refer to [this page](https://dogeon188.github.io/chuni-tools/?lang=en_US)

若要取得更多資訊，請參考[此頁面](https://dogeon188.github.io/chuni-tools/?lang=zh_TW)

## Acknowledgement

Recently (the year 2024,) I have been struggling for my curriculum, and have no time & passion & energy to maintain this project. Sorry for the inconvenience.

Actually, there are [some functioning forks](https://github.com/Dogeon188/chuni-tools/forks) out there, though I'm not responsible for any of the features they implemented.

Hopefully, I can still make some time to update the const data, but not guaranteed. Perhaps one day I will make improvements to the const data db, document all the workflows in my development, finish the tutorial website, make a better and build some cool new features, etc. Though sadly not now.

If you're interested to contribute, please feel free to fork this project, or even make a PR (if I have time to merge them :P).

## Credits & about this project

This project is a remake of [chuni_new_intl_viewer](https://github.com/Dogeon188/chuni_new_intl_viewer). The old project is deprecated, please don't mind those dirty codes.

This project is heavily inspired by [@kyroslee/chuni_intl_viewer](https://github.com/kyroslee/chuni_intl_viewer) and [@myjian/mai-tools](https://github.com/myjian/mai-tools).

The chart constant data is from [CHUNITHM譜面定数メインフレーム](https://twitter.com/RCMF_chunithm).

## Dev

To initialize the repository, first copy the `./docs` folder and rename to `./build`. (If you know what you're doing, you can also just take advantages of the symlinks.) Then, use

```sh
npm install
```

to initialize the repo. BTW, it's recommended to install Live Server plugin if you're using VSCode.

After that, use the following command to create a dev session:

```sh
npm run dev
```

With the following command, you can build and compile the code to `./docs`, then GitHub Pages will handle the rest.

```sh
npm run build
```
