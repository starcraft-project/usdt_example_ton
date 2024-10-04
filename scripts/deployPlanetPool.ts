import { toNano, Address } from '@ton/core';
import { PlanetPool } from '../wrappers/PlanetPool';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    // **Testnet**
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


    // **Mainnet**
    // const planetPool = provider.open(PlanetPool.createFromConfig({
    //     ownerAddress: Address.parse('EQADyTLHHkylyNZ5D20yOz8-cmJIkR3YutFHU3daMbscwV8M'),
    //     usdtReceiverAddress: Address.parse('UQBl8bmTJ-pMYqxkxL_KwxhZfR4hdLgveQVHLtVW4TGvoNxy'),
    //     jettonMasterAddress: Address.parse('EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'),
    //     jettonWalletCode: await compile('jetton-wallet')
    // }, await compile('PlanetPool')));
    //
    // await planetPool.sendDeploy(provider.sender(), toNano('0.05'));
    //
    // await provider.waitForDeploy(planetPool.address);


    // run methods on `planetPool`

    // 1. update energy valie
    const planetPool = provider.open(PlanetPool.createFromAddress(Address.parse('EQDXhXVKQM0DkdNg4dtBjcZ4vHUY-fiyjpGJC_XPqutq9wqg')));
    // await planetPool.sendUpdateEnergy(provider.sender(), {
    //     value: toNano('0.01'),
    //     energy_value: 11,
    //     user_address: Address.parse("UQADyTLHHkylyNZ5D20yOz8-cmJIkR3YutFHU3daMbscwQLJ")
    // })
    const myEnergy = await planetPool.getUserEnergyData(Address.parse("UQADyTLHHkylyNZ5D20yOz8-cmJIkR3YutFHU3daMbscwQLJ"));
    console.log(myEnergy)

    // 2. get usdt and update data
    // const usdtActive = await planetPool.getUserActivation(Address.parse("0QADyTLHHkylyNZ5D20yOz8-cmJIkR3YutFHU3daMbscwblD"));
    // console.log(usdtActive);


    // 3. owner withdraw token

    await planetPool.sendWithdraw(provider.sender(), {
        queryId: 2,
        pool_address: Address.parse('EQBHFfrwNnVkidzRh2WF13-hSF2wH1tWKeWVsGvUmS8xOJJN')
    });


}
