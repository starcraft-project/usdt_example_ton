import {
    Blockchain,
    prettyLogTransactions,
    printTransactionFees,
    SandboxContract,
    TreasuryContract
} from '@ton/sandbox';
import { Cell, toNano, beginCell } from '@ton/core';
import { PlanetPool } from '../wrappers/PlanetPool';

import { Minter } from '../wrappers/jetton-minter';
import { Wallet } from '../wrappers/jetton-wallet';

import '@ton/test-utils';
import { compile } from '@ton/blueprint';

import { buildOnchainMetadata } from '../scripts/jetton-helpers';

const jettonParams = {
    name: 'test USDT',
    description: 'This is description for test USDT',
    symbol: 'testUSDT',
    image: 'https://i.ibb.co/J3rk47X/USDT-ocean.webp'
};

let jetton_content_metadata = buildOnchainMetadata(jettonParams);


describe('PlanetPool', () => {
    let jettonMinterCode: Cell;


    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let treasury: SandboxContract<TreasuryContract>;

    let usdtReceiver: SandboxContract<TreasuryContract>;

    let planetPool: SandboxContract<PlanetPool>;

    let jettonMinter: SandboxContract<Minter>;
    let jettonWallet_deployer: SandboxContract<Wallet>;


    beforeAll(async () => {
        jettonMinterCode = await compile('jetton-minter');
    });

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        treasury = await blockchain.treasury('treasury');
        usdtReceiver = await blockchain.treasury('usdtReceiver');

        jettonMinter = blockchain.openContract(Minter.createFromConfig(
            {
                total_supply: 0n,
                admin_address: deployer.address!!,
                next_admin_address: treasury.address!!,
                jetton_wallet_code: await compile('jetton-wallet'),
                metadata_url: jetton_content_metadata
            }, jettonMinterCode));

        jettonWallet_deployer = blockchain.openContract(
            Wallet.createFromConfig(
                { owner_address: deployer.address, jetton_master_address: jettonMinter.address },
                await compile('jetton-wallet')
            )
        );

    });

    it('should deploy and mint successfully', async () => {

        // 1. send mint transaction 

        let master_msg = beginCell()
            .storeUint(395134233, 32) // opCode: TokenTransferInternal / 0x178d4519
            .storeUint(0, 64) // query_id
            .storeCoins(toNano('300')) // jetton_amount
            .storeAddress(jettonMinter.address) // from_address
            .storeAddress(deployer.address) // response_address
            .storeCoins(0) // forward_ton_amount
            .storeUint(0, 1) // whether forward_payload or not
            .endCell();

        const mintResult = await jettonMinter.sendMint(deployer.getSender(), { // 0x642b7d07
            value: toNano('1.5'),
            queryID: 10,
            toAddress: deployer.address,
            tonAmount: toNano('0.4'),
            master_msg: master_msg
        });

        // printTransactionFees(mintResult.transactions);

        // const deployerJettonData = await jettonWallet_deployer.getJettonData();
        // console.log(deployerJettonData[0]);
        //
        // const minterContractData = await jettonMinter.getJettonData();
        // console.log(minterContractData[0]);


        // 2.deploy planet pool contract
        planetPool = blockchain.openContract(PlanetPool.createFromConfig({
            ownerAddress: deployer.address,
            usdtReceiverAddress: usdtReceiver.address,
            jettonMasterAddress: jettonMinter.address,
            jettonWalletCode: await compile('jetton-wallet')
        }, await compile('PlanetPool')));

        // console.log(deployer.address)
        // console.log(usdtReceiver.address);
        // console.log(jettonMinter.address)


        const deployResultOfPlanetPool = await planetPool.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResultOfPlanetPool.transactions).toHaveTransaction({
            from: deployer.address,
            to: planetPool.address,
            deploy: true,
            success: true
        });


        await planetPool.getPlanetPoolData();

        // printTransactionFees(deployResultOfPlanetPool.transactions)
        // prettyLogTransactions(deployResultOfPlanetPool.transactions)


        // 3. set user energy
        let userEnergy = await planetPool.getUserEnergyData(deployer.address);
        console.log(' userEnergy ', userEnergy);

        await planetPool.sendUpdateEnergy(deployer.getSender(), {
            value: toNano('0.1'),
            energy_value: 11,
            user_address: deployer.address
        });
        userEnergy = await planetPool.getUserEnergyData(deployer.address);
        console.log('user energy value ', userEnergy);

        // 4. transfer token to pool
        const transferResult = await jettonWallet_deployer.sendTransfer(
            deployer.getSender(), {
                value: toNano(1),
                toAddress: planetPool.address,
                queryId: 2,
                fwdAmount: toNano(0.01),
                jettonAmount: toNano(100)
            }
        );

        // printTransactionFees(transferResult.transactions);
        // prettyLogTransactions(transferResult.transactions);
        let deployerJettonData = await jettonWallet_deployer.getJettonData();
        console.log(deployerJettonData[0]);


        // 5. result
        const my_deposit = await planetPool.getUserActivation(deployer.address);
        console.log('my_deposit ', my_deposit);


        // 6. get receiver amount
        // const receiverJettonWallet = blockchain.openContract(
        //     Wallet.createFromConfig(
        //         { owner_address: usdtReceiver.address, jetton_master_address: jettonMinter.address },
        //         await compile('jetton-wallet')
        //     )
        // );
        //
        // console.log(await receiverJettonWallet.getJettonData())

        // 6. planet pool contract balance
        const planetPoolContractAddress = await jettonMinter.getWalletAddress(planetPool.address);
        let planetPoolWallet = blockchain.openContract(Wallet.createFromAddress(planetPoolContractAddress));
        console.log((await planetPoolWallet.getJettonData())[0]);


        // 7.send withdraw tx
        const withdrawTx = await planetPool.sendWithdraw(deployer.getSender(), {
            queryId: 2,
            pool_address: planetPoolWallet.address
        });
        printTransactionFees(withdrawTx.transactions);

        planetPoolWallet = blockchain.openContract(Wallet.createFromAddress(planetPoolContractAddress));
        console.log((await planetPoolWallet.getJettonData())[0]);

        // 8. usdt receiver
        const usdtReceiverAddress = await jettonMinter.getWalletAddress(usdtReceiver.address);

        const usdtReceiverWallet = blockchain.openContract(Wallet.createFromAddress(usdtReceiverAddress));
        console.log((await usdtReceiverWallet.getJettonData())[0]);

    });
});
