export type CatalogProduct = {
  id: string
  name: string
  slug: string
  price: number
  artisan: string
  location: string
  image: string
  badge?: "HANDCRAFTED" | "CUSTOMISABLE"
  subcategory?: string
  subcategoryLabel?: string
  categoryRoute?: string
  categoryLabel?: string
  inStock?: boolean
  tags?: string[]
  association?: string[]
  swatchImages?: string[]
}

export type CategoryConfig = {
  slug: string
  breadcrumb: string
  title: string
  subtitle: string
  subcategories: { id: string; label: string; icon?: string }[]
  products: CatalogProduct[]
}

const jewelleryProducts: CatalogProduct[] = [
  {
    id: "j1",
    name: "Aadhya Temple Necklace",
    slug: "mandala-crochet-earrings",
    price: 4250,
    artisan: "Asha",
    location: "Rajasthan",
    image: "/intricate-brass-temple-jewelry-earrings-with-tradi.jpg",
    badge: "HANDCRAFTED",
    subcategory: "beaded",
    tags: ["under-5000", "gold-plated"],
  },
  {
    id: "j2",
    name: "Kalyani Jhumka",
    slug: "mandala-crochet-earrings",
    price: 3800,
    artisan: "Priya",
    location: "Rajasthan",
    image: "/elegant-handmade-beaded-necklace-with-colorful-fab.jpg",
    badge: "CUSTOMISABLE",
    subcategory: "beaded",
    tags: ["under-5000", "gold-plated"],
  },
  {
    id: "j3",
    name: "Devika Crochet Earrings",
    slug: "mandala-crochet-earrings",
    price: 4450,
    artisan: "Kavitha",
    location: "Kutch",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&q=80",
    badge: "HANDCRAFTED",
    subcategory: "crochet",
    tags: ["under-5000"],
  },
  {
    id: "j4",
    name: "Esha Heritage Necklace",
    slug: "mandala-crochet-earrings",
    price: 5450,
    artisan: "Neha",
    location: "Gujarat",
    image: "/realistic-indian-woman-crafting-jewelry.jpg",
    badge: "HANDCRAFTED",
    subcategory: "beaded",
    tags: ["gold-plated"],
  },
  {
    id: "j5",
    name: "Mandala Crochet Earrings",
    slug: "mandala-crochet-earrings",
    price: 650,
    artisan: "Asha",
    location: "Rajasthan",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&q=80",
    badge: "HANDCRAFTED",
    subcategory: "crochet",
    tags: ["under-5000"],
  },
  {
    id: "j6",
    name: "Warli Bead Bracelet",
    slug: "mandala-crochet-earrings",
    price: 890,
    artisan: "Meera",
    location: "Maharashtra",
    image: "/warli-art-painted-wooden-bead-bracelet-with-tribal.jpg",
    badge: "CUSTOMISABLE",
    subcategory: "beaded",
    tags: ["under-5000"],
  },
]

