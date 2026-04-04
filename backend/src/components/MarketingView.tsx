import { DefaultTemplate } from '@payloadcms/next/templates'
import { MarketingPage } from './MarketingPage'

type Props = {
  initPageResult: any
  params?: any
  searchParams?: any
}

export function MarketingView({ initPageResult, params, searchParams }: Props) {
  const { req, locale, permissions, visibleEntities } = initPageResult
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      visibleEntities={{
        collections: visibleEntities?.collections,
        globals: visibleEntities?.globals,
      }}
    >
      <MarketingPage />
    </DefaultTemplate>
  )
}
