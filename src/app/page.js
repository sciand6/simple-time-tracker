'use client'

import { useQuery } from 'react-query'
import styles from './page.module.css'
import axios from 'axios'
import { useState } from 'react'
import TaskList from '../../components/TaskList'
import TaskForm from '../../components/TaskForm'

export default function Home() {
  const [date, setDate] = useState(new Date())

  const fetchDays = () => {
    return axios.get(
      `/api?month=${date.getMonth()}&day=${date.getDate()}&year=${date.getFullYear()}`,
    )
  }

  const { isLoading, isError, data } = useQuery(['days', date], fetchDays)

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  if (isError) {
    return <h2>Error</h2>
  }

  return (
    <main>
      <div>
        <h2>{date.toDateString()}</h2>
        <div className={styles.Container}>
          <button
            onClick={() =>
              setDate(new Date(new Date(date).setDate(date.getDate() - 1)))
            }
          >
            Prev
          </button>
          <button
            onClick={() =>
              setDate(new Date(new Date(date).setDate(date.getDate() + 1)))
            }
          >
            Next
          </button>
        </div>
        {data?.data?.tasks ? (
          <TaskList date={date} tasks={data?.data?.tasks} />
        ) : (
          <h3>Nothing logged for today</h3>
        )}
        <TaskForm date={date} />
      </div>
    </main>
  )
}
