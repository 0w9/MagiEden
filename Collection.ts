import fetch from "node-fetch";
var now = require("performance-now")

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getCollections(max_amount: number = 0, limit: number = 100): Promise<void> {

    let pulled = 0;

    while(pulled <= max_amount) {
        const url = `https://api-mainnet.magiceden.dev/v2/collections?offset=${pulled}&limit=${limit}`
        let collections = await ( await fetch(url) ).json()

        let mapped = [];

        for(let collection of collections) {
            mapped.push({symbol: collection.symbol, name: collection.name, image: collection.image,})
        }

        try {
            await prisma.collections.createMany({ data: mapped })
        } catch (error) {console.log(`Error ${error} occurred while creating collections.`)}

        pulled += collections.length;
    }
}

export async function SaveCollectionFP(): Promise<void> {
    const collections = await prisma.collections.findMany();

    for(let collection of collections) {
        for (let i = 0; i < 10; i++) {
            let url = `https://api-mainnet.magiceden.dev/v2/collections/${collection.symbol}/stats`
            let response = (await (await fetch(url)).json())
            let FP = response.floorPrice / 1000000000;

            console.log(collection)
            // @ts-ignore
            await prisma.floor_prices.create({data: {symbol: collection.symbol, timestamp_ms: new Date().getTime(), fp_lamports: FP,}})

            await new Promise(r => setTimeout(r, 5000));
        }

    }
}

// getCollections will round to the next 100. So the limit can be set to 100 to prevent a) API spams and b) long loading times.
//getCollections(100);

console.log(`DONE! Starting to save FPs.`)
SaveCollectionFP();