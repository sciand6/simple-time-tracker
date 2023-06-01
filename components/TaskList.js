import axios from 'axios'
import React from 'react'
import { useMutation, useQueryClient } from 'react-query'

function TaskList({ tasks, date }) {
  const queryClient = useQueryClient()

  const deleteTask = (index) => {
    return axios.delete(
      `/api?month=${date.getMonth()}&day=${date.getDate()}&year=${date.getFullYear()}&index=${index}`,
    )
  }

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries('days')
    },
  })

  return (
    <ul>
      {tasks.map((task, index) => {
        const from = new Date(task.from)
        const to = new Date(task.to)
        return (
          <div key={index}>
            <li>
              {`${from.getHours()}:${new String(from.getMinutes()).padStart(
                2,
                '0',
              )}`}
              -
              {`${to.getHours()}:${new String(to.getMinutes()).padStart(
                2,
                '0',
              )}`}{' '}
              - {task.name}
            </li>
            <button onClick={() => deleteTaskMutation.mutate(index)}>
              Delete
            </button>
          </div>
        )
      })}
    </ul>
  )
}

export default TaskList
