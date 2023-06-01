import axios from 'axios'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'

function TaskForm({ date }) {
  const [from, setFrom] = useState(new Date())
  const [to, setTo] = useState(new Date())
  const [name, setName] = useState('')
  const queryClient = useQueryClient()

  const createTask = (task) => {
    return axios.post(
      `/api?month=${date.getMonth()}&day=${date.getDate()}&year=${date.getFullYear()}`,
      task,
    )
  }

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries('days')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const task = {
      from,
      to,
      name,
    }

    createTaskMutation.mutate(task)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        required
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        type="datetime-local"
      />{' '}
      -{' '}
      <input
        required
        value={to}
        onChange={(e) => setTo(e.target.value)}
        type="datetime-local"
      />
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />
      <button type="submit" disabled={createTaskMutation.isCreating}>
        {createTaskMutation.isCreating ? 'Adding Task...' : 'Add Task'}
      </button>
    </form>
  )
}

export default TaskForm
