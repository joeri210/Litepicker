const webpack = require('webpack');
const path = require('path');
const banner = require('./banner.cjs'); // Ensure this is .cjs

const PROJECT_ROOT = path.join(__dirname, '..');

const targets = ['var', 'commonjs2', 'umd', 'amd', 'module'];

const multiconfig = targets.map((target) => {
    
    let fileName = '';
    switch (target) {
        case 'var':
            fileName = '.js';
            break;
        case 'module':
            fileName = '.esm.js'; 
            break;
        default:
            fileName = `.${target}.js`;
            break;
    }

    const outputConfig = {
        path: path.join(__dirname, '../dist'),
        filename: 'litepicker' + fileName,
        library: 'Litepicker', 
        libraryTarget: target
    }

    if (target === 'var') {
        outputConfig.libraryExport = 'Litepicker';
    }

    if (target === 'umd') {
        outputConfig.umdNamedDefine = true;
    }
    
    // 3. Create the base config object
    const config = {
        entry: path.join(__dirname, '../src/index.ts'),
        output: outputConfig,
        
        // --- START: LOGIC MOVED FROM original forEach LOOP ---
        module: {
            rules: [
                {
                    exclude: /node_modules/,
                    test: /\.ts?$/,
                    loader: 'ts-loader',
                },
                // ... All your SCSS/CSS loaders remain unchanged
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'style-loader',
                            options: {
                                insert: function insertAtTop(element) {
                                    var parent = document.querySelector('head');
                                    var lastInsertedElement = window._lastElementInsertedByStyleLoader;

                                    if (!window.disableLitepickerStyles) {
                                        if (!lastInsertedElement) {
                                            parent.insertBefore(element, parent.firstChild);
                                        } else if (lastInsertedElement.nextSibling) {
                                            parent.insertBefore(element, lastInsertedElement.nextSibling);
                                        } else {
                                            parent.appendChild(element);
                                        }

                                        window._lastElementInsertedByStyleLoader = element;
                                    }
                                },
                            },
                        },
                        {
                            loader: 'dts-css-modules-loader',
                            options: {
                                namedExport: true
                            }
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: '[local]',
                                },
                                localsConvention: 'camelCaseOnly'
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                path: PROJECT_ROOT, 
                                sourceMap: true,
                                config: {
                                    path: './postcss.config.cjs'
                                }
                            }
                        },
                        'sass-loader',
                    ]
                },
            ]
        },

        resolve: {
            extensions: [".ts", ".tsx", ".js"]
        },

        plugins: [
            new webpack.BannerPlugin(banner),
        ],
        // --- END: LOGIC MOVED FROM original forEach LOOP ---
    };
    
    // --- START: ESM (Module) Overrides ---
    if (target === 'module') {
        config.experiments = {
            outputModule: true, 
        };
        config.output.library = {
            type: 'module'
        };
        // Clean up unneeded legacy library fields for true ESM
        delete config.output.libraryTarget;
        delete config.output.library.name;
    }
    // --- END: ESM (Module) Overrides ---


    // --- END: LOGIC FROM original createConfig ---
    
    return config;
});

// 4. Export the final array
module.exports = multiconfig;