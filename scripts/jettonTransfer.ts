import { Address, beginCell, toNano } from '@ton/core';
import { Minter } from '../wrappers/jetton-minter';
import { Wallet } from '../wrappers/jetton-wallet';
import { compile, NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {
    console.log("hello,world ");

    const tokenWallet = provider.open(
        Wallet.createFromAddress(Address.parse("kQA0mgbAAbuuCpNG9U2PkxLi7wBNWrtqVyNkSMsfT3tTvjxR"))
    )

    await tokenWallet.sendTransfer(
        provider.sender(),{
            value: toNano(0.1),
            toAddress: Address.parse('kQAut6qEGZlY7I-4IP5nE4TZ7SdYhQ00un0tzAEjcTMuZz0x'),
            queryId: 2,
            fwdAmount: toNano(0.01),
            jettonAmount: toNano(100)
        }
    )

}