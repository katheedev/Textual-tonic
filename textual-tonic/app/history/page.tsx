'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function History() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch('api/history')
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      }
    }
    fetchHistory()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Text</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Polarity</TableHead>
              <TableHead>Subjectivity</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.text.substring(0, 50)}...</TableCell>
                <TableCell>{item.sentiment}</TableCell>
                <TableCell>{item.polarity.toFixed(2)}</TableCell>
                <TableCell>{item.subjectivity.toFixed(2)}</TableCell>
                <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}