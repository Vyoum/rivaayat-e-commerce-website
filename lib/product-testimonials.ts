export type ProductTestimonial = {
  title: string
  quote: string
  name: string
  location: string
  initials: string
  purchased: string
  rating: number
}

export const MOCK_PRODUCT_TESTIMONIALS: ProductTestimonial[] = [
  {
    title: "The Calendar That Changed Everything",
    quote:
      "I bought the seed calendar as a gift for my mother. She planted every seed, and now our balcony is full of marigolds. It reminded us that small acts of care can bloom into something beautiful.",
    name: "Rahul Mehta",
    location: "Mumbai",
    initials: "RM",
    purchased: "Purchased: Bloom Calendar 2025",
    rating: 5,
  },
  {
    title: "A Necklace With a Story",
    quote:
      "Knowing the artisan who made my necklace made it so much more meaningful. The craftsmanship is extraordinary — I wear it every day and always receive compliments.",
    name: "Priya Sharma",
    location: "Delhi",
    initials: "PS",
    purchased: "Purchased: Mandala Crochet Earrings",
    rating: 5,
  },
  {
    title: "Tradition in Our Home",
    quote:
      "The handwoven textile we ordered transformed our living room. It carries warmth, history, and the hands that made it — exactly what we wanted for our home.",
    name: "Ananya Reddy",
    location: "Hyderabad",
    initials: "AR",
    purchased: "Purchased: Heritage Textile Collection",
    rating: 5,
  },
]

/** Display stats shown when a product has no real reviews yet */
export const MOCK_REVIEW_SUMMARY = {
  averageRating: 4.8,
  totalCount: 24,
}
