# Chunithm Tools

For more information please refer to [this page](https://dogeon188.github.io/chuni-tools/?lang=en_US)

若要取得更多資訊，請參考[此頁面](https://dogeon188.github.io/chuni-tools/?lang=zh_TW)

## Credits & about this project

This project is a remake of [chuni_new_intl_viewer](https://github.com/Dogeon188/chuni_new_intl_viewer). The old project is deprecated, please don't mind those dirty codes.

This project is heavily inspired by [@kyroslee/chuni_intl_viewer](https://github.com/kyroslee/chuni_intl_viewer) and [@myjian/mai-tools](https://github.com/myjian/mai-tools).

The chart constant data is from [CHUNITHM譜面定数メインフレーム](https://twitter.com/RCMF_chunithm).

## Dev

**Setup https certificate** <br>
chuni-tools can only be used with https. Install a tool such as [mkcert](https://github.com/FiloSottile/mkcert) and run the following.
```sh
mkdir .cert
cd .cert
mkcert -cert-file cert.pem -key-file key.pem localhost
cd ..
```

**Init Repo**
```sh
npm install
# OR
bun install
```
**Build scripts** <br>
Due to technical limitations, you still need to manually build the bookmarklet script separately with the following command
```sh
npm run build:scripts
# OR 
bun build:scripts
```
The scripts will be generated at `./build/scripts/`.

**Run Dev Environment**
```
npm run dev
# OR
bun dev
```
chuni-tools should be running on localhost and can be accessed at `https://localhost:5173`. You may get a warning about insecure certificate, you can safely ignore it.

**Build Production Environment**
```sh
npm run build
# OR
bun run build
```
then GitHub Pages will handle the rest.
