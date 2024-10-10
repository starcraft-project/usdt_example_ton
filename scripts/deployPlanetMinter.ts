import { toNano } from '@ton/core';
import { PlanetMinter } from '../wrappers/PlanetMinter';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const planetMinter = provider.open(PlanetMinter.createFromConfig({}, await compile('PlanetMinter')));

    await planetMinter.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(planetMinter.address);

    // run methods on `planetMinter`
}
