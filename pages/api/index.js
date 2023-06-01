import { getClient } from './db'

export default async function handler(req, res) {
  // get db
  const client = await getClient()

  // get day and set its time to zero since we only really care about the date part of the Date object
  let { day, month, year } = req.query
  let date = new Date(year, month, day)
  date.setUTCHours(0, 0, 0, 0)

  // find day in db
  const filter = { day: date }
  const collection = client.db('timetracker').collection('days')
  const documents = await collection.findOne(filter)

  // handle requests
  if (req.method === 'GET') {
    // return the day
    return res.status(200).json(documents)
  } else if (req.method === 'POST') {
    // get task from request body
    const task = req.body
    // create the new task from request body task
    const newTask = {
      from: new Date(task.from),
      to: new Date(task.to),
      name: task.name,
    }
    // add new task to date passed in the url parameter
    if (documents !== null) {
      // date was found, push the task to its tasks array
      const update = { $push: { tasks: newTask } }

      const result = await collection.updateOne(filter, update)

      return res.status(201).json(result)
    } else {
      // date was not found, create a new one and add the task
      const newDay = {
        day: new Date(date),
        tasks: [newTask],
      }

      const result = await collection.insertOne(newDay)
      newDay._id = result.insertedId

      return res.status(201).json(newDay)
    }
  } else if (req.method === 'DELETE') {
    // get index of task to delete from the day's tasks array
    const { index } = req.query

    // delete work around using unset and pull (open issue in mongodb)
    const unset = { $unset: { [`tasks.${index}`]: 1 } }
    let result = await collection.updateOne(filter, unset)
    const pull = { $pull: { tasks: null } }
    result = await collection.updateOne(filter, pull)

    return res.status(201).json(result)
  }
}