const clothingProducts: CatalogProduct[] = [
  {
    id: "c1",
    name: "Indigo Block Print Kurta",
    slug: "mandala-crochet-earrings",
    price: 3450,
    artisan: "Lakshmi",
    location: "Jaipur",
    image: "/indian-artisan-woman-weaving-traditional-handloom-.jpg",
    badge: "HANDCRAFTED",
    subcategory: "loom",
    tags: ["under-5000"],
  },
  {
    id: "c2",
    name: "Handloom Cotton Stole",
    slug: "mandala-crochet-earrings",
    price: 2200,
    artisan: "Radha",
    location: "Varanasi",
    image: "/indian-artisan-weaving-handloom-fabric.jpg",
    badge: "HANDCRAFTED",
    subcategory: "loom",
    tags: ["under-5000"],
  },
  {
    id: "c3",
    name: "Kutch Embroidered Dupatta",
    slug: "mandala-crochet-earrings",
    price: 4800,
    artisan: "Fatima",
    location: "Kutch",
    image: "/indian-artisan-hands-creating-traditional-craft-wi.jpg",
    badge: "CUSTOMISABLE",
    subcategory: "textiles",
    tags: ["under-5000"],
  },
  {
    id: "c4",
    name: "Natural Dye Saree",
    slug: "mandala-crochet-earrings",
    price: 6200,
    artisan: "Sunita",
    location: "Odisha",
    image: "/indian-grandmother-making-protein-ladoo.jpg",
    badge: "HANDCRAFTED",
    subcategory: "textiles",
    tags: [],
  },
  {
    id: "c5",
    name: "Khadi Summer Shirt",
    slug: "mandala-crochet-earrings",
    price: 2950,
    artisan: "Anjali",
    location: "West Bengal",
    image: "/indian-brass-craftsman-working-traditional-temple-.jpg",
    badge: "HANDCRAFTED",
    subcategory: "loom",
    tags: ["under-5000"],
  },
  {
    id: "c6",
    name: "Heritage Weave Jacket",
    slug: "mandala-crochet-earrings",
    price: 5400,
    artisan: "Devendra",
    location: "Rajasthan",
    image: "/group-of-smiling-indian-women-artisans-in-colorful.jpg",
    badge: "CUSTOMISABLE",
    subcategory: "loom",
    tags: ["gold-plated"],
  },
]

const decorProducts: CatalogProduct[] = [
  {
    id: "d1",
    name: "Brass Urli Bowl",
    slug: "mandala-crochet-earrings",
    price: 3200,
    artisan: "Rajesh",
    location: "Moradabad",
    image: "/indian-brass-craftsman-working-traditional-temple-.jpg",
    badge: "HANDCRAFTED",
    subcategory: "brass",
    tags: ["under-5000"],
  },
  {
    id: "d2",
    name: "Hand-painted Warli Frame",
    slug: "mandala-crochet-earrings",
    price: 1800,
    artisan: "Savitri",
    location: "Maharashtra",
    image: "/warli-art-painted-wooden-bead-bracelet-with-tribal.jpg",
    badge: "HANDCRAFTED",
    subcategory: "living",
    tags: ["under-5000"],
  },
  {
    id: "d3",
    name: "Terracotta Votive Set",
    slug: "mandala-crochet-earrings",
    price: 1450,
    artisan: "Gopal",
    location: "Khurja",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&q=80",
    badge: "CUSTOMISABLE",
    subcategory: "living",
    tags: ["under-5000"],
  },
  {
    id: "d4",
    name: "Temple Bell Cluster",
    slug: "mandala-crochet-earrings",
    price: 2650,
    artisan: "Mohan",
    location: "Tamil Nadu",
    image: "/intricate-brass-temple-jewelry-earrings-with-tradi.jpg",
    badge: "HANDCRAFTED",
    subcategory: "brass",
    tags: ["under-5000"],
  },
  {
    id: "d5",
    name: "Jute Table Runner",
    slug: "mandala-crochet-earrings",
    price: 980,
    artisan: "Pooja",
    location: "Assam",
    image: "/indian-artisan-weaving-handloom-fabric.jpg",
    badge: "HANDCRAFTED",
    subcategory: "living",
    tags: ["under-5000"],
  },
  {
    id: "d6",
    name: "Brass Lotus Diya",
    slug: "mandala-crochet-earrings",
    price: 2100,
    artisan: "Vikram",
    location: "Uttar Pradesh",
    image: "/indian-artisan-hands-creating-traditional-craft-wi.jpg",
    badge: "HANDCRAFTED",
    subcategory: "brass",
    tags: ["under-5000"],
  },
]

