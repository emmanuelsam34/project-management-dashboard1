import { Button } from "@/components/ui/button";

export default function Home() {
return (
  <div className="">
    <Button>
      Primary
    </Button>
    <Button variant="secondary">
      Secondary
    </Button>
    <Button variant="destructive">
      Destructive
    </Button>
    <Button variant="ghost">
      Ghost
    </Button>
    <Button variant="outline">
      Outline
    </Button>
    <Button variant="muted">
      Link
    </Button>
  </div>
 )
}
