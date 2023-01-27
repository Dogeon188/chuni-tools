const sveltePreprocessor = require("svelte-preprocess")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { readdirSync } = require("fs")
const path = require("path")

const scriptEntryPoints = {}
readdirSync("./src/scripts")
    .filter((f) => f.endsWith(".ts"))
    .forEach((f) => {
        scriptEntryPoints[path.basename(f, ".ts")] = "./" + path.join("./src/scripts", f)
    })
const styleEntryPoints = {}
readdirSync("./src/common/styles")
    .filter((f) => f.endsWith(".sass"))
    .forEach((f) => {
        styleEntryPoints[path.basename(f, ".sass")] = "./" + path.join("./src/common/styles", f)
    })

module.exports = (env) => {
    const mode = env.development ? "development" : "production"
    const prod = mode === 'production'
    return {
        entry: {
            "record-viewer": "@/record-viewer/main.ts",
            ...scriptEntryPoints,
            ...styleEntryPoints
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                "svelte": path.dirname(require.resolve('svelte/package.json'))
            },
            extensions: ['.js', '.ts', '.svelte'],
            mainFields: ['svelte', 'browser', 'module', 'main']
        },
        output: {
            path: __dirname,
            filename: (pathData) => {
                const chunkName = pathData.chunk.name
                if (scriptEntryPoints[chunkName]) {
                    return path.join("./build/scripts/", chunkName + ".js")
                }
                if (styleEntryPoints[chunkName]) {
                    // workaround for sass building
                    return path.join("./.exclude/style/", chunkName + ".css")
                }
                return path.join("./build/", chunkName, "/main.bundle.js")
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: 'ts-loader',
                },
                {
                    test: /\.svelte$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "svelte-loader",
                        options: {
                            preprocess: [
                                sveltePreprocessor({ sourceMap: false, }),
                            ],
                            compilerOptions: { dev: !prod },
                            emitCss: false,
                            hotReload: !prod
                        }
                    }
                },
                {
                    test: /\.s[ac]ss$/,
                    exclude: /node_modules/,
                    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
                }
            ]
        },
        mode,
        optimization: { minimize: prod },
        devtool: prod ? false : 'source-map',
        plugins: [
            new MiniCssExtractPlugin({
                filename: (pathData) => (path.join("./build/common/styles/", pathData.chunk.name + ".css"))
            })
        ],
        devServer: { hot: true }
    }
}