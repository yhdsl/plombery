import { Button, Card, Title } from '@tremor/react'

import { getApiUrl } from '@/repository'

const LoginPage: React.FC = () => {
  return (
    <div className="bg-slate-100 dark:bg-slate-950 h-screen flex justify-center items-center">
      <Card className="w-auto">
        <div className="w-12 rounded-full mx-auto mb-4">
          <img src="/mario-pipe-flower.png" alt="Plombery logo" />
        </div>

        <Title className="mb-6">欢迎使用 Plombery</Title>

        <Button
          onClick={() => {
            location.href = `${getApiUrl()}/auth/login`
          }}
          size="lg"
          color="indigo"
          className="shadow-none w-full"
        >
          登录
        </Button>
      </Card>
    </div>
  )
}

export default LoginPage
