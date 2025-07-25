# Chunithm Tools

For more information please refer to [this page](https://dogeon188.github.io/chuni-tools/?lang=en_US)

若要取得更多資訊，請參考[此頁面](https://dogeon188.github.io/chuni-tools/?lang=zh_TW)

## Credits & about this project

This project is a remake of [chuni_new_intl_viewer](https://github.com/Dogeon188/chuni_new_intl_viewer). The old project is deprecated, please don't mind those dirty codes.

This project is heavily inspired by [@kyroslee/chuni_intl_viewer](https://github.com/kyroslee/chuni_intl_viewer) and [@myjian/mai-tools](https://github.com/myjian/mai-tools).

The chart constant data is from [CHUNITHM譜面定数メインフレーム](https://twitter.com/RCMF_chunithm).

## Dev

To initialize the repository, first copy the `./docs` folder and rename to `./build`. (If you know what you're doing, you can also just take advantages of the symlinks.) Then, use

```sh
bun install
```

to initialize the repo. BTW, it's recommended to install Live Server plugin if you're using VSCode.

After that, use the following command to create a dev session:

```sh
bun dev
```

With the following command, you can build and compile the code to `./docs`, then GitHub Pages will handle the rest.

```sh
bun run build
```
