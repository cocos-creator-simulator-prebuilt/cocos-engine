const { join, normalize } = require('path');
const { ensureDir, emptyDir } = require('fs-extra');
const { magenta } = require('chalk');

const { buildEngine, StatsQuery } = require('@cocos/ccbuild');


const USE_SPINE_38 = true;


function excludeFeatures(features, exclude) {
    return features.filter((feature) => !exclude.includes(feature));
}

(async function exec () {
    const engineDir = normalize(join(__dirname, '..', '..'));
    const engineOutput = join(engineDir, 'bin', 'native-preview');

    console.log(`==> engineDir: ${engineDir}`);
    console.log(`==> engineOutput: ${engineOutput}`);

    await ensureDir(engineOutput);
    await emptyDir(engineOutput);

    const buildMode = 'PREVIEW';
    const buildPlatform = 'NATIVE';

    const statsQuery = await StatsQuery.create(engineDir);

    let excludedSpine = USE_SPINE_38 ? 'spine-4.2' : 'spine-3.8';
    const allFeatures = excludeFeatures(statsQuery.getFeatures(), ['gfx-webgl', 'gfx-webgl2', 'gfx-empty', 'gfx-webgpu', 'vendor-google', excludedSpine]);

    console.log(`-----------------------------------------------`);
    console.log(`==> features: ${allFeatures.join(', \n')}`);
    console.log(`-----------------------------------------------`);

    const buildOptions = {
        engine: engineDir,
        out: engineOutput,
        moduleFormat: 'system',
        compress: false,
        targets: 'chrome 80',
        split: true,
        nativeCodeBundleMode: 'wasm',
        platform: buildPlatform,
        mode: buildMode,
        features: allFeatures,
        flags: {
            DEBUG: true,
            SERVER_MODE: false,
        },
    };
    await buildEngine(buildOptions);

}());
