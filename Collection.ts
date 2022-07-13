import fetch from "node-fetch";

export async function getCollections(offset?: number) {

    if(typeof offset !== "undefined") {
        const url = `https://api-devnet.magiceden.dev/v2/collections?offset=0&limit=${offset}`

        const response = await (await fetch(url)).json()

        console.log(response);
    } else {
        const url = `https://api-devnet.magiceden.dev/v2/collections?offset=0&limit=499`

        const response = await (await fetch(url)).json()

        console.log(response);
    }

}

getCollections();