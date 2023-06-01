import { MongoClient } from 'mongodb'

let cachedClient = null

async function getClient() {
  if (cachedClient) {
    return cachedClient
  }

  cachedClient = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  return cachedClient
}

export { getClient }
