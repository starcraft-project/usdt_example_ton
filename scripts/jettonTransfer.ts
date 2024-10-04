import { Address, beginCell, toNano } from '@ton/core';
import { Minter } from '../wrappers/jetton-minter';
import { Wallet } from '../wrappers/jetton-wallet';
import { compile, NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {


    const tokenWallet = provider.open(
        Wallet.createFromAddress(Address.parse('EQBs_q49LkNy6FcxfX6GSJt25cl4vxcCT7_4pm150DJ0FUIe'))
    );

    await tokenWallet.sendTransfer(
        provider.sender(), {
            value: toNano(0.05),
            toAddress: Address.parse('EQDXhXVKQM0DkdNg4dtBjcZ4vHUY-fiyjpGJC_XPqutq9wqg'),
            queryId: 2,
            fwdAmount: toNano(0.01),
            jettonAmount: toNano(0.1)
        }
    );

}