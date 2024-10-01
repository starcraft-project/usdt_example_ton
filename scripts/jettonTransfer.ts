import { Address, beginCell, toNano } from '@ton/core';
import { Minter } from '../wrappers/jetton-minter';
import { Wallet } from '../wrappers/jetton-wallet';
import { compile, NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {
    console.log("hello,world ");

    const tokenWallet = provider.open(
        Wallet.createFromAddress(Address.parse("kQCA9UoJyXZ9aAbGlWntHSCq4MOynUB2q8pkJm-CX1UFXhxd"))
    )

    await tokenWallet.sendTransfer(
        provider.sender(),{
            value: toNano(0.1),
            toAddress: Address.parse('kQDqstOVUJk8g4xVwnFVSmhCDOIO_pDVEf34sn2s5EnKSN8C'),
            queryId: 2,
            fwdAmount: toNano(0.01),
            jettonAmount: toNano(100)
        }
    )

}