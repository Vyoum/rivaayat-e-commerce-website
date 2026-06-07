import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getOurStoryContent } from "@/lib/our-story-content"

export default async function OurStoryPage() {
  const content = await getOurStoryContent()

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0">
          <img
            src={content.heroImageUrl}
            alt="Artisans and makers"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl">
            <span className="text-sm font-sans tracking-[0.3em] uppercase text-primary">
              {content.eyebrow}
            </span>
            <h1 className="mt-4 text-4xl font-serif font-light text-foreground sm:text-5xl lg:text-6xl">
              {content.title}
            </h1>
            <p className="mt-6 text-lg font-sans text-muted-foreground leading-relaxed">
              {content.intro}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="font-serif text-3xl">{content.sectionTitle}</CardTitle>
              <CardDescription className="font-sans text-base text-muted-foreground">
                {content.sectionSubtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 text-lg font-sans text-muted-foreground leading-relaxed">
                {content.bodyParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
                <p className="border-l-2 border-primary/40 pl-4 text-foreground font-medium italic">
                  {content.quote}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
