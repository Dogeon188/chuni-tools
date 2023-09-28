const sveltePreprocessor = require("svelte-preprocess")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { readdirSync } = require("fs")
const path = require("path")
const { DefinePlugin } = require("webpack")

const scriptEntryPoints = {
    "chuni-tools": "@/scripts/chuni-tools.ts",
    "fetch-all": "@/scripts/fetch-all.ts",
    "idxmap-generate": "@/scripts/idxmap-generate.ts",
    "export-csv": "@/scripts/export-csv.ts",
}

const styleEntryPoints = {}
readdirSync("./src/common/styles")
    .filter((f) => f.endsWith(".sass"))
    .forEach((f) => {
        styleEntryPoints[path.basename(f, ".sass")] = "./" + path.join("./src/common/styles", f)
    })

const mode = process.env.NODE_ENV ? "development" : "production"
const prod = mode === 'production'
const outputPath = prod ? "./docs" : "./build"

module.exports = /** @type { import('webpack').Configuration } */ ({
    entry: {
        "record-viewer": "@/record-viewer/main.ts",
        "record-viewer/manual": "@/record-viewer-manual/main.ts",
        "index-page": "@/index-page/main.ts",
        ...scriptEntryPoints,
        ...styleEntryPoints
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            "svelte": path.dirname(require.resolve('svelte/package.json'))
        },
        extensions: ['.js', '.ts', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main'],
        conditionNames: ['import', 'svelte']
    },
    output: {
        path: __dirname,
        filename: (pathData) => {
            const chunkName = pathData.chunk.name
            if (scriptEntryPoints[chunkName]) {
                return path.join(outputPath, "./scripts/", chunkName + ".js")
            }
            if (styleEntryPoints[chunkName]) {
                // workaround for sass building
                return path.join("./.exclude/style/", chunkName + ".css")
            }
            return path.join(outputPath, chunkName, "/main.bundle.js")
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
            filename: (pathData) => (path.join(outputPath, "./common/styles/", pathData.chunk.name + ".css"))
        }),
        new DefinePlugin({
            "__APP_VERSION__": `"${process.env.npm_package_version}"`,
            "__INTL_VERSION__": `"sunplus"`,
            "__JP_VERSION__": `"sunplus"`
        })
    ],
    devServer: { hot: true }
})