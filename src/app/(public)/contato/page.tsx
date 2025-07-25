import { Mail, MessageSquare } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="container py-12 space-y-8">
      <h1 className="text-4xl font-bold text-center">
        Como você prefere falar com a gente?
      </h1>
      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        <Card className="flex flex-col items-center text-center">
          <CardHeader>
            <div className="rounded-full bg-purple-100 p-3 mb-4 flex justify-center items-center">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <CardDescription className="text-lg font-medium">
              E-mail
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">Tem alguma dúvida?</p>
            <Button
              variant="link"
              className="text-purple-600 justify-center"
              asChild
            >
              <a href="mailto:contato@synnerdata.com.br">
                contato@synnerdata.com.br
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center text-center">
          <CardHeader>
            <div className="rounded-full bg-purple-100 p-3 mb-4 flex justify-center items-center">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <CardDescription className="text-lg font-medium">
              WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Precisa de uma ajuda agora?
            </p>
            <p className="text-sm">Converse conosco pelo WhatsApp.</p>
            <Button
              variant="link"
              className="text-purple-600 justify-center mt-2"
              asChild
            >
              <a
                href="https://wa.me/5531997156609"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
