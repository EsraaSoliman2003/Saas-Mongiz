import React from 'react'
import Products from './_components/Products'

type Props = {}

export default function page({ }: Props) {
  return (
    <div className='container my-10'>
      <Products />
    </div>
  )
}