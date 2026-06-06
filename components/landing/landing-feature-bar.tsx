import { HandHeart, Leaf, HeartHandshake, Globe } from "lucide-react"

const features = [
  {
    icon: HandHeart,
    title: "Handcrafted",
    description: "Made with love by skilled artisans",
  },
  {
    icon: Leaf,
    title: "Conscious",
    description: "Sustainable choices for a better tomorrow",
  },
  {
    icon: HeartHandshake,
    title: "Heritage Led",
    description: "Preserving traditions, empowering communities",
  },
  {
    icon: Globe,
    title: "Delivered with Care",
    description: "Thoughtful packaging, mindful delivery",
  },
]

export function LandingFeatureBar() {
  return (
    <footer className="bg-[#B85A32] px-5 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto grid max-w-[960px] gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <Icon className="size-5 text-white/90" strokeWidth={1.25} />
              <p className="landing-feature-title mt-2.5 text-white">{feature.title}</p>
              <p className="landing-feature-desc mt-1 text-white/78">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </footer>
  )
}
