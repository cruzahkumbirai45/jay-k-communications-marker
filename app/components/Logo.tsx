import Image from 'next/image'

export default function Logo() {
  return (
    <div className="flex justify-center mb-8">
      <Image
        src="/placeholder.svg?height=60&width=200"
        alt="JayK Communications Logo"
        width={200}
        height={60}
        priority
      />
    </div>
  )
}

