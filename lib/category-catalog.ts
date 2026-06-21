export type CatalogProduct = {
  id: string
  name: string
  slug: string
  price: number
  artisan: string
  artisanSlug?: string
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
    subcategory: "necklace",
    tags: ["necklace", "statement-pieces", "handmade-collection"],
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
    subcategory: "earrings",
    tags: ["earrings", "beaded-jewellery", "statement-pieces"],
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
    subcategory: "crochet-jewellery",
    tags: ["earrings", "crochet-jewellery"],
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
    subcategory: "necklace",
    tags: ["necklace", "beaded-jewellery"],
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
    subcategory: "crochet-jewellery",
    tags: ["earrings", "crochet-jewellery", "handmade-collection"],
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
    subcategory: "bracelets",
    tags: ["bracelets", "beaded-jewellery"],
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
    subcategory: "mens-kurtas",
    tags: ["mens", "mens-kurtas", "mens-block-print"],
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
    subcategory: "womens-sarees",
    tags: ["womens", "womens-sarees", "womens-handloom"],
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
    subcategory: "womens-kurtas-kurtis",
    tags: ["womens", "womens-embroidery"],
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
    subcategory: "womens-sarees",
    tags: ["womens", "womens-sarees", "womens-hand-painted"],
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
    subcategory: "mens-shirts",
    tags: ["mens", "mens-shirts", "mens-casual-wear"],
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
    subcategory: "mens-kurtas",
    tags: ["mens", "mens-festive-wear", "mens-handloom"],
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
    subcategory: "handmade-accents",
    tags: ["handmade-accents"],
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
    subcategory: "wall-decor",
    tags: ["wall-decor"],
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
    subcategory: "room-decor",
    tags: ["room-decor"],
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
    subcategory: "festive-decor",
    tags: ["festive-decor"],
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
    subcategory: "room-decor",
    tags: ["room-decor"],
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
    subcategory: "festive-decor",
    tags: ["festive-decor"],
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
    subcategory: "protein-laddoo",
    tags: ["protein-laddoo", "gift-worthy", "bestsellers"],
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
    subcategory: "festive-collection",
    tags: ["sweet-treats", "festive-collection", "gift-worthy"],
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
    subcategory: "laddoo",
    tags: ["laddoo", "sweet-treats", "regional-specialties"],
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
    subcategory: "gift-worthy",
    tags: ["gift-worthy", "custom-food"],
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
    subcategory: "laddoo",
    tags: ["laddoo", "sweet-treats", "healthy-organic"],
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
    subcategory: "savoury",
    tags: ["savoury", "regional-specialties"],
  },
]

export const categoryCatalog: Record<string, CategoryConfig> = {
  jewellery: {
    slug: "jewellery",
    breadcrumb: "Jewellery",
    title: "Stories You Can Wear",
    subtitle: "Hand-crafted jewellery, each piece carries the soul of its maker.",
    subcategories: [
      { id: "earrings", label: "Earrings", icon: "✦" },
      { id: "rings", label: "Rings" },
      { id: "bracelets", label: "Bracelets" },
      { id: "necklace", label: "Necklace" },
      { id: "beaded-jewellery", label: "Beaded Jewellery" },
      { id: "crochet-jewellery", label: "Crochet Jewellery" },
      { id: "handmade-collection", label: "Handmade Collection" },
      { id: "statement-pieces", label: "Statement Pieces" },
    ],
    products: jewelleryProducts,
  },
  clothing: {
    slug: "clothing",
    breadcrumb: "The Loom Series",
    title: "Threads of Tradition",
    subtitle: "Handwoven textiles woven with purpose, warmth, and generations of skill.",
    subcategories: [
      { id: "mens", label: "Men's Clothing", icon: "✦" },
      { id: "womens", label: "Women's Clothing" },
    ],
    products: clothingProducts,
  },
  decor: {
    slug: "decor",
    breadcrumb: "Home & Living",
    title: "Soulful Spaces",
    subtitle: "Handcrafted décor that brings warmth, ritual, and story into everyday living.",
    subcategories: [
      { id: "home-decor", label: "Home Décor", icon: "✦" },
      { id: "wall-decor", label: "Wall Décor" },
      { id: "room-decor", label: "Room Décor" },
      { id: "interior-decor", label: "Interior Décor" },
      { id: "lippan-art", label: "Lippan Art" },
      { id: "pichwai-art", label: "Pichwai Art" },
      { id: "festive-decor", label: "Festive Décor" },
      { id: "handmade-accents", label: "Handmade Accents" },
    ],
    products: decorProducts,
  },
  "custom-laddoos": {
    slug: "custom-laddoos",
    breadcrumb: "Custom Food",
    title: "Flavours of Home",
    subtitle: "Custom laddoos and gift boxes made with love by home chefs across India.",
    subcategories: [
      { id: "laddoo", label: "Laddoo", icon: "✦" },
      { id: "protein-laddoo", label: "Protein Laddoo" },
      { id: "sweet-treats", label: "Sweet Treats" },
      { id: "savoury", label: "Savoury" },
      { id: "gift-worthy", label: "Gift-Worthy" },
      { id: "festive-collection", label: "Festive Collection" },
      { id: "bestsellers", label: "Bestsellers" },
      { id: "custom-food", label: "Custom" },
    ],
    products: foodProducts,
  },
}

export function getCategoryConfig(slug: string) {
  return categoryCatalog[slug] ?? null
}

export type CatalogSubcategoryOption = {
  id: string
  label: string
  icon?: string
  categoryRoute?: string
}

export function getCatalogSubcategoryOptions(categoryRoute = ""): CatalogSubcategoryOption[] {
  if (categoryRoute) {
    return categoryCatalog[categoryRoute]?.subcategories ?? []
  }

  return Object.entries(categoryCatalog).flatMap(([route, config]) =>
    config.subcategories.map((subcategory) => ({
      ...subcategory,
      categoryRoute: route,
    })),
  )
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
