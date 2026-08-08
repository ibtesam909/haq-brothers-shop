import { Hero } from "@/components/home/hero"
import { BrandMarquee } from "@/components/home/brand-marquee"
import { FeatureBar } from "@/components/home/feature-bar"
import { CategoryGrid } from "@/components/home/category-grid"
import { FeaturedProducts } from "@/components/home/featured-products"
import { DealBanner } from "@/components/home/deal-banner"
import { Testimonials } from "@/components/home/testimonials"
import { Newsletter } from "@/components/home/newsletter"

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandMarquee />
      <div className="pt-16 sm:pt-20">
        <FeatureBar />
      </div>
      <CategoryGrid />
      <FeaturedProducts />
      <DealBanner />
      <Testimonials />
      <Newsletter />
    </>
  )
}
