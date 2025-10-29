"use client"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-4">About TechHub</h1>
        <p className="text-muted-foreground mb-8">Your trusted source for premium electronics and gadgets</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-muted-foreground">
              To provide customers with the latest technology products at competitive prices with exceptional service.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-xl font-bold mb-3">Quality Assurance</h3>
            <p className="text-muted-foreground">
              All products are carefully selected and tested to ensure they meet our high quality standards.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-xl font-bold mb-3">Customer Support</h3>
            <p className="text-muted-foreground">
              Our dedicated support team is available 24/7 to help you with any questions or concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
