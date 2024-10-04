import { Address, beginCell, toNano } from '@ton/core';
import { Minter } from '../wrappers/jetton-minter';
import { Wallet } from '../wrappers/jetton-wallet';
import { compile, NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {



    const tokenWallet = provider.open(
        Wallet.createFromAddress(Address.parse("EQA0mgbAAbuuCpNG9U2PkxLi7wBNWrtqVyNkSMsfT3tTvofb"))
    )

    await tokenWallet.sendTransfer(
        provider.sender(),{
            value: toNano(0.1),
            toAddress: Address.parse('kQBkjmS0wCWV_EKjBkLbgKIJtsue210sykcF2TCajIrL7ug4'),
            queryId: 2,
            fwdAmount: toNano(0.01),
            jettonAmount: toNano(200)
        }
    )

}