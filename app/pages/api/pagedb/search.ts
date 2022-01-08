// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


type Data = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    console.log(req.query.phrase)
    const  searchPhrase  = req.query.phrase as string;
    let data = await fetch(`http://localhost:5000/api/db?phrase=${searchPhrase}`)

    data = await data.json()

    res.status(200).json(data);
}
