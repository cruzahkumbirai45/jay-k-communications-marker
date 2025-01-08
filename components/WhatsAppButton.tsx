import { Button } from "@/components/ui/button"

export function WhatsAppButton({ adminNumber }: { adminNumber: string }) {
  const handleClick = () => {
    window.open(`https://wa.me/${adminNumber}`, '_blank')
  }

  return (
    <Button onClick={handleClick} className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600">
      Contact Admin via WhatsApp
    </Button>
  )
}

