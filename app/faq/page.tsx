"use client";

import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Link from 'next/link';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How long does it take to receive my order?",
    answer: "We have a 1 week lead time from date of payment. Bags are made to order, ensuring you get exactly what you want. Once payment is received, your beanbag will be crafted and prepared for shipping."
  },
  {
    question: "Do you ship nationwide?",
    answer: "Yes! We courier to all areas in South Africa. Shipping costs will be calculated at checkout based on your location."
  },
  {
    question: "Are the beanbags UV resistant?",
    answer: "Absolutely! Our beanbags feature 100% polyester UV resistant outer covers that are designed to withstand South African sun conditions."
  },
  {
    question: "What are the beanbags filled with?",
    answer: "Our beanbags are filled with recycled polystyrene balls, making them both comfortable and environmentally friendly."
  },
  {
    question: "What are the dimensions of the beanbags?",
    answer: "Our standard beanbags measure 1.4m x 1.1m, providing the perfect size for poolside lounging."
  },
  {
    question: "Can I choose different fabrics?",
    answer: "Yes! We offer a variety of funky fabrics to choose from. You can select your preferred fabric during the ordering process."
  },
  {
    question: "Where are the beanbags made?",
    answer: "All our beanbags are proudly made in Durban, South Africa by skilled local craftsmen."
  },
  {
    question: "How do I care for my beanbag?",
    answer: "Simply hose down with water when needed. The UV resistant cover and recycled polystyrene filling make them easy to maintain and long-lasting."
  },
  {
    question: "Do you offer warranties?",
    answer: "Yes, we offer a 2-year stitch guarantee on all our beanbags. We're confident in the quality of our construction."
  },
  {
    question: "Can I order multiple beanbags?",
    answer: "Of course! You can order as many as you need. Contact us for bulk order pricing and arrangements."
  }
];

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-base-content mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our pool beanbags. Can't find what you're looking for? Contact us!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <Card key={index} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-base-content pr-4">
                    {faq.question}
                  </h3>
                  <div className={`transform transition-transform duration-200 ${openFAQ === index ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {openFAQ === index && (
                <div className="px-6 pb-6">
                  <div className="border-t border-base-200 pt-4">
                    <p className="text-base-content/80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Still Have Questions */}
        <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm text-center">
          <h2 className="text-2xl font-bold text-base-content mb-4">Still Have Questions?</h2>
          <p className="text-base-content/70 mb-6 text-lg">
            Can't find the answer you're looking for? We're here to help!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button className="btn btn-primary btn-lg">
                Contact Us
              </Button>
            </Link>
            <Link href="/shop">
              <Button className="btn btn-outline btn-lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}