# Chunithm Tools

For more information please refer to [this page](https://dogeon188.github.io/chuni-tools/?lang=en_US)

若要取得更多資訊，請參考[此頁面](https://dogeon188.github.io/chuni-tools/?lang=zh_TW)

## Credits & about this project

This project is a remake of [chuni_new_intl_viewer](https://github.com/Dogeon188/chuni_new_intl_viewer). The old project is deprecated, please don't mind those dirty codes.

This project is heavily inspired by [@kyroslee/chuni_intl_viewer](https://github.com/kyroslee/chuni_intl_viewer) and [@myjian/mai-tools](https://github.com/myjian/mai-tools).

The chart constant data is from [CHUNITHM譜面定数メインフレーム](https://twitter.com/RCMF_chunithm).

## Dev

To initialize the repository, first use `bun install` or `npm install` to install the dependencies. After that, use `bun dev` or `npm run dev` to start the development server for the website part.

To build the bookmarklet script, first create a certificate with any tool you like (e.g. [mkcert](https://github.com/FiloSottile/mkcert)) at `./cert`, then run `bun dev:scripts` or `npm run dev:scripts`. This will start a development server hosting from `./build`. Due to technical limitations, you still need to manually build the bookmarklet script separately with `bun build:scripts` or `npm run build:scripts`, which will output the script to `./build/scripts/*.js`.

With `bun run build` or `npm run build`, you can build and compile the code to `./build`, then GitHub Pages will handle the rest.
