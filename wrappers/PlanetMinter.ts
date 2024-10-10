import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type PlanetMinterConfig = {};

export function planetMinterConfigToCell(config: PlanetMinterConfig): Cell {
    return beginCell().endCell();
}

export class PlanetMinter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new PlanetMinter(address);
    }

    static createFromConfig(config: PlanetMinterConfig, code: Cell, workchain = 0) {
        const data = planetMinterConfigToCell(config);
        const init = { code, data };
        return new PlanetMinter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
