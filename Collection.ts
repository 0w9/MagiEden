import fetch from "node-fetch";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getCollections(max_amount?: number) {
    let pulled = 0;

    while(true) {
        const url = `https://api-mainnet.magiceden.dev/v2/collections?offset=${pulled}&limit=500`
        let collections = await ( await fetch(url) ).json()

        let mapped = [];

        for(let collection of collections) {
            mapped.push({
                symbol: collection.symbol,
                name: collection.name,
                image: collection.image,
            })
        }

        await prisma.collections.createMany({ data: mapped })

        pulled = pulled + mapped.length;
    }
}

export async function SaveCollectionFP() {
    const collections = await prisma.collections.findMany();

    for(let collection of collections) {
        for (let i = 0; i < 10; i++) {
            let url = `https://api-mainnet.magiceden.dev/v2/collections/${collection.symbol}/stats`
            let response = (await (await fetch(url)).json())
            let FP = response.floorPrice;
            console.log(FP);

            // @ts-ignore
            console.log(collection)
            await prisma.floor_prices.create({
                data: {
                    id: 1,
                    symbol: collection.symbol,
                    timestamp_ms: 1,
                    fp_lamports: FP,
                }
            })

            await new Promise(r => setTimeout(r, 5000));
        }

    }
}

export async function hacking() {
    const res = await fetch("https://api-mainnet.magiceden.io/rpc/getCollectionMetricsSeries/danger_valley_ducks?edge_cache=trueres.json()")
}
//getCollections();
//getCollections(500);
SaveCollectionFP()