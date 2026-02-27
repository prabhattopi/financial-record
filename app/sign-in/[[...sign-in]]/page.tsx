import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    // This div forces the content to the center of the screen
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  )
}