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

        planetMinter = blockchain.openContract(PlanetMinter.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await planetMinter.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: planetMinter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and planetMinter are ready to use
    });
});
