import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { PlanetMinter } from '../wrappers/PlanetMinter';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('PlanetMinter', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('PlanetMinter');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let planetMinter: SandboxContract<PlanetMinter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        planetMinter = blockchain.openContract(PlanetMinter.createFromConfig({}, code));

        const deployResult = await planetMinter.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: planetMinter.address,
            deploy: true,
            success: true
        });
    });

    it('should deploy', async () => {
        console.log('hello, world ');
        const claimValueResult = await planetMinter.sendGetClaimValue(deployer.address);
        console.log(claimValueResult);

        const currentTime = await planetMinter.sendGetCurrentTime();
        console.log(currentTime);

    });
});
