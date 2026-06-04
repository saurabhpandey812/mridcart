import React from 'react';
import './TestimonialsSection.css';

const REVIEWS = [
  {
    quote:
      "I'm absolutely in love with the quality and style. My order arrived quickly and customer service was fantastic!",
    author: 'Jessica P.',
  },
  {
    quote:
      'Finally, a store that gets it right. Great fit, premium materials, and prices that make sense.',
    author: 'Mike R.',
  },
  {
    quote:
      'The piece I bought is even more beautiful in person. This is my new favorite store!',
    author: 'Sarah L.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="testimonials" aria-labelledby="reviews-heading">
      <div className="section-wrap">
        <header className="section-head">
          <h2 id="reviews-heading" className="section-head-title serif">
            What Our Customers Say
          </h2>
          <span className="section-head-line" />
        </header>

        <div className="testimonials-grid">
          {REVIEWS.map((review) => (
            <blockquote key={review.author} className="testimonial-card">
              <p>&ldquo;{review.quote}&rdquo;</p>
              <footer>— {review.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
