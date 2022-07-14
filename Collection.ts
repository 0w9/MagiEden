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

export async function SaveCollectionFP(symbol: string) {
    while (true) {
        let url = `https://api-mainnet.magiceden.dev/v2/collections/${symbol}/stats`
        let response =  (await (await fetch(url)).json())
        let FP = response.floorPrice;
        console.log(FP);

        // @ts-ignore
        await prisma.floor_prices.create({
            data: {
                symbol,
                timestamp_ms: Date.now(),
                fp_lamports: FP,
            }
        })

        await new Promise(r => setTimeout(r, 5000));
    }
}

//getCollections();
//getCollections(500);

SaveCollectionFP("maskedmvmnt")