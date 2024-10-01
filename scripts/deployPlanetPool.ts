import { toNano } from '@ton/core';
import { PlanetPool } from '../wrappers/PlanetPool';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const planetPool = provider.open(PlanetPool.createFromConfig({}, await compile('PlanetPool')));

    await planetPool.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(planetPool.address);

    // run methods on `planetPool`
}
