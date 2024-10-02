import { toNano, Address } from '@ton/core';
import { PlanetPool } from '../wrappers/PlanetPool';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    // const planetPool = provider.open(PlanetPool.createFromConfig({
    //     ownerAddress: Address.parse('0QADyTLHHkylyNZ5D20yOz8-cmJIkR3YutFHU3daMbscwblD'),
    //     usdtReceiverAddress: Address.parse('0QAfZmN8Nm-UAnY7PsUJbG7shIxOPq4GvORb4-ViBCm326FC'),
    //     jettonMasterAddress: Address.parse('kQCa7Jvi8coRjSg8j5i2Sd_GTQ0I6meBB0djYwgH4zgYziX6'),
    //     jettonWalletCode: await compile('jetton-wallet')
    // }, await compile('PlanetPool')));
    //
    // await planetPool.sendDeploy(provider.sender(), toNano('0.05'));
    //
    // await provider.waitForDeploy(planetPool.address);

    // run methods on `planetPool`

    const planetPool = provider.open(PlanetPool.createFromAddress(Address.parse("kQAut6qEGZlY7I-4IP5nE4TZ7SdYhQ00un0tzAEjcTMuZz0x")))
    // await planetPool.sendUpdateEnergy(provider.sender(), {
    //     value: toNano('0.1'),
    //     energy_value: 11,
    //     user_address: Address.parse("0QADyTLHHkylyNZ5D20yOz8-cmJIkR3YutFHU3daMbscwblD")
    // })
    const myEnergy = await planetPool.getUserEnergyData(Address.parse("0QADyTLHHkylyNZ5D20yOz8-cmJIkR3YutFHU3daMbscwblD"));
    console.log(myEnergy)
}
