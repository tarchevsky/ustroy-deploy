import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // USER_TOKEN должен быть в env или можно захардкодить для теста
    const USER_TOKEN =
      process.env.CRM_USER_TOKEN || '1753103270642x580481445228543900'

    const crmRes = await fetch(
      process.env.NEXT_PUBLIC_FORM_API_ENDPOINT || '',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'USER_TOKEN': USER_TOKEN,
        },
        body: JSON.stringify(data),
      },
    )

    const crmResult = await crmRes.json()

    if (!crmRes.ok) {
      return NextResponse.json(
        { success: false, error: crmResult },
        { status: crmRes.status },
      )
    }

    return NextResponse.json({ success: true, crm: crmResult }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
