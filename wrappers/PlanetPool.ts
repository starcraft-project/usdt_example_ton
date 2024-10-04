import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
    toNano,
    Dictionary,
    DictionaryValue, TupleItemSlice
} from '@ton/core';

export type PlanetPoolConfig = {
    ownerAddress: Address,
    usdtReceiverAddress: Address,
    jettonMasterAddress: Address,
    jettonWalletCode: Cell;
};


const CellRef: DictionaryValue<Cell> = {
    serialize: (src, builder) => {
        builder.storeSlice(src.beginParse());
    },
    parse: (src) => src.asCell()
};

export function planetPoolConfigToCell(config: PlanetPoolConfig): Cell {
    const empty = Dictionary.empty(Dictionary.Keys.BigUint(256), CellRef);
    return beginCell()
        .storeAddress(config.ownerAddress)
        .storeAddress(config.usdtReceiverAddress)
        .storeAddress(config.jettonMasterAddress)
        .storeRef(config.jettonWalletCode)
        .storeDict(null)
        .storeDict(null)
        .endCell();
}

export class PlanetPool implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {
    }

    static createFromAddress(address: Address) {
        return new PlanetPool(address);
    }

    static createFromConfig(config: PlanetPoolConfig, code: Cell, workchain = 0) {
        const data = planetPoolConfigToCell(config);
        const init = { code, data };
        return new PlanetPool(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell()
        });
    }

    async sendUpdateEnergy(provider: ContractProvider, via: Sender, opts: {
        queryId?: number;
        value?: bigint;
        energy_value: number;
        user_address: Address;
    }) {
        const messageBody = beginCell()
            .storeUint(0x333, 32)
            .storeUint(opts.queryId || 0, 64)
            .storeAddress(opts.user_address)
            .storeUint(opts.energy_value, 32)
            .endCell();

        await provider.internal(via, {
            value: opts.value ?? toNano('0.01'),
            body: messageBody
        });
    }

    async sendWithdraw(provider: ContractProvider, via: Sender, opts: {
        queryId?: number;
        pool_address: Address;
    }) {
        const messageBody = beginCell()
            .storeUint(0x444, 32)
            .storeUint(opts.queryId || 0, 64)
            .storeUint(toNano(200), 64)
            .storeAddress(opts.pool_address)
            .endCell();

        await provider.internal(via, {
            value: toNano('0.1'),
            body: messageBody
        });
    }


    async getOwnerAddress(provider: ContractProvider): Promise<Address> {
        const result = await provider.get('get_total_deposit', []);
        return result.stack.readAddress();
    }


    async getJettonMaster(provider: ContractProvider): Promise<Address> {
        const result = await provider.get('get_total_deposit', []);
        result.stack.readAddress();
        return result.stack.readAddress();
    }

    async getWalletCode(provider: ContractProvider): Promise<Cell> {
        const result = await provider.get('get_total_deposit', []);
        result.stack.readAddress();
        result.stack.readAddress();
        return result.stack.readCell();
    }

    async getTotalDepositAmount(provider: ContractProvider): Promise<bigint> {
        const result = await provider.get('get_total_deposit', []);
        result.stack.readAddress();
        result.stack.readAddress();
        result.stack.readCell();
        return result.stack.readBigNumber();
    }


    async getUserEnergyData(provider: ContractProvider, address: Address): Promise<bigint> {
        const result = await provider.get('get_user_energy', [
            {
                type: 'slice',
                cell: beginCell().storeAddress(address).endCell()
            } as TupleItemSlice
        ]);
        return result.stack.readBigNumber();
    }

    async getUserActivation(provider: ContractProvider, address: Address): Promise<bigint> {
        const result = await provider.get('get_user_activation', [
            {
                type: 'slice',
                cell: beginCell().storeAddress(address).endCell()
            } as TupleItemSlice
        ]);
        return result.stack.readBigNumber();
    }


    async getPlanetPoolData(provider: ContractProvider) {
        const result = await provider.get('get_planet_pool_data', []);
        // console.log(result.stack.readAddress());
        // console.log(result.stack.readAddress());
        // console.log(result.stack.readAddress());
    }


}