const foodProducts: CatalogProduct[] = [
  {
    id: "f1",
    name: "Protein Ladoo Gift Box",
    slug: "mandala-crochet-earrings",
    price: 850,
    artisan: "Sunita",
    location: "Varanasi",
    image: "/indian-grandmother-making-protein-ladoo.jpg",
    badge: "CUSTOMISABLE",
    subcategory: "laddoos",
    tags: ["under-5000"],
  },
  {
    id: "f2",
    name: "Festive Mithai Hamper",
    slug: "mandala-crochet-earrings",
    price: 1200,
    artisan: "Kamla",
    location: "Delhi",
    image: "/indian-grandmother-making-protein-ladoo.jpg",
    badge: "CUSTOMISABLE",
    subcategory: "gifts",
    tags: ["under-5000"],
  },
  {
    id: "f3",
    name: "Gond Ladoo Assortment",
    slug: "mandala-crochet-earrings",
    price: 650,
    artisan: "Rekha",
    location: "Madhya Pradesh",
    image: "/realistic-indian-woman-crafting-jewelry.jpg",
    badge: "HANDCRAFTED",
    subcategory: "laddoos",
    tags: ["under-5000"],
  },
  {
    id: "f4",
    name: "Corporate Gifting Box",
    slug: "mandala-crochet-earrings",
    price: 2400,
    artisan: "Anita",
    location: "Mumbai",
    image: "/group-of-smiling-indian-women-artisans-in-colorful.jpg",
    badge: "CUSTOMISABLE",
    subcategory: "gifts",
    tags: ["under-5000"],
  },
  {
    id: "f5",
    name: "Rose & Almond Ladoo",
    slug: "mandala-crochet-earrings",
    price: 720,
    artisan: "Geeta",
    location: "Jaipur",
    image: "/indian-artisan-hands-creating-traditional-craft-wi.jpg",
    badge: "HANDCRAFTED",
    subcategory: "laddoos",
    tags: ["under-5000"],
  },
  {
    id: "f6",
    name: "Seasonal Sweet Crate",
    slug: "mandala-crochet-earrings",
    price: 1850,
    artisan: "Lata",
    location: "Pune",
    image: "/indian-brass-craftsman-working-traditional-temple-.jpg",
    badge: "CUSTOMISABLE",
    subcategory: "gifts",
    tags: ["under-5000"],
  },
]

export const categoryCatalog: Record<string, CategoryConfig> = {
  jewellery: {
    slug: "jewellery",
    breadcrumb: "Jewellery",
    title: "Stories You Can Wear",
    subtitle: "Hand-crafted jewellery, each piece carries the soul of its maker.",
    subcategories: [
      { id: "crochet", label: "Crochet Jewellery", icon: "✦" },
      { id: "beaded", label: "Beaded Jewellery" },
    ],
    products: jewelleryProducts,
  },
  clothing: {
    slug: "clothing",
    breadcrumb: "The Loom Series",
    title: "Threads of Tradition",
    subtitle: "Handwoven textiles woven with purpose, warmth, and generations of skill.",
    subcategories: [
      { id: "loom", label: "The Loom Series", icon: "✦" },
      { id: "textiles", label: "Handloom Textiles" },
    ],
    products: clothingProducts,
  },
  decor: {
    slug: "decor",
    breadcrumb: "Home & Living",
    title: "Soulful Spaces",
    subtitle: "Handcrafted décor that brings warmth, ritual, and story into everyday living.",
    subcategories: [
      { id: "living", label: "Home & Living", icon: "✦" },
      { id: "brass", label: "Brass & Heritage" },
    ],
    products: decorProducts,
  },
  "custom-laddoos": {
    slug: "custom-laddoos",
    breadcrumb: "Custom Food",
    title: "Flavours of Home",
    subtitle: "Custom laddoos and gift boxes made with love by home chefs across India.",
    subcategories: [
      { id: "laddoos", label: "Custom Laddoos", icon: "✦" },
      { id: "gifts", label: "Gift Boxes" },
    ],
    products: foodProducts,
  },
}

export function getCategoryConfig(slug: string) {
  return categoryCatalog[slug] ?? null
}

export function getProductBySlug(slug: string) {
  for (const config of Object.values(categoryCatalog)) {
    const product = config.products.find((entry) => entry.slug === slug)
    if (product) {
      return { product, category: config }
    }
  }
  return null
}
