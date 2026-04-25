import type { Metadata } from 'next'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
// @ts-ignore — CSS subpath nem szerepel a csomag típusaiban, de futáskor helyes
import '@payloadcms/next/css'
import './custom.scss'
import React from 'react'
import configPromise from '@payload-config'
import { importMap } from './admin/importMap.js'
import { Preloader } from '../../components/Preloader'

export const metadata: Metadata = {

  title: '[davelopment]® Admin',
}

const serverFunction = async (args: any) => {
  'use server'
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  })
}

type Args = {
  children: React.ReactNode
}

export default function Layout({ children }: Args) {
  return (
    <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
      <Preloader />
      {children}
    </RootLayout>
  )
}
