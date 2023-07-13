
import DashboardCard from '@/components/DashboardCard'
import {Box, Card, Paper} from '@mui/material'
import Image from 'next/image'
import styles from './page.module.css'

export default function Home({children}:{children:React.ReactNode}) {

  return (
      <>
          <Paper>
              <h1>Dashboard</h1>
          </Paper>
      </>

  )
}
