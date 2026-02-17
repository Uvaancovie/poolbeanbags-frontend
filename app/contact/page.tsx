"use client";

import { useState } from 'react';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { API_BASE } from 'lib/api';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
        <div className="p-8 shadow-xl border border-[var(--border)] bg-[var(--card)] max-w-md w-full text-center">
          <h1 className="text-2xl font-light text-[var(--fg)] mb-4">Message Sent</h1>
          <p className="text-[var(--fg-muted)] mb-6">
            Thank you for contacting us. We'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-primary"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero Section */}
      <div className="bg-[var(--primary)] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-light text-[var(--primary-foreground)] mb-6">
            Contact Us
          </h1>
          <p className="text-2xl text-[var(--primary-foreground)]/95 max-w-2xl mx-auto leading-relaxed font-light">
            Have questions about our pool beanbags? Need help with your order? We're here to help.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="p-10 shadow-xl border border-[var(--border)] bg-[var(--card)] rounded-2xl">
            <h2 className="text-3xl font-light text-[var(--fg)] mb-8">
              Send us a Message
            </h2>

            {error && (
              <div className="mb-6 p-4 border border-[var(--destructive)] bg-[var(--destructive)]/10 text-[var(--destructive)]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-light text-[var(--fg)] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--secondary)] text-[var(--fg)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-[var(--fg)] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--secondary)] text-[var(--fg)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-[var(--fg)] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="071 234 5678"
                  className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--secondary)] text-[var(--fg)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-[var(--fg)] mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--secondary)] text-[var(--fg)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="p-8 shadow-xl border border-[var(--border)] bg-[var(--card)]">
              <h2 className="text-2xl font-light text-[var(--fg)] mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-light text-[var(--fg)]">Email</h3>
                  <p className="text-[var(--fg-muted)]">orders@poolbeanbags.co.za</p>
                </div>

                <div>
                  <h3 className="font-light text-[var(--fg)]">Phone</h3>
                  <p className="text-[var(--fg-muted)]">071 234 5678</p>
                </div>

                <div>
                  <h3 className="font-light text-[var(--fg)]">Location</h3>
                  <p className="text-[var(--fg-muted)]">Durban North, South Africa</p>
                </div>
              </div>
            </div>

            <div className="p-8 shadow-xl border border-[var(--border)] bg-[var(--card)]">
              <h2 className="text-2xl font-light text-[var(--fg)] mb-6">Business Hours</h2>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--fg-muted)]">Monday - Friday</span>
                  <span className="font-light">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--fg-muted)]">Saturday</span>
                  <span className="font-light">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--fg-muted)]">Sunday</span>
                  <span className="font-light">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}