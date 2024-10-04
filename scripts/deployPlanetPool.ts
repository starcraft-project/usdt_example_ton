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

    // 1. update energy valie
    const planetPool = provider.open(PlanetPool.createFromAddress(Address.parse('kQBkjmS0wCWV_EKjBkLbgKIJtsue210sykcF2TCajIrL7ug4')));
    // await planetPool.sendUpdateEnergy(provider.sender(), {
    //     value: toNano('0.01'),
    //     energy_value: 13,
    //     user_address: Address.parse("0QADyTLHHkylyNZ5D20yOz8-cmJIkR3YutFHU3daMbscwblD")
    // })
    // const myEnergy = await planetPool.getUserEnergyData(Address.parse("0QADyTLHHkylyNZ5D20yOz8-cmJIkR3YutFHU3daMbscwblD"));
    // console.log(myEnergy)

    // 2. get usdt and update data
    // const usdtActive = await planetPool.getUserActivation(Address.parse("0QADyTLHHkylyNZ5D20yOz8-cmJIkR3YutFHU3daMbscwblD"));
    // console.log(usdtActive);


    // 3. owner withdraw token

    await planetPool.sendWithdraw(provider.sender(), {
        queryId: 2,
        pool_address: Address.parse('EQCmi1_Olm7Ms-8bw75npMQw03kKnzU0BAMGJ2KBzX0Ga_g9')
    });


}
